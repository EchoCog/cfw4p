# 🚀 ElizaOS-OpenCog-GnuCash Workers for Platforms Deployment Guide

This guide will walk you through deploying the ElizaOS-OpenCog-GnuCash cognitive financial intelligence system to Cloudflare Workers for Platforms.

## 📋 Prerequisites

Before deploying, ensure you have:

1. **Cloudflare Account** with Workers for Platforms enabled
2. **Node.js 18+** installed locally
3. **Wrangler CLI** installed globally: `npm install -g wrangler`
4. **Git** for version control

## 🔧 Initial Setup

### 1. Clone and Install Dependencies

```bash
# Navigate to the project directory
cd elizoscog-workers-for-platforms

# Install dependencies
npm install

# If you encounter issues with better-sqlite3, install build tools:
# Ubuntu/Debian:
sudo apt-get install build-essential
# macOS:
xcode-select --install
```

### 2. Configure Cloudflare Authentication

```bash
# Login to Cloudflare
wrangler login

# Verify authentication
wrangler whoami
```

## 🗄️ Database Setup

### 1. Create D1 Database

```bash
# Create the D1 database
wrangler d1 create elizoscog-workers-for-platforms

# Note the database ID from the output and update wrangler.toml
```

### 2. Update wrangler.toml

Edit `wrangler.toml` and update the database configuration:

```toml
[[ d1_databases ]]
binding = "DB"
database_name = "elizoscog-workers-for-platforms"
database_id = "YOUR_DATABASE_ID_HERE"  # Replace with actual ID
preview_database_id = "YOUR_PREVIEW_DATABASE_ID_HERE"  # Replace with actual ID
```

### 3. Initialize Database Schema

```bash
# Run database migrations (if any)
wrangler d1 execute elizoscog-workers-for-platforms --file=./schema.sql
```

## 🌐 Workers for Platforms Configuration

### 1. Create Dispatch Namespace

```bash
# Create a dispatch namespace for your workers
wrangler dispatch-namespace create elizoscog-workers-for-platforms
```

### 2. Get Account ID

```bash
# Get your Cloudflare account ID
wrangler whoami

# Update wrangler.toml with your account ID
```

### 3. Set Environment Variables

Update `wrangler.toml` with your configuration:

```toml
[vars]
DISPATCH_NAMESPACE_NAME = "elizoscog-workers-for-platforms"
DISPATCH_NAMESPACE_ACCOUNT_ID = "YOUR_ACCOUNT_ID_HERE"  # Replace with actual ID
```

### 4. Set Secrets

```bash
# Set the dispatch namespace API token
echo "YOUR_API_TOKEN" | wrangler secret put DISPATCH_NAMESPACE_API_TOKEN

# You can get the API token from Cloudflare dashboard:
# My Profile > API Tokens > Create Token > Workers:Edit
```

## 🚀 Deployment

### 1. Test Locally

```bash
# Start local development server
npm run start

# Test the API endpoints
curl http://localhost:8787/api/accounts
curl -X POST http://localhost:8787/api/ask \
  -H "Content-Type: application/json" \
  -d '{"query": "What is my account balance?"}'
```

### 2. Deploy to Production

```bash
# Deploy to Cloudflare Workers
npm run deploy

# Or use wrangler directly
wrangler deploy
```

### 3. Verify Deployment

After deployment, you'll get a URL like: `https://elizoscog-workers-for-platforms.your-subdomain.workers.dev`

Test the deployment:

```bash
# Test the main dashboard
curl https://elizoscog-workers-for-platforms.your-subdomain.workers.dev/

# Test the API endpoints
curl https://elizoscog-workers-for-platforms.your-subdomain.workers.dev/api/accounts

curl -X POST https://elizoscog-workers-for-platforms.your-subdomain.workers.dev/api/ask \
  -H "Content-Type: application/json" \
  -d '{"query": "How much did I spend on groceries this month?"}'
```

## 🔧 Configuration Options

### Custom Domain (Optional)

To use a custom domain:

1. Add the domain to your Cloudflare account
2. Update `wrangler.toml`:

```toml
[env.production]
routes = [
  { pattern = "api.yourdomain.com/*", zone_name = "yourdomain.com" }
]
```

### Environment-Specific Configurations

You can create different environments:

```toml
[env.staging]
name = "elizoscog-workers-staging"
vars = { ENVIRONMENT = "staging" }

[env.production]
name = "elizoscog-workers-production"
vars = { ENVIRONMENT = "production" }
```

Deploy to specific environments:

```bash
# Deploy to staging
wrangler deploy --env staging

# Deploy to production
wrangler deploy --env production
```

## 🧠 ElizaOS-OpenCog Integration

### Connecting to Python Backend (Advanced)

For full ElizaOS-OpenCog integration, you'll need to:

1. **Deploy Python Services**: Host the Python components on a separate service (e.g., Google Cloud Run, AWS Lambda)
2. **Configure API Endpoints**: Update `src/elizoscog-api.ts` to point to your Python services
3. **Set Environment Variables**: Add backend URLs to your worker configuration

Example configuration:

```toml
[vars]
ELIZAOS_API_URL = "https://your-elizaos-service.com"
OPENCOG_API_URL = "https://your-opencog-service.com"
GNUCASH_API_URL = "https://your-gnucash-service.com"
```

### Real Data Integration

To connect real financial data:

1. **Update Database Schema**: Modify D1 database to store actual financial data
2. **Implement Data Connectors**: Add integrations to banks, financial institutions
3. **Configure Authentication**: Implement OAuth flows for financial data access

## 📊 Monitoring and Analytics

### 1. Enable Analytics

```bash
# Enable analytics in wrangler.toml
[analytics_engine_datasets]
binding = "ANALYTICS"
dataset = "elizoscog_analytics"
```

### 2. Set up Logging

Add logging to your worker:

```typescript
// In your worker code
console.log('Financial query processed:', query);
c.env.ANALYTICS.writeDataPoint({
  'blobs': ['financial_query'],
  'doubles': [response.confidence],
  'indexes': [query.query]
});
```

## 🔒 Security Considerations

### 1. API Authentication

Implement authentication for production:

```typescript
// Add to your routes
app.use('/api/*', async (c, next) => {
  const token = c.req.header('Authorization');
  if (!token || !validateToken(token)) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  await next();
});
```

### 2. Rate Limiting

Add rate limiting:

```typescript
// Use Cloudflare's built-in rate limiting or implement custom logic
const rateLimiter = new RateLimiter(c.env.KV);
if (await rateLimiter.isLimited(clientIP)) {
  return c.json({ error: 'Rate limited' }, 429);
}
```

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Verify database ID in wrangler.toml
   - Check D1 database exists in Cloudflare dashboard

2. **Dispatch Namespace Errors**
   - Verify namespace exists: `wrangler dispatch-namespace list`
   - Check API token permissions

3. **TypeScript Compilation Errors**
   - Run `npm install` to ensure all dependencies are installed
   - Check TypeScript version compatibility

4. **CORS Issues**
   - CORS is enabled by default in the worker
   - Verify origin settings if using custom domains

### Debugging

```bash
# View worker logs
wrangler tail

# View specific deployment logs
wrangler tail --env production

# Debug locally with verbose logging
wrangler dev --local --verbose
```

## 📈 Performance Optimization

### 1. Caching

Implement caching for frequently accessed data:

```typescript
// Cache financial data
const cached = await c.env.KV.get(`accounts:${userId}`);
if (cached) {
  return c.json(JSON.parse(cached));
}
```

### 2. Database Optimization

- Use prepared statements for D1 queries
- Implement connection pooling
- Add database indexes for frequently queried fields

### 3. Worker Optimization

- Minimize bundle size
- Use streaming for large responses
- Implement lazy loading for heavy computations

## 🔄 Continuous Deployment

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloudflare Workers

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run deploy
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
```

## 📞 Support

For issues and questions:

1. Check the [Cloudflare Workers documentation](https://developers.cloudflare.com/workers/)
2. Review [Workers for Platforms guide](https://developers.cloudflare.com/cloudflare-for-platforms/workers-for-platforms/)
3. Open an issue in the project repository

## 🎉 Success!

Once deployed, you'll have a revolutionary AI-powered financial intelligence system running on Cloudflare's global edge network, providing:

- **Sub-100ms response times** worldwide
- **Natural language financial queries**
- **Cognitive reasoning** about financial data
- **Scalable microservices** architecture
- **Global availability** with 99.9% uptime

Your ElizaOS-OpenCog-GnuCash system is now ready to revolutionize financial intelligence at scale!

