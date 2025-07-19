import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts'
import { TrendingUp, TrendingDown, DollarSign, Target, Brain, Zap } from 'lucide-react'

const FinancialCharts = () => {
  const [activeChart, setActiveChart] = useState('spending')

  // Sample financial data
  const spendingData = [
    { category: 'Groceries', amount: 800, budget: 900, trend: 'up' },
    { category: 'Dining Out', amount: 450, budget: 350, trend: 'up' },
    { category: 'Transportation', amount: 300, budget: 400, trend: 'down' },
    { category: 'Utilities', amount: 250, budget: 300, trend: 'stable' },
    { category: 'Entertainment', amount: 200, budget: 250, trend: 'down' },
    { category: 'Shopping', amount: 350, budget: 300, trend: 'up' }
  ]

  const monthlyTrend = [
    { month: 'Jan', income: 4500, expenses: 2800, savings: 1700 },
    { month: 'Feb', income: 4500, expenses: 2950, savings: 1550 },
    { month: 'Mar', income: 4800, expenses: 3100, savings: 1700 },
    { month: 'Apr', income: 4500, expenses: 2750, savings: 1750 },
    { month: 'May', income: 4500, expenses: 2900, savings: 1600 },
    { month: 'Jun', income: 4500, expenses: 2650, savings: 1850 },
    { month: 'Jul', income: 4500, expenses: 2500, savings: 2000 }
  ]

  const accountDistribution = [
    { name: 'Checking', value: 5000, color: '#3B82F6' },
    { name: 'Savings', value: 45000, color: '#10B981' },
    { name: 'Investment', value: 15000, color: '#8B5CF6' },
    { name: 'Emergency Fund', value: 10000, color: '#F59E0B' }
  ]

  const aiInsights = [
    {
      type: 'warning',
      title: 'Dining Expenses Above Budget',
      description: 'You\'ve spent 28% more on dining out than budgeted this month.',
      confidence: 0.92,
      suggestion: 'Consider meal planning to reduce dining expenses by $100/month.',
      impact: 'Could save $1,200 annually'
    },
    {
      type: 'positive',
      title: 'Excellent Savings Rate',
      description: 'Your savings rate of 44% is well above the recommended 20%.',
      confidence: 0.95,
      suggestion: 'Consider investing excess savings for better returns.',
      impact: 'Potential 7% annual growth on investments'
    },
    {
      type: 'neutral',
      title: 'Stable Income Pattern',
      description: 'Your income has been consistent with minimal variation.',
      confidence: 0.88,
      suggestion: 'Explore additional income streams for financial growth.',
      impact: 'Could increase total income by 15-25%'
    }
  ]

  const COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#6B7280']

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 p-3 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg">
          <p className="font-medium text-slate-900 dark:text-white">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: ${entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
          AI-Powered Financial Analytics
        </h3>
        <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          Real-time cognitive analysis of your financial data with predictive insights and recommendations.
        </p>
      </div>

      {/* AI Insights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {aiInsights.map((insight, index) => (
          <Card key={index} className={`border-l-4 ${
            insight.type === 'warning' ? 'border-l-orange-500' :
            insight.type === 'positive' ? 'border-l-green-500' : 'border-l-blue-500'
          }`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center">
                  <Brain className="w-4 h-4 mr-2" />
                  {insight.title}
                </CardTitle>
                <Badge variant="secondary" className="text-xs">
                  {Math.round(insight.confidence * 100)}% confidence
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                {insight.description}
              </p>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 mb-3">
                <p className="text-sm font-medium text-slate-900 dark:text-white mb-1">
                  AI Recommendation:
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {insight.suggestion}
                </p>
              </div>
              <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                <Zap className="w-3 h-3 mr-1" />
                {insight.impact}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Interactive Charts */}
      <Card>
        <CardHeader>
          <CardTitle>Financial Data Visualization</CardTitle>
          <CardDescription>
            Interactive charts powered by cognitive analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeChart} onValueChange={setActiveChart} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="spending">Spending Analysis</TabsTrigger>
              <TabsTrigger value="trends">Monthly Trends</TabsTrigger>
              <TabsTrigger value="distribution">Account Distribution</TabsTrigger>
              <TabsTrigger value="forecast">AI Forecast</TabsTrigger>
            </TabsList>

            <TabsContent value="spending" className="mt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Category Spending vs Budget
                  </h4>
                  <Badge variant="outline">Current Month</Badge>
                </div>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={spendingData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="budget" fill="#E5E7EB" name="Budget" />
                    <Bar dataKey="amount" fill="#3B82F6" name="Actual" />
                  </BarChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                  {spendingData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <div>
                        <div className="text-sm font-medium text-slate-900 dark:text-white">
                          {item.category}
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">
                          ${item.amount} / ${item.budget}
                        </div>
                      </div>
                      <div className="flex items-center">
                        {item.trend === 'up' ? (
                          <TrendingUp className="w-4 h-4 text-red-500" />
                        ) : item.trend === 'down' ? (
                          <TrendingDown className="w-4 h-4 text-green-500" />
                        ) : (
                          <div className="w-4 h-4 bg-gray-400 rounded-full" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="trends" className="mt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Income, Expenses & Savings Trend
                  </h4>
                  <Badge variant="outline">Last 7 Months</Badge>
                </div>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={monthlyTrend} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="income" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} name="Income" />
                    <Area type="monotone" dataKey="expenses" stackId="2" stroke="#EF4444" fill="#EF4444" fillOpacity={0.6} name="Expenses" />
                    <Line type="monotone" dataKey="savings" stroke="#3B82F6" strokeWidth={3} name="Savings" />
                  </AreaChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">$4,543</div>
                    <div className="text-sm text-green-700 dark:text-green-300">Avg Monthly Income</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">$2,807</div>
                    <div className="text-sm text-red-700 dark:text-red-300">Avg Monthly Expenses</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">$1,736</div>
                    <div className="text-sm text-blue-700 dark:text-blue-300">Avg Monthly Savings</div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="distribution" className="mt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Account Balance Distribution
                  </h4>
                  <Badge variant="outline">Total: $75,000</Badge>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={accountDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {accountDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Balance']} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-3">
                    {accountDistribution.map((account, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <div className="flex items-center">
                          <div 
                            className="w-4 h-4 rounded-full mr-3" 
                            style={{ backgroundColor: account.color }}
                          />
                          <div>
                            <div className="font-medium text-slate-900 dark:text-white">
                              {account.name}
                            </div>
                            <div className="text-sm text-slate-600 dark:text-slate-400">
                              {((account.value / 75000) * 100).toFixed(1)}% of total
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-slate-900 dark:text-white">
                            ${account.value.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="forecast" className="mt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-slate-900 dark:text-white">
                    AI-Powered Financial Forecast
                  </h4>
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300">
                    <Brain className="w-3 h-3 mr-1" />
                    Cognitive Prediction
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center">
                        <DollarSign className="w-4 h-4 mr-2" />
                        Next Month Expenses
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-blue-600 mb-2">$2,650</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                        Predicted with 78% confidence
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{width: '78%'}}></div>
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                        Based on 6 months of spending patterns
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center">
                        <Target className="w-4 h-4 mr-2" />
                        Savings Goal Progress
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-green-600 mb-2">$1,850</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                        Expected monthly savings
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{width: '92%'}}></div>
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                        92% of $2,000 monthly goal
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Financial Health Score
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-purple-600 mb-2">8.2/10</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                        Excellent financial health
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div className="bg-purple-600 h-2 rounded-full" style={{width: '82%'}}></div>
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                        Above 80% of similar profiles
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Brain className="w-5 h-5 mr-2" />
                      Cognitive Analysis Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6">
                      <p className="text-slate-700 dark:text-slate-300 mb-4">
                        The ElizaOS-OpenCog cognitive system has analyzed your financial patterns and identified key optimization opportunities. 
                        Your disciplined savings approach and consistent income provide a strong foundation for wealth building.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="font-semibold text-slate-900 dark:text-white mb-2">Strengths Identified:</h5>
                          <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                            <li>• Consistent 44% savings rate</li>
                            <li>• Low debt-to-income ratio</li>
                            <li>• Stable income pattern</li>
                            <li>• Emergency fund adequacy</li>
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-semibold text-slate-900 dark:text-white mb-2">Optimization Areas:</h5>
                          <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                            <li>• Dining expense management</li>
                            <li>• Investment diversification</li>
                            <li>• Tax optimization strategies</li>
                            <li>• Income stream diversification</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

export default FinancialCharts

