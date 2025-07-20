#!/usr/bin/env python3
"""
Service Discovery and Registry for ElizaOS-OpenCog-GnuCash microservices.

This module provides basic service discovery functionality for the microservice
architecture, allowing services to register and discover each other.
"""

import asyncio
import time
from typing import Dict, List, Optional, Any
from dataclasses import dataclass


@dataclass
class ServiceInfo:
    """Information about a registered service."""
    name: str
    host: str
    port: int
    health_check_url: str = ""
    metadata: Dict[str, Any] = None
    last_heartbeat: float = 0.0
    
    def __post_init__(self):
        if self.metadata is None:
            self.metadata = {}
        if self.last_heartbeat == 0.0:
            self.last_heartbeat = time.time()


class ServiceRegistry:
    """Basic service registry for microservice discovery."""
    
    def __init__(self, cleanup_interval: int = 60, service_timeout: int = 30):
        self.services: Dict[str, ServiceInfo] = {}
        self.cleanup_interval = cleanup_interval
        self.service_timeout = service_timeout
        self._cleanup_task: Optional[asyncio.Task] = None
        self._running = False
    
    async def start(self):
        """Start the service registry."""
        self._running = True
        if self._cleanup_task is None:
            self._cleanup_task = asyncio.create_task(self._cleanup_loop())
    
    async def stop(self):
        """Stop the service registry."""
        self._running = False
        if self._cleanup_task:
            self._cleanup_task.cancel()
            try:
                await self._cleanup_task
            except asyncio.CancelledError:
                pass
    
    async def register_service(self, service_info: ServiceInfo) -> bool:
        """Register a service."""
        service_info.last_heartbeat = time.time()
        self.services[service_info.name] = service_info
        return True
    
    async def unregister_service(self, service_name: str) -> bool:
        """Unregister a service."""
        if service_name in self.services:
            del self.services[service_name]
            return True
        return False
    
    async def get_service(self, service_name: str) -> Optional[ServiceInfo]:
        """Get information about a specific service."""
        return self.services.get(service_name)
    
    async def list_services(self) -> List[ServiceInfo]:
        """List all registered services."""
        return list(self.services.values())
    
    async def heartbeat(self, service_name: str) -> bool:
        """Update service heartbeat."""
        if service_name in self.services:
            self.services[service_name].last_heartbeat = time.time()
            return True
        return False
    
    async def _cleanup_loop(self):
        """Remove stale services periodically."""
        while self._running:
            try:
                await asyncio.sleep(self.cleanup_interval)
                current_time = time.time()
                stale_services = []
                
                for name, service in self.services.items():
                    if current_time - service.last_heartbeat > self.service_timeout:
                        stale_services.append(name)
                
                for name in stale_services:
                    del self.services[name]
                    
            except asyncio.CancelledError:
                break
            except Exception:
                # Continue cleanup loop on unexpected errors
                pass


class ServiceDiscovery:
    """Service discovery client with caching."""
    
    def __init__(self, registry: ServiceRegistry, cache_ttl: int = 10):
        self.registry = registry
        self.cache_ttl = cache_ttl
        self._cache: Dict[str, tuple] = {}  # service_name -> (service_info, timestamp)
    
    async def discover_service(self, service_name: str) -> Optional[ServiceInfo]:
        """Discover a service by name with caching."""
        current_time = time.time()
        
        # Check cache first
        if service_name in self._cache:
            service_info, timestamp = self._cache[service_name]
            if current_time - timestamp < self.cache_ttl:
                return service_info
        
        # Query registry
        service_info = await self.registry.get_service(service_name)
        if service_info:
            self._cache[service_name] = (service_info, current_time)
        
        return service_info
    
    async def discover_services_by_type(self, service_type: str) -> List[ServiceInfo]:
        """Discover services by type metadata."""
        all_services = await self.registry.list_services()
        return [
            service for service in all_services
            if service.metadata.get('type') == service_type
        ]
    
    def clear_cache(self):
        """Clear the discovery cache."""
        self._cache.clear()