# CI/CD Documentation

This document describes the comprehensive CI/CD pipeline implemented for the ElizaOS-OpenCog-GnuCash Workers for Platforms project.

## Overview

The project uses GitHub Actions to provide rigorous building, testing, and deployment workflows with automated issue creation for failures.

## Workflows

### 1. CI - Build, Test & Quality (`ci.yml`)

**Triggered on:** Push to main/develop, Pull Requests, Manual dispatch

**Jobs:**
- **Code Quality & Linting**: ESLint and Prettier validation
- **TypeScript Build**: Compilation checks and error reporting
- **Python Tests**: Python dependencies and component testing
- **Integration Tests**: Full application testing with Wrangler dev server
- **Security Scanning**: NPM audit for vulnerabilities

**Features:**
- Continues on error to run all checks
- Creates automated issues on main branch failures
- Provides actionable remediation steps

### 2. Deploy to Cloudflare Workers (`deploy.yml`)

**Triggered on:** Push to main, Manual dispatch with environment selection

**Jobs:**
- **Pre-deployment Checks**: Validates configuration and credentials
- **Deploy to Staging**: Safe deployment to staging environment
- **Deploy to Production**: Production deployment with health checks

**Features:**
- Environment-specific deployments
- Post-deployment health checks
- Automated rollback recommendations on failure

### 3. PR Validation & Quality Gate (`pr-validation.yml`)

**Triggered on:** Pull Request events

**Jobs:**
- **PR Metadata**: Validates PR information and adds labels
- **Quick Validation**: Fast linting and build checks
- **Security Check**: Dependency auditing and secret scanning
- **Integration Preview**: Preview testing with test server
- **Quality Gate**: Overall assessment and approval recommendations

**Features:**
- PR labeling based on change size and type
- Security vulnerability blocking
- Quick feedback for developers

### 4. Unit Tests (`unit-tests.yml`)

**Triggered on:** Push, Pull Requests, Manual dispatch

**Jobs:**
- **Run Unit Tests**: Executes unit test suite
- **Generate Test Report**: Creates test result summaries
- **Report Issues**: Creates automated issues for test failures

### 5. Issue Management & Cleanup (`issue-management.yml`)

**Triggered on:** Daily schedule, Issue closure, Manual dispatch

**Jobs:**
- **Cleanup Resolved Issues**: Automatically closes stale automated issues
- **Validate Resolution**: Tracks issue resolution for improvements
- **Weekly Health Report**: Generates CI/CD system health metrics
- **Dependency Updates**: Checks for outdated packages

## Automated Issue Creation

When workflows fail, the system automatically creates GitHub issues with:

- **Descriptive titles** with relevant emojis for quick identification
- **Detailed error context** and failure information
- **Actionable remediation steps** for developers
- **Common issues** and troubleshooting guides
- **Relevant labels** for categorization and filtering

### Issue Categories

- `ci/cd`: CI/CD pipeline issues
- `code-quality`: ESLint/Prettier issues
- `typescript`: TypeScript compilation errors
- `build-error`: Build process failures
- `python`: Python component issues
- `dependencies`: Dependency and security issues
- `integration-tests`: Integration testing failures
- `cloudflare-workers`: Cloudflare Workers deployment issues
- `security`: Security vulnerabilities
- `testing`: Unit test failures
- `automated-issue`: All automated issues

## Setup Requirements

### Required Secrets

Add these secrets in your GitHub repository settings:

```
CLOUDFLARE_API_TOKEN    # Cloudflare API token with Workers edit permissions
```

### Optional Configuration

- Update deployment URLs in `deploy.yml` to match your Cloudflare Workers domains
- Customize security audit levels in workflows
- Adjust health check endpoints for your application

## Commands

### Local Development

```bash
# Install dependencies
npm ci

# Linting
npm run lint:check          # Check for issues
npm run lint               # Auto-fix issues
npm run format             # Format code

# Building
npm run build              # TypeScript compilation check

# Testing
npm run test               # Run integration tests
npm run test:unit          # Run unit tests (when implemented)

# Development server
npm run start              # Start Wrangler dev server

# Deployment
npm run deploy             # Deploy to Cloudflare Workers
```

### Python Components

```bash
# Install Python dependencies
pip install -r requirements.txt

# Run Python tests
python -m pytest gnucash_rest.py --verbose

# Check Python imports
python -c "import gnucash_rest; print('GnuCash REST module imports successfully')"
```

## Monitoring & Maintenance

### Health Reports

The system generates weekly health reports that include:
- Workflow success rates
- Automated issue statistics
- System performance metrics
- Improvement recommendations

### Issue Cleanup

- Automated issues older than 7 days are automatically closed
- Resolution tracking helps improve the CI/CD system
- Dependency update notifications are generated weekly

## Customization

### Adding New Workflows

1. Create `.yml` files in `.github/workflows/`
2. Follow the established pattern for automated issue creation
3. Include actionable remediation steps
4. Add appropriate labels and categorization

### Modifying Issue Templates

Update the issue creation scripts in workflows to:
- Add new error patterns
- Improve remediation steps
- Include additional debugging information
- Customize for your specific needs

## Troubleshooting

### Common Issues

1. **TypeScript Compilation Errors**: Run `npm run build` locally
2. **ESLint Failures**: Run `npm run lint` to auto-fix
3. **Security Vulnerabilities**: Run `npm audit fix`
4. **Integration Test Failures**: Check Wrangler configuration
5. **Deployment Issues**: Verify Cloudflare API token permissions

### Getting Help

- Check automated issue descriptions for specific guidance
- Review workflow logs in the Actions tab
- Consult the troubleshooting sections in issue templates
- Use the manual workflow dispatch for testing

## Contributing

When contributing to the CI/CD system:

1. Test workflows locally where possible
2. Update documentation for new features
3. Follow the established patterns for error handling
4. Include comprehensive remediation steps in automated issues
5. Add appropriate labels and categorization

## Security

- Secrets are properly configured and never logged
- Security scanning runs on all dependencies
- Automated issues highlight security vulnerabilities
- Regular dependency updates are tracked and reported