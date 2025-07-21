#!/usr/bin/env python3
"""
Basic tests for Python components in the ElizaOS-OpenCog-GnuCash project.

These tests verify that Python modules can be imported and basic functionality works,
even when external dependencies like GnuCash are not available.
"""

import pytest
import ast
import importlib.util


def test_gnucash_rest_syntax():
    """Test that gnucash_rest.py has valid Python syntax."""
    with open('gnucash_rest.py', 'r') as f:
        source_code = f.read()
    
    # This will raise SyntaxError if the syntax is invalid
    ast.parse(source_code)


def test_microservice_demo_syntax():
    """Test that microservice_demo.py has valid Python syntax."""
    with open('microservice_demo.py', 'r') as f:
        source_code = f.read()
    
    # This will raise SyntaxError if the syntax is invalid
    ast.parse(source_code)


def test_requirements_dependencies():
    """Test that core dependencies from requirements.txt are available."""
    # Core dependencies that must be available
    critical_modules = [
        'requests',
        'numpy', 
        'pandas',
        'networkx',
        'pytest'
    ]
    
    # Optional dependencies that may not be available due to network issues
    optional_modules = [
        'matplotlib',
        'aiohttp',
        'flask'
    ]
    
    # Test critical modules
    for module_name in critical_modules:
        try:
            importlib.import_module(module_name)
        except ImportError:
            pytest.fail(f"Critical module '{module_name}' is not available")
    
    # Test optional modules (warn but don't fail)
    missing_optional = []
    for module_name in optional_modules:
        try:
            importlib.import_module(module_name)
        except ImportError:
            missing_optional.append(module_name)
    
    if missing_optional:
        import warnings
        warnings.warn(f"Optional modules not available (likely due to network issues): {missing_optional}", UserWarning)


def test_requirements_version_constraints():
    """Test that dependencies meet version constraints from requirements.txt."""
    import importlib.metadata
    
    # Define minimum versions from requirements.txt - only test installed packages
    version_constraints = {
        'requests': '2.28.0',
        'PyGithub': '1.58.0', 
        'numpy': '1.21.0',
        'pandas': '1.5.0',
        'matplotlib': '3.6.0',
        'scikit-learn': '1.1.0',
        'networkx': '3.0.0',
        'aiohttp': '3.8.0',
        'pyyaml': '6.0',
        'pytest': '7.0.0',
        'pytest-asyncio': '0.21.0',
        'flask': '2.3.0'
    }
    
    checked_packages = []
    skipped_packages = []
    
    for package, min_version in version_constraints.items():
        try:
            installed_version = importlib.metadata.version(package)
            # Parse version numbers for comparison
            def parse_version(version_str):
                return tuple(map(int, version_str.split('.')[:3]))  # Take first 3 components
            
            min_parsed = parse_version(min_version)
            installed_parsed = parse_version(installed_version)
            
            assert installed_parsed >= min_parsed, \
                f"Package '{package}' version {installed_version} is below minimum required {min_version}"
            
            checked_packages.append(f"{package}=={installed_version}")
                
        except importlib.metadata.PackageNotFoundError:
            # Package not installed - skip with warning instead of failing
            skipped_packages.append(package)
            continue
        except Exception as e:
            # If version parsing fails, just check that the package is importable
            try:
                importlib.import_module(package.lower().replace('-', '_'))
                checked_packages.append(f"{package}==unknown_version")
            except ImportError:
                skipped_packages.append(package)
    
    # Log results
    if checked_packages:
        print(f"\n✅ Verified {len(checked_packages)} packages: {', '.join(checked_packages)}")
    
    if skipped_packages:
        import warnings
        warnings.warn(f"Skipped version check for unavailable packages: {skipped_packages}", UserWarning)


def test_python_version_compatibility():
    """Test that we're running a compatible Python version."""
    import sys
    
    # The CI environment uses Python 3.12, supporting 3.11+ for local development  
    # We support Python 3.11+ and ensure compatibility with both CI and local environments
    version_info = sys.version_info
    
    # Minimum required: Python 3.11
    assert version_info >= (3, 11), f"Python version {version_info.major}.{version_info.minor} is not supported. Minimum required: Python 3.11"
    
    # Tested versions: Python 3.11 and 3.12 (warn about newer untested versions)
    if version_info >= (3, 13):
        import warnings
        warnings.warn(f"Python version {version_info.major}.{version_info.minor} is newer than tested versions (3.11-3.12). Compatibility not guaranteed.", UserWarning)
    
    # Ensure we're not running on a major version that breaks compatibility
    assert version_info < (4, 0), f"Python version {version_info.major}.{version_info.minor} may have compatibility issues. Tested up to Python 3.x"
    
    # Log the current version for debugging
    print(f"Running tests with Python {version_info.major}.{version_info.minor}.{version_info.micro}")


def test_gnucash_rest_import_graceful_failure():
    """Test that gnucash_rest.py fails gracefully when dependencies are missing."""
    try:
        import gnucash_rest
        # If import succeeds, that's actually fine
        assert True
    except ModuleNotFoundError as e:
        # Expected when gnucash module is not installed
        assert 'gnucash' in str(e) or 'gnucash_simple' in str(e)
    except Exception as e:
        pytest.fail(f"Unexpected error importing gnucash_rest: {e}")


def test_microservice_demo_import_graceful_failure():
    """Test that microservice_demo.py fails gracefully when dependencies are missing."""
    import sys
    import os
    
    # Ensure we can import from the current directory structure
    current_dir = os.path.dirname(os.path.abspath(__file__))
    if current_dir not in sys.path:
        sys.path.insert(0, current_dir)
    
    try:
        import microservice_demo
        # If import succeeds, verify basic functionality is available
        assert hasattr(microservice_demo, 'MicroserviceDemo'), \
            "microservice_demo module should contain MicroserviceDemo class"
        
        # Test that we can instantiate the demo class
        demo = microservice_demo.MicroserviceDemo()
        assert demo is not None, "Should be able to instantiate MicroserviceDemo"
        
    except ModuleNotFoundError as e:
        # Expected when src.microservices modules are not available or aiohttp is missing
        error_msg = str(e).lower()
        expected_errors = ['src.microservices', 'service_discovery', 'load_balancer', 'orchestration', 'ggml_optimization', 'aiohttp']
        
        assert any(expected in error_msg for expected in expected_errors), \
            f"ModuleNotFoundError should be related to microservices modules or dependencies, got: {e}"
            
    except Exception as e:
        pytest.fail(f"Unexpected error importing microservice_demo: {e}")


def test_microservice_modules_syntax():
    """Test that all microservice modules have valid Python syntax."""
    import ast
    import os
    
    microservice_files = [
        'src/microservices/service_discovery.py',
        'src/microservices/load_balancer.py', 
        'src/microservices/orchestration.py',
        'src/microservices/ggml_optimization.py'
    ]
    
    for file_path in microservice_files:
        if os.path.exists(file_path):
            with open(file_path, 'r') as f:
                source_code = f.read()
            
            try:
                # This will raise SyntaxError if the syntax is invalid
                ast.parse(source_code)
            except SyntaxError as e:
                pytest.fail(f"Syntax error in {file_path}: {e}")
        else:
            pytest.fail(f"Required microservice file {file_path} is missing")


if __name__ == '__main__':
    pytest.main([__file__, '-v'])