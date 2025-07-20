#!/usr/bin/env python3
"""
Service Orchestration and Health Monitoring for ElizaOS-OpenCog-GnuCash microservices.

This module provides orchestration capabilities and health monitoring for
the microservice infrastructure.
"""

import asyncio
import aiohttp
import time
from typing import Dict, List, Optional, Any, Callable
from dataclasses import dataclass
from enum import Enum

from .service_discovery import ServiceInfo, ServiceRegistry


class ServiceStatus(Enum):
    """Service health status."""
    HEALTHY = "healthy"
    UNHEALTHY = "unhealthy"
    UNKNOWN = "unknown"


@dataclass
class OrchestrationConfig:
    """Configuration for service orchestration."""
    health_check_interval: int = 30
    health_check_timeout: int = 5
    deployment_timeout: int = 300
    scaling_enabled: bool = True
    auto_restart_enabled: bool = True
    max_restart_attempts: int = 3


@dataclass
class ServiceHealth:
    """Health status of a service."""
    service_name: str
    status: ServiceStatus
    last_check: float
    response_time: Optional[float] = None
    error_message: Optional[str] = None
    consecutive_failures: int = 0


class HealthMonitor:
    """Monitor service health and availability."""
    
    def __init__(self, config: OrchestrationConfig):
        self.config = config
        self.health_status: Dict[str, ServiceHealth] = {}
        self.services: List[ServiceInfo] = []
        self._monitor_task: Optional[asyncio.Task] = None
        self._running = False
        self.health_change_callbacks: List[Callable] = []
    
    async def start(self):
        """Start health monitoring."""
        self._running = True
        if self._monitor_task is None:
            self._monitor_task = asyncio.create_task(self._monitor_loop())
    
    async def stop(self):
        """Stop health monitoring."""
        self._running = False
        if self._monitor_task:
            self._monitor_task.cancel()
            try:
                await self._monitor_task
            except asyncio.CancelledError:
                pass
    
    def add_service(self, service: ServiceInfo):
        """Add a service to monitor."""
        self.services.append(service)
        self.health_status[service.name] = ServiceHealth(
            service_name=service.name,
            status=ServiceStatus.UNKNOWN,
            last_check=0.0
        )
    
    def remove_service(self, service_name: str):
        """Remove a service from monitoring."""
        self.services = [s for s in self.services if s.name != service_name]
        self.health_status.pop(service_name, None)
    
    def add_health_change_callback(self, callback: Callable):
        """Add callback for health status changes."""
        self.health_change_callbacks.append(callback)
    
    async def check_service_health(self, service: ServiceInfo) -> ServiceHealth:
        """Check health of a single service."""
        health = self.health_status.get(service.name)
        if not health:
            health = ServiceHealth(
                service_name=service.name,
                status=ServiceStatus.UNKNOWN,
                last_check=0.0
            )
            self.health_status[service.name] = health
        
        start_time = time.time()
        
        try:
            if service.health_check_url:
                url = f"http://{service.host}:{service.port}{service.health_check_url}"
            else:
                url = f"http://{service.host}:{service.port}/health"
            
            timeout = aiohttp.ClientTimeout(total=self.config.health_check_timeout)
            async with aiohttp.ClientSession(timeout=timeout) as session:
                async with session.get(url) as response:
                    response_time = time.time() - start_time
                    
                    if response.status == 200:
                        old_status = health.status
                        health.status = ServiceStatus.HEALTHY
                        health.response_time = response_time
                        health.error_message = None
                        health.consecutive_failures = 0
                        
                        if old_status != ServiceStatus.HEALTHY:
                            await self._notify_health_change(health)
                    else:
                        await self._handle_health_failure(health, f"HTTP {response.status}")
        
        except Exception as e:
            await self._handle_health_failure(health, str(e))
        
        health.last_check = time.time()
        return health
    
    async def _handle_health_failure(self, health: ServiceHealth, error: str):
        """Handle health check failure."""
        old_status = health.status
        health.status = ServiceStatus.UNHEALTHY
        health.error_message = error
        health.consecutive_failures += 1
        
        if old_status != ServiceStatus.UNHEALTHY:
            await self._notify_health_change(health)
    
    async def _notify_health_change(self, health: ServiceHealth):
        """Notify callbacks of health status changes."""
        for callback in self.health_change_callbacks:
            try:
                if asyncio.iscoroutinefunction(callback):
                    await callback(health)
                else:
                    callback(health)
            except Exception:
                # Don't let callback errors stop monitoring
                pass
    
    async def _monitor_loop(self):
        """Main monitoring loop."""
        while self._running:
            try:
                tasks = []
                for service in self.services:
                    task = asyncio.create_task(self.check_service_health(service))
                    tasks.append(task)
                
                if tasks:
                    await asyncio.gather(*tasks, return_exceptions=True)
                
                await asyncio.sleep(self.config.health_check_interval)
                
            except asyncio.CancelledError:
                break
            except Exception:
                # Continue monitoring on unexpected errors
                await asyncio.sleep(self.config.health_check_interval)
    
    def get_service_health(self, service_name: str) -> Optional[ServiceHealth]:
        """Get health status of a service."""
        return self.health_status.get(service_name)
    
    def get_all_health_status(self) -> Dict[str, ServiceHealth]:
        """Get health status of all services."""
        return self.health_status.copy()


class ServiceOrchestrator:
    """Orchestrate microservices deployment and scaling."""
    
    def __init__(self, registry: ServiceRegistry, config: OrchestrationConfig):
        self.registry = registry
        self.config = config
        self.health_monitor = HealthMonitor(config)
        self.deployment_tasks: Dict[str, asyncio.Task] = {}
        self.restart_attempts: Dict[str, int] = {}
    
    async def start(self):
        """Start the orchestrator."""
        await self.health_monitor.start()
        self.health_monitor.add_health_change_callback(self._handle_health_change)
    
    async def stop(self):
        """Stop the orchestrator."""
        await self.health_monitor.stop()
        
        # Cancel any ongoing deployment tasks
        for task in self.deployment_tasks.values():
            task.cancel()
        
        if self.deployment_tasks:
            await asyncio.gather(*self.deployment_tasks.values(), return_exceptions=True)
    
    async def deploy_service(self, service_info: ServiceInfo) -> bool:
        """Deploy a new service."""
        try:
            # Register the service
            await self.registry.register_service(service_info)
            
            # Add to health monitoring
            self.health_monitor.add_service(service_info)
            
            # Reset restart attempts
            self.restart_attempts[service_info.name] = 0
            
            return True
            
        except Exception:
            return False
    
    async def undeploy_service(self, service_name: str) -> bool:
        """Undeploy a service."""
        try:
            # Remove from health monitoring
            self.health_monitor.remove_service(service_name)
            
            # Unregister from registry
            await self.registry.unregister_service(service_name)
            
            # Cancel any deployment tasks
            if service_name in self.deployment_tasks:
                self.deployment_tasks[service_name].cancel()
                del self.deployment_tasks[service_name]
            
            # Remove restart attempts tracking
            self.restart_attempts.pop(service_name, None)
            
            return True
            
        except Exception:
            return False
    
    async def scale_service(self, service_name: str, instances: int) -> bool:
        """Scale a service to the specified number of instances."""
        if not self.config.scaling_enabled:
            return False
        
        # This is a stub implementation
        # In a real system, this would interact with container orchestration
        return True
    
    async def restart_service(self, service_name: str) -> bool:
        """Restart a service."""
        if not self.config.auto_restart_enabled:
            return False
        
        attempts = self.restart_attempts.get(service_name, 0)
        if attempts >= self.config.max_restart_attempts:
            return False
        
        self.restart_attempts[service_name] = attempts + 1
        
        # This is a stub implementation
        # In a real system, this would restart the actual service
        return True
    
    async def _handle_health_change(self, health: ServiceHealth):
        """Handle health status changes."""
        if (health.status == ServiceStatus.UNHEALTHY and 
            self.config.auto_restart_enabled and
            health.consecutive_failures >= 3):
            
            await self.restart_service(health.service_name)
    
    def get_deployment_status(self) -> Dict[str, Any]:
        """Get status of all deployments."""
        return {
            "services": len(self.health_monitor.services),
            "healthy_services": len([
                h for h in self.health_monitor.health_status.values()
                if h.status == ServiceStatus.HEALTHY
            ]),
            "deployment_tasks": list(self.deployment_tasks.keys()),
            "restart_attempts": self.restart_attempts.copy()
        }