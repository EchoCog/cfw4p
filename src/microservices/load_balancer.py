#!/usr/bin/env python3
"""
Load Balancer and Configuration for ElizaOS-OpenCog-GnuCash microservices.

This module provides load balancing functionality and configuration generation
for various proxy servers like Envoy and Traefik.
"""

import asyncio
import random
from typing import List, Optional, Dict, Any
from dataclasses import dataclass
from enum import Enum

from .service_discovery import ServiceInfo


class LoadBalancingStrategy(Enum):
    """Load balancing strategies."""
    ROUND_ROBIN = "round_robin"
    RANDOM = "random"
    LEAST_CONNECTIONS = "least_connections"


@dataclass
class LoadBalancingConfig:
    """Configuration for load balancing."""
    strategy: str = "round_robin"
    health_check_enabled: bool = True
    health_check_interval: int = 30
    circuit_breaker_enabled: bool = True
    circuit_breaker_threshold: int = 5
    retry_attempts: int = 3


class LoadBalancer:
    """Basic load balancer for microservices."""
    
    def __init__(self, config: LoadBalancingConfig):
        self.config = config
        self.services: List[ServiceInfo] = []
        self.current_index = 0
        self.connection_counts: Dict[str, int] = {}
        self.circuit_breaker_states: Dict[str, bool] = {}
        self.failure_counts: Dict[str, int] = {}
    
    def add_service(self, service: ServiceInfo):
        """Add a service to the load balancer."""
        self.services.append(service)
        self.connection_counts[service.name] = 0
        self.circuit_breaker_states[service.name] = False
        self.failure_counts[service.name] = 0
    
    def remove_service(self, service_name: str):
        """Remove a service from the load balancer."""
        self.services = [s for s in self.services if s.name != service_name]
        self.connection_counts.pop(service_name, None)
        self.circuit_breaker_states.pop(service_name, None)
        self.failure_counts.pop(service_name, None)
    
    async def get_next_service(self) -> Optional[ServiceInfo]:
        """Get the next service based on the configured strategy."""
        available_services = [
            s for s in self.services
            if not self.circuit_breaker_states.get(s.name, False)
        ]
        
        if not available_services:
            return None
        
        if self.config.strategy == LoadBalancingStrategy.ROUND_ROBIN.value:
            service = available_services[self.current_index % len(available_services)]
            self.current_index += 1
            return service
        
        elif self.config.strategy == LoadBalancingStrategy.RANDOM.value:
            return random.choice(available_services)
        
        elif self.config.strategy == LoadBalancingStrategy.LEAST_CONNECTIONS.value:
            return min(available_services, 
                      key=lambda s: self.connection_counts.get(s.name, 0))
        
        return available_services[0]
    
    def increment_connection(self, service_name: str):
        """Increment connection count for a service."""
        if service_name in self.connection_counts:
            self.connection_counts[service_name] += 1
    
    def decrement_connection(self, service_name: str):
        """Decrement connection count for a service."""
        if service_name in self.connection_counts:
            self.connection_counts[service_name] = max(0, 
                self.connection_counts[service_name] - 1)
    
    def record_failure(self, service_name: str):
        """Record a failure for circuit breaker logic."""
        if not self.config.circuit_breaker_enabled:
            return
        
        self.failure_counts[service_name] = self.failure_counts.get(service_name, 0) + 1
        
        if self.failure_counts[service_name] >= self.config.circuit_breaker_threshold:
            self.circuit_breaker_states[service_name] = True
    
    def record_success(self, service_name: str):
        """Record a success and potentially reset circuit breaker."""
        self.failure_counts[service_name] = 0
        self.circuit_breaker_states[service_name] = False


class EnvoyConfigGenerator:
    """Generate Envoy proxy configuration."""
    
    def __init__(self, load_balancer: LoadBalancer):
        self.load_balancer = load_balancer
    
    def generate_config(self) -> Dict[str, Any]:
        """Generate Envoy configuration JSON."""
        clusters = []
        
        for service in self.load_balancer.services:
            cluster = {
                "name": service.name,
                "connect_timeout": "0.25s",
                "type": "STRICT_DNS",
                "lb_policy": self._get_envoy_lb_policy(),
                "load_assignment": {
                    "cluster_name": service.name,
                    "endpoints": [{
                        "lb_endpoints": [{
                            "endpoint": {
                                "address": {
                                    "socket_address": {
                                        "address": service.host,
                                        "port_value": service.port
                                    }
                                }
                            }
                        }]
                    }]
                }
            }
            
            if self.load_balancer.config.health_check_enabled and service.health_check_url:
                cluster["health_checks"] = [{
                    "timeout": "1s",
                    "interval": f"{self.load_balancer.config.health_check_interval}s",
                    "http_health_check": {
                        "path": service.health_check_url
                    }
                }]
            
            clusters.append(cluster)
        
        return {
            "static_resources": {
                "clusters": clusters
            }
        }
    
    def _get_envoy_lb_policy(self) -> str:
        """Map load balancing strategy to Envoy policy."""
        strategy_map = {
            LoadBalancingStrategy.ROUND_ROBIN.value: "ROUND_ROBIN",
            LoadBalancingStrategy.RANDOM.value: "RANDOM",
            LoadBalancingStrategy.LEAST_CONNECTIONS.value: "LEAST_REQUEST"
        }
        return strategy_map.get(self.load_balancer.config.strategy, "ROUND_ROBIN")


class TraefikConfigGenerator:
    """Generate Traefik proxy configuration."""
    
    def __init__(self, load_balancer: LoadBalancer):
        self.load_balancer = load_balancer
    
    def generate_config(self) -> Dict[str, Any]:
        """Generate Traefik configuration YAML."""
        services = {}
        
        for service in self.load_balancer.services:
            service_config = {
                "loadBalancer": {
                    "servers": [{
                        "url": f"http://{service.host}:{service.port}"
                    }]
                }
            }
            
            if self.load_balancer.config.health_check_enabled and service.health_check_url:
                service_config["loadBalancer"]["healthCheck"] = {
                    "path": service.health_check_url,
                    "interval": f"{self.load_balancer.config.health_check_interval}s"
                }
            
            services[service.name] = service_config
        
        return {
            "http": {
                "services": services
            }
        }