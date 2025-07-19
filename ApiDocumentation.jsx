import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Copy, Check, Play, Code2, Database, Zap } from 'lucide-react'

const ApiDocumentation = () => {
  const [copiedCode, setCopiedCode] = useState(null)

  const copyToClipboard = (code, id) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const endpoints = [
    {
      method: 'GET',
      path: '/api/accounts',
      description: 'Retrieve all financial accounts with hierarchical structure',
      response: {
        success: true,
        data: [
          {
            id: "1",
            name: "Assets",
            type: "ASSET",
            balance: 50000.00,
            currency: "USD",
            children: [
              {
                id: "2",
                name: "Checking Account",
                type: "BANK",
                balance: 5000.00,
                currency: "USD"
              }
            ]
          }
        ]
      }
    },
    {
      method: 'GET',
      path: '/api/transactions',
      description: 'Get recent transactions with optional limit parameter',
      params: { limit: '50 (optional)' },
      response: {
        success: true,
        data: [
          {
            id: "tx1",
            date: "2024-07-18",
            description: "Grocery Store Purchase",
            amount: -85.50,
            currency: "USD",
            account_from: "2",
            account_to: "5"
          }
        ]
      }
    },
    {
      method: 'POST',
      path: '/api/ask',
      description: 'Ask natural language financial questions with cognitive reasoning',
      body: {
        query: "How much did I spend on dining out this month?",
        context: "monthly_analysis",
        date_range: {
          start: "2024-07-01",
          end: "2024-07-31"
        }
      },
      response: {
        success: true,
        data: {
          answer: "You've spent $450 on dining out this month, which is 18% of your total expenses.",
          confidence: 0.85,
          data: {
            dining_expenses: 450.00,
            total_expenses: 2500.00,
            percentage: 18
          },
          reasoning: "I analyzed your transaction history and found all dining-related expenses.",
          suggestions: [
            "Consider setting a monthly dining budget of $350",
            "Try cooking at home 2-3 more times per week"
          ]
        }
      }
    },
    {
      method: 'GET',
      path: '/api/insights',
      description: 'Get AI-powered financial insights and recommendations',
      response: {
        success: true,
        data: {
          answer: "Your financial cognitive analysis reveals strong savings discipline.",
          confidence: 0.90,
          data: {
            strengths: ["High savings rate", "Low debt", "Consistent income"],
            opportunities: ["Dining optimization", "Investment diversification"],
            risk_factors: ["Single income source", "High cash allocation"]
          },
          suggestions: [
            "Reduce dining expenses by 20% to optimize spending",
            "Consider investing 30% of savings in diversified portfolio"
          ]
        }
      }
    }
  ]

  const curlExamples = {
    accounts: `curl -X GET https://your-worker.workers.dev/api/accounts \\
  -H "Content-Type: application/json"`,
    
    transactions: `curl -X GET "https://your-worker.workers.dev/api/transactions?limit=10" \\
  -H "Content-Type: application/json"`,
    
    ask: `curl -X POST https://your-worker.workers.dev/api/ask \\
  -H "Content-Type: application/json" \\
  -d '{
    "query": "How much did I spend on groceries last month?",
    "date_range": {
      "start": "2024-06-01",
      "end": "2024-06-30"
    }
  }'`,
    
    insights: `curl -X GET https://your-worker.workers.dev/api/insights \\
  -H "Content-Type: application/json"`
  }

  const jsExamples = {
    accounts: `// Fetch financial accounts
const response = await fetch('/api/accounts');
const data = await response.json();
console.log(data.data); // Array of accounts`,
    
    transactions: `// Get recent transactions
const response = await fetch('/api/transactions?limit=20');
const data = await response.json();
console.log(data.data); // Array of transactions`,
    
    ask: `// Ask a financial question
const response = await fetch('/api/ask', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: "Am I spending too much on dining out?",
    context: "spending_analysis"
  })
});
const data = await response.json();
console.log(data.data.answer); // AI response`,
    
    insights: `// Get financial insights
const response = await fetch('/api/insights');
const data = await response.json();
console.log(data.data.suggestions); // AI recommendations`
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
          Complete API Reference
        </h3>
        <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          Comprehensive documentation for all endpoints with examples in multiple languages.
        </p>
      </div>

      <div className="grid gap-6">
        {endpoints.map((endpoint, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Badge 
                    variant={endpoint.method === 'GET' ? 'secondary' : 'default'}
                    className={endpoint.method === 'GET' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'}
                  >
                    {endpoint.method}
                  </Badge>
                  <code className="text-sm font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                    {endpoint.path}
                  </code>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Play className="w-3 h-3 mr-1" />
                    Try
                  </Button>
                </div>
              </div>
              <CardDescription>{endpoint.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="curl" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="curl">cURL</TabsTrigger>
                  <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                  <TabsTrigger value="response">Response</TabsTrigger>
                </TabsList>
                
                <TabsContent value="curl" className="mt-4">
                  <div className="relative">
                    <pre className="bg-slate-900 dark:bg-slate-950 text-white p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{curlExamples[endpoint.path.split('/')[2]] || curlExamples.accounts}</code>
                    </pre>
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(curlExamples[endpoint.path.split('/')[2]] || curlExamples.accounts, `curl-${index}`)}
                    >
                      {copiedCode === `curl-${index}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="javascript" className="mt-4">
                  <div className="relative">
                    <pre className="bg-slate-900 dark:bg-slate-950 text-white p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{jsExamples[endpoint.path.split('/')[2]] || jsExamples.accounts}</code>
                    </pre>
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(jsExamples[endpoint.path.split('/')[2]] || jsExamples.accounts, `js-${index}`)}
                    >
                      {copiedCode === `js-${index}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="response" className="mt-4">
                  <div className="relative">
                    <pre className="bg-slate-900 dark:bg-slate-950 text-white p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{JSON.stringify(endpoint.response, null, 2)}</code>
                    </pre>
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(JSON.stringify(endpoint.response, null, 2), `response-${index}`)}
                    >
                      {copiedCode === `response-${index}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>

              {endpoint.params && (
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h5 className="font-medium text-blue-900 dark:text-blue-200 mb-2">Parameters</h5>
                  <div className="space-y-1">
                    {Object.entries(endpoint.params).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-sm">
                        <code className="text-blue-800 dark:text-blue-300">{key}</code>
                        <span className="text-blue-600 dark:text-blue-400">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {endpoint.body && (
                <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <h5 className="font-medium text-purple-900 dark:text-purple-200 mb-2">Request Body</h5>
                  <pre className="text-sm text-purple-800 dark:text-purple-300 overflow-x-auto">
                    <code>{JSON.stringify(endpoint.body, null, 2)}</code>
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* SDK Examples */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Code2 className="w-5 h-5 mr-2" />
            SDK Integration Examples
          </CardTitle>
          <CardDescription>
            Ready-to-use code snippets for popular frameworks and languages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="react" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="react">React</TabsTrigger>
              <TabsTrigger value="vue">Vue.js</TabsTrigger>
              <TabsTrigger value="python">Python</TabsTrigger>
              <TabsTrigger value="node">Node.js</TabsTrigger>
            </TabsList>
            
            <TabsContent value="react" className="mt-4">
              <div className="relative">
                <pre className="bg-slate-900 dark:bg-slate-950 text-white p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{`import { useState, useEffect } from 'react';

const FinancialDashboard = () => {
  const [accounts, setAccounts] = useState([]);
  const [insights, setInsights] = useState(null);

  useEffect(() => {
    // Fetch accounts
    fetch('/api/accounts')
      .then(res => res.json())
      .then(data => setAccounts(data.data));

    // Get AI insights
    fetch('/api/insights')
      .then(res => res.json())
      .then(data => setInsights(data.data));
  }, []);

  const askQuestion = async (query) => {
    const response = await fetch('/api/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });
    return response.json();
  };

  return (
    <div>
      <h2>Financial Dashboard</h2>
      {/* Render accounts and insights */}
    </div>
  );
};`}</code>
                </pre>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard('React example code', 'react-example')}
                >
                  {copiedCode === 'react-example' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="python" className="mt-4">
              <div className="relative">
                <pre className="bg-slate-900 dark:bg-slate-950 text-white p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{`import requests
import json

class ElizoscogClient:
    def __init__(self, base_url):
        self.base_url = base_url
        self.session = requests.Session()
    
    def get_accounts(self):
        response = self.session.get(f"{self.base_url}/api/accounts")
        return response.json()
    
    def ask_question(self, query, context=None):
        payload = {"query": query}
        if context:
            payload["context"] = context
            
        response = self.session.post(
            f"{self.base_url}/api/ask",
            json=payload
        )
        return response.json()
    
    def get_insights(self):
        response = self.session.get(f"{self.base_url}/api/insights")
        return response.json()

# Usage
client = ElizoscogClient("https://your-worker.workers.dev")
accounts = client.get_accounts()
insights = client.get_insights()
answer = client.ask_question("How much did I spend on groceries?")`}</code>
                </pre>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard('Python example code', 'python-example')}
                >
                  {copiedCode === 'python-example' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="node" className="mt-4">
              <div className="relative">
                <pre className="bg-slate-900 dark:bg-slate-950 text-white p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{`const axios = require('axios');

class ElizoscogAPI {
  constructor(baseURL) {
    this.client = axios.create({
      baseURL,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  async getAccounts() {
    const response = await this.client.get('/api/accounts');
    return response.data;
  }

  async askQuestion(query, options = {}) {
    const response = await this.client.post('/api/ask', {
      query,
      ...options
    });
    return response.data;
  }

  async getInsights() {
    const response = await this.client.get('/api/insights');
    return response.data;
  }

  async getTransactions(limit = 50) {
    const response = await this.client.get(\`/api/transactions?limit=\${limit}\`);
    return response.data;
  }
}

// Usage
const api = new ElizoscogAPI('https://your-worker.workers.dev');

(async () => {
  const accounts = await api.getAccounts();
  const insights = await api.getInsights();
  const answer = await api.askQuestion('What is my spending trend?');
  
  console.log('Accounts:', accounts.data);
  console.log('AI Answer:', answer.data.answer);
})();`}</code>
                </pre>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard('Node.js example code', 'node-example')}
                >
                  {copiedCode === 'node-example' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Rate Limits and Authentication */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="w-5 h-5 mr-2" />
              Rate Limits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Requests per minute</span>
                <Badge variant="secondary">1000</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Concurrent requests</span>
                <Badge variant="secondary">100</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">AI queries per hour</span>
                <Badge variant="secondary">500</Badge>
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 mt-4">
                Rate limits are enforced per IP address. Contact support for higher limits.
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="w-5 h-5 mr-2" />
              Response Codes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">200 OK</span>
                <span className="text-xs text-slate-600 dark:text-slate-400">Success</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">400 Bad Request</span>
                <span className="text-xs text-slate-600 dark:text-slate-400">Invalid input</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">429 Too Many Requests</span>
                <span className="text-xs text-slate-600 dark:text-slate-400">Rate limited</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">500 Server Error</span>
                <span className="text-xs text-slate-600 dark:text-slate-400">Internal error</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ApiDocumentation

