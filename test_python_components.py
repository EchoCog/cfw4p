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
    required_modules = [
        'requests',
        'numpy', 
        'pandas',
        'matplotlib',
        'networkx',
        'aiohttp',
        'pytest'
    ]
    
    for module_name in required_modules:
        try:
            importlib.import_module(module_name)
        except ImportError:
            pytest.fail(f"Required module '{module_name}' is not available")


def test_python_version_compatibility():
    """Test that we're running a compatible Python version."""
    import sys
    
    # The CI uses Python 3.11, but we should be compatible with 3.11+
    version_info = sys.version_info
    assert version_info >= (3, 11), f"Python version {version_info.major}.{version_info.minor} is not supported. Minimum required: Python 3.11"
    
    # Ensure we're not running on an unsupported future version
    assert version_info < (4, 0), f"Python version {version_info.major}.{version_info.minor} may have compatibility issues. Tested up to Python 3.x"


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
    try:
        import microservice_demo
        # If import succeeds, that's actually fine  
        assert True
    except ModuleNotFoundError as e:
        # Expected when src.microservices modules are not available
        assert 'src.microservices' in str(e)
    except Exception as e:
        pytest.fail(f"Unexpected error importing microservice_demo: {e}")


if __name__ == '__main__':
    pytest.main([__file__, '-v'])