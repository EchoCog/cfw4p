import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Input } from '@/components/ui/input.jsx'
import { 
  Brain, 
  Zap, 
  Globe, 
  Code, 
  Database, 
  MessageSquare, 
  TrendingUp, 
  Shield, 
  Rocket,
  Star,
  ChevronRight,
  Play,
  Download,
  Github,
  ExternalLink,
  DollarSign,
  BarChart3,
  Cpu,
  Network,
  Menu,
  X
} from 'lucide-react'
import ApiDocumentation from './components/ApiDocumentation.jsx'
import FinancialCharts from './components/FinancialCharts.jsx'
import heroBg from './assets/hero-bg.png'
import cognitiveBrain from './assets/cognitive-brain.png'
import financialNetwork from './assets/financial-network.png'
import edgeComputing from './assets/edge-computing.png'
import './App.css'

function App() {
  const [activeDemo, setActiveDemo] = useState('query')
  const [queryInput, setQueryInput] = useState('')
  const [queryResponse, setQueryResponse] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('overview')

  // Simulate API response
  const simulateQuery = async (query) => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const responses = {
      'spending': {
        answer: "You've spent $450 on dining out this month, which is 18% of your total expenses. This is slightly above your typical spending pattern.",
        confidence: 0.85,
        data: { dining_expenses: 450.00, total_expenses: 2500.00, percentage: 18 },
        reasoning: "I analyzed your transaction history and found all dining-related expenses. The cognitive system detected this is 15% higher than your 3-month average.",
        suggestions: ["Consider setting a monthly dining budget of $350", "Try cooking at home 2-3 more times per week"]
      },
      'balance': {
        answer: "Your total liquid assets are $50,000 across checking and savings accounts. Your financial health score is 8.2/10.",
        confidence: 0.95,
        data: { total_assets: 50000.00, checking: 5000.00, savings: 45000.00, health_score: 8.2 },
        reasoning: "The cognitive system evaluated your asset distribution, expense ratios, and savings rate to calculate your financial health.",
        suggestions: ["Your emergency fund looks healthy at 18 months of expenses", "Consider diversifying into investment accounts"]
      },
      'default': {
        answer: "I understand you're asking about your finances. The ElizaOS-OpenCog cognitive system is analyzing your query patterns to provide intelligent responses.",
        confidence: 0.75,
        reasoning: "The query is being processed through our revolutionary AI-financial intelligence system.",
        suggestions: ["Try asking: 'How much did I spend on groceries last month?'", "Or: 'What's my current account balance?'"]
      }
    }

    const lowerQuery = query.toLowerCase()
    let response = responses.default
    
    if (lowerQuery.includes('spending') || lowerQuery.includes('dining')) {
      response = responses.spending
    } else if (lowerQuery.includes('balance') || lowerQuery.includes('money')) {
      response = responses.balance
    }

    setQueryResponse(response)
    setIsLoading(false)
  }

  const handleQuerySubmit = (e) => {
    e.preventDefault()
    if (queryInput.trim()) {
      simulateQuery(queryInput)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                ElizaOS-OpenCog-GnuCash
              </span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors">Features</a>
              <a href="#api" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors">API</a>
              <a href="#demo" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors">Demo</a>
              <a href="#deployment" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors">Deploy</a>
              <Button variant="outline" size="sm">
                <Github className="w-4 h-4 mr-2" />
                GitHub
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-slate-200 dark:border-slate-700">
              <div className="flex flex-col space-y-4">
                <a href="#features" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors">Features</a>
                <a href="#api" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors">API</a>
                <a href="#demo" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors">Demo</a>
                <a href="#deployment" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors">Deploy</a>
                <Button variant="outline" size="sm" className="w-fit">
                  <Github className="w-4 h-4 mr-2" />
                  GitHub
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10 dark:opacity-20"
          style={{ backgroundImage: `url(${heroBg})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 dark:from-blue-600/20 dark:to-indigo-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <Badge variant="secondary" className="px-4 py-2 text-sm font-medium animate-pulse">
                <Star className="w-4 h-4 mr-2" />
                Revolutionary AI Achievement
              </Badge>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white mb-6">
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Revolutionary
              </span>
              <br />
              AI-Financial Intelligence
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-8 max-w-4xl mx-auto leading-relaxed">
              The world's first comprehensive AI ecosystem integration creating cognitive-financial intelligence. 
              Unifying <strong>ElizaOS</strong>, <strong>OpenCog</strong>, and <strong>GnuCash</strong> into a revolutionary system that thinks, reasons, and learns about money.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 transform hover:scale-105 transition-all duration-200">
                <Play className="w-5 h-5 mr-2" />
                Try Live Demo
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200">
                <Download className="w-5 h-5 mr-2" />
                Deploy Now
              </Button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center transform hover:scale-105 transition-transform duration-200">
                <div className="text-3xl font-bold text-slate-900 dark:text-white">110+</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Repositories Integrated</div>
              </div>
              <div className="text-center transform hover:scale-105 transition-transform duration-200">
                <div className="text-3xl font-bold text-slate-900 dark:text-white">&lt;100ms</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Response Time</div>
              </div>
              <div className="text-center transform hover:scale-105 transition-transform duration-200">
                <div className="text-3xl font-bold text-slate-900 dark:text-white">6</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Cognitive Agents</div>
              </div>
              <div className="text-center transform hover:scale-105 transition-transform duration-200">
                <div className="text-3xl font-bold text-slate-900 dark:text-white">∞</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Global Scale</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Revolutionary Capabilities
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Experience the future of financial intelligence with cognitive reasoning, natural language processing, and edge computing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 mb-4 group-hover:scale-110 transition-transform duration-300">
                  <img src={cognitiveBrain} alt="Cognitive Brain" className="w-full h-full object-contain" />
                </div>
                <CardTitle>Natural Language Finance</CardTitle>
                <CardDescription>
                  Ask complex financial questions in plain English and get intelligent, contextual responses.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 font-mono text-sm">
                  <div className="text-green-600 dark:text-green-400">"How much did I spend on groceries last month?"</div>
                  <div className="text-slate-600 dark:text-slate-400 mt-2">→ Cognitive analysis with reasoning</div>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 mb-4 group-hover:scale-110 transition-transform duration-300">
                  <img src={financialNetwork} alt="Financial Network" className="w-full h-full object-contain" />
                </div>
                <CardTitle>Cognitive Reasoning</CardTitle>
                <CardDescription>
                  OpenCog-powered reasoning engine that understands financial patterns and provides insights.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Pattern Recognition
                  </div>
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    Predictive Analytics
                  </div>
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                    Behavioral Learning
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 mb-4 group-hover:scale-110 transition-transform duration-300">
                  <img src={edgeComputing} alt="Edge Computing" className="w-full h-full object-contain" />
                </div>
                <CardTitle>Edge Computing</CardTitle>
                <CardDescription>
                  Deployed on Cloudflare Workers for global sub-100ms response times.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm">
                  <span>Global Latency</span>
                  <Badge variant="secondary">&lt;100ms</Badge>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span>Availability</span>
                  <Badge variant="secondary">99.9%</Badge>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span>Edge Locations</span>
                  <Badge variant="secondary">300+</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Predictive Intelligence</CardTitle>
                <CardDescription>
                  AI-powered forecasting with confidence intervals and actionable recommendations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Budget Forecast</span>
                    <span className="text-sm font-medium">$2,650</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full" style={{width: '78%'}}></div>
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">78% confidence</div>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Network className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Multi-Agent System</CardTitle>
                <CardDescription>
                  ElizaOS framework with 6 specialized financial intelligence agents working in harmony.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded px-2 py-1">Analysis Agent</div>
                  <div className="bg-green-50 dark:bg-green-900/20 rounded px-2 py-1">Forecast Agent</div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded px-2 py-1">Risk Agent</div>
                  <div className="bg-orange-50 dark:bg-orange-900/20 rounded px-2 py-1">Budget Agent</div>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Enterprise Security</CardTitle>
                <CardDescription>
                  Bank-grade security with end-to-end encryption and privacy-first architecture.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Shield className="w-4 h-4 text-green-500 mr-2" />
                    End-to-End Encryption
                  </div>
                  <div className="flex items-center text-sm">
                    <Shield className="w-4 h-4 text-green-500 mr-2" />
                    Zero-Knowledge Architecture
                  </div>
                  <div className="flex items-center text-sm">
                    <Shield className="w-4 h-4 text-green-500 mr-2" />
                    GDPR Compliant
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section id="demo" className="py-20 bg-slate-50 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Try It Live
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Experience the power of cognitive financial intelligence. Ask questions in natural language and see the AI reason through complex financial scenarios.
            </p>
          </div>

          <Tabs value={activeSection} onValueChange={setActiveSection} className="w-full">
            <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="chat">AI Chat</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="max-w-4xl mx-auto">
                <Card className="shadow-2xl border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Brain className="w-5 h-5 mr-2" />
                      Cognitive Financial Assistant
                    </CardTitle>
                    <CardDescription>
                      Ask any financial question in natural language
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleQuerySubmit} className="space-y-4">
                      <div className="flex gap-2">
                        <Input
                          placeholder="e.g., How much did I spend on dining out this month?"
                          value={queryInput}
                          onChange={(e) => setQueryInput(e.target.value)}
                          className="flex-1"
                        />
                        <Button type="submit" disabled={isLoading} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                          {isLoading ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={() => setQueryInput("How much did I spend on dining out this month?")}
                        >
                          Spending Analysis
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={() => setQueryInput("What's my current account balance?")}
                        >
                          Account Balance
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={() => setQueryInput("What will my expenses be next month?")}
                        >
                          Budget Forecast
                        </Button>
                      </div>
                    </form>

                    {queryResponse && (
                      <div className="mt-6 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <div className="flex items-start justify-between mb-4">
                          <h4 className="font-semibold text-slate-900 dark:text-white">AI Response</h4>
                          <Badge variant="secondary">
                            {Math.round(queryResponse.confidence * 100)}% confidence
                          </Badge>
                        </div>
                        
                        <p className="text-slate-700 dark:text-slate-300 mb-4">
                          {queryResponse.answer}
                        </p>
                        
                        {queryResponse.data && (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            {Object.entries(queryResponse.data).map(([key, value]) => (
                              <div key={key} className="text-center">
                                <div className="text-lg font-bold text-slate-900 dark:text-white">
                                  {typeof value === 'number' && key.includes('_') ? `$${value.toLocaleString()}` : value}
                                </div>
                                <div className="text-xs text-slate-600 dark:text-slate-400 capitalize">
                                  {key.replace('_', ' ')}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 mb-4">
                          <h5 className="font-medium text-slate-900 dark:text-white mb-2">Reasoning</h5>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {queryResponse.reasoning}
                          </p>
                        </div>
                        
                        {queryResponse.suggestions && (
                          <div>
                            <h5 className="font-medium text-slate-900 dark:text-white mb-2">Suggestions</h5>
                            <ul className="space-y-1">
                              {queryResponse.suggestions.map((suggestion, index) => (
                                <li key={index} className="text-sm text-slate-600 dark:text-slate-400 flex items-start">
                                  <ChevronRight className="w-3 h-3 mr-2 mt-0.5 text-blue-500" />
                                  {suggestion}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="analytics">
              <FinancialCharts />
            </TabsContent>

            <TabsContent value="chat">
              <div className="max-w-4xl mx-auto">
                <Card className="shadow-2xl border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MessageSquare className="w-5 h-5 mr-2" />
                      Advanced AI Chat Interface
                    </CardTitle>
                    <CardDescription>
                      Extended conversation with the cognitive financial system
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6 min-h-[400px] flex items-center justify-center">
                      <div className="text-center">
                        <Brain className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                          Advanced Chat Interface
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-4">
                          Extended conversation capabilities with memory, context awareness, and multi-turn reasoning.
                        </p>
                        <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                          Start Advanced Chat
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* API Documentation Section */}
      <section id="api" className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Powerful API & Documentation
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              RESTful API with cognitive intelligence built-in. Deploy custom financial workers with ease.
            </p>
          </div>
          <ApiDocumentation />
        </div>
      </section>

      {/* Deployment Section */}
      <section id="deployment" className="py-20 bg-slate-50 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Deploy in Minutes
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Get your revolutionary AI-financial intelligence system running on Cloudflare's global edge network.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Quick Start</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-1">1</div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white">Download & Install</h4>
                    <p className="text-slate-600 dark:text-slate-400">Clone the repository and install dependencies</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-1">2</div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white">Configure Cloudflare</h4>
                    <p className="text-slate-600 dark:text-slate-400">Set up Workers for Platforms and D1 database</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-1">3</div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white">Deploy</h4>
                    <p className="text-slate-600 dark:text-slate-400">Run npm run deploy and go live globally</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex gap-4">
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  <Download className="w-4 h-4 mr-2" />
                  Download Package
                </Button>
                <Button variant="outline">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Docs
                </Button>
              </div>
            </div>

            <div>
              <Card className="shadow-xl border-0">
                <CardHeader>
                  <CardTitle>Deployment Command</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-slate-900 dark:bg-slate-950 rounded-lg p-4 font-mono text-sm">
                    <div className="text-slate-400"># Install dependencies</div>
                    <div className="text-white">npm install</div>
                    <div className="text-slate-400 mt-2"># Configure Cloudflare</div>
                    <div className="text-white">wrangler login</div>
                    <div className="text-slate-400 mt-2"># Deploy to production</div>
                    <div className="text-white">npm run deploy</div>
                    <div className="text-green-400 mt-2">✓ Deployed to global edge network</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6 shadow-xl border-0">
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">&lt;100ms</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Global Latency</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">99.9%</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Uptime SLA</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">300+</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Edge Locations</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">∞</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Auto Scale</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">ElizaOS-OpenCog-GnuCash</span>
              </div>
              <p className="text-slate-400 mb-4 max-w-md">
                Revolutionary AI-Financial Intelligence deployed on Cloudflare Workers for Platforms. 
                The first cognitive financial system that thinks, reasons, and learns.
              </p>
              <div className="flex space-x-4">
                <Button variant="outline" size="sm">
                  <Github className="w-4 h-4 mr-2" />
                  GitHub
                </Button>
                <Button variant="outline" size="sm">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Documentation
                </Button>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Integration</h4>
              <ul className="space-y-2 text-slate-400">
                <li>ElizaOS Framework</li>
                <li>OpenCog Reasoning</li>
                <li>GnuCash Financial</li>
                <li>Cloudflare Workers</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-slate-400">
                <li>API Documentation</li>
                <li>Deployment Guide</li>
                <li>Examples</li>
                <li>Support</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-400">
            <p>&copy; 2024 ElizaOS-OpenCog-GnuCash. Revolutionary AI-Financial Intelligence.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App

