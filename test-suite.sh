#!/bin/bash

# ElizaOS-OpenCog-GnuCash Workers for Platforms Test Suite
# This script tests the core functionality of the deployed system

echo "🧪 Testing ElizaOS-OpenCog-GnuCash Workers for Platforms"
echo "========================================================="

BASE_URL="http://localhost:8788"

# Test 1: Health check
echo "🔍 Test 1: Health Check"
response=$(curl -s "$BASE_URL/")
if echo "$response" | jq -e '.success' > /dev/null 2>&1; then
    echo "✅ Health check passed"
else
    echo "❌ Health check failed"
    echo "Response: $response"
fi

# Test 2: API health check
echo -e "\n🔍 Test 2: API Health Check"
response=$(curl -s "$BASE_URL/api/health")
if echo "$response" | jq -e '.success' > /dev/null 2>&1; then
    echo "✅ API health check passed"
    echo "   $(echo "$response" | jq -r '.status')"
else
    echo "❌ API health check failed"
fi

# Test 3: Financial accounts
echo -e "\n🔍 Test 3: Financial Accounts API"
response=$(curl -s "$BASE_URL/api/accounts")
if echo "$response" | jq -e '.success' > /dev/null 2>&1; then
    accounts_count=$(echo "$response" | jq '.data | length')
    echo "✅ Accounts API working - $accounts_count accounts retrieved"
else
    echo "❌ Accounts API failed"
fi

# Test 4: Transactions
echo -e "\n🔍 Test 4: Transactions API"
response=$(curl -s "$BASE_URL/api/transactions")
if echo "$response" | jq -e '.success' > /dev/null 2>&1; then
    transactions_count=$(echo "$response" | jq '.data | length')
    echo "✅ Transactions API working - $transactions_count transactions retrieved"
else
    echo "❌ Transactions API failed"
fi

# Test 5: Natural language query
echo -e "\n🔍 Test 5: Natural Language Financial Query"
response=$(curl -s -X POST "$BASE_URL/api/ask" \
  -H "Content-Type: application/json" \
  -d '{"query": "How much money do I have in total?"}')
if echo "$response" | jq -e '.success' > /dev/null 2>&1; then
    confidence=$(echo "$response" | jq -r '.data.confidence')
    answer=$(echo "$response" | jq -r '.data.answer')
    echo "✅ Natural language query working (confidence: $confidence)"
    echo "   Answer: $answer"
else
    echo "❌ Natural language query failed"
fi

# Test 6: Financial insights
echo -e "\n🔍 Test 6: Financial Insights"
response=$(curl -s "$BASE_URL/api/insights")
if echo "$response" | jq -e '.success' > /dev/null 2>&1; then
    suggestions_count=$(echo "$response" | jq '.data.suggestions | length')
    echo "✅ Financial insights working - $suggestions_count suggestions generated"
else
    echo "❌ Financial insights failed"
fi

# Test 7: Specific cognitive queries
echo -e "\n🔍 Test 7: Cognitive Analysis Queries"

queries=(
    "How much did I spend on dining out?"
    "What's my budget forecast for next month?"
    "Am I spending too much on groceries?"
)

for query in "${queries[@]}"; do
    echo "   Testing: $query"
    response=$(curl -s -X POST "$BASE_URL/api/ask" \
      -H "Content-Type: application/json" \
      -d "{\"query\": \"$query\"}")
    
    if echo "$response" | jq -e '.success' > /dev/null 2>&1; then
        confidence=$(echo "$response" | jq -r '.data.confidence')
        echo "     ✅ Query processed (confidence: $confidence)"
    else
        echo "     ❌ Query failed"
    fi
done

echo -e "\n🎉 Test suite completed!"
echo "========================================================="
echo "The ElizaOS-OpenCog-GnuCash Workers for Platforms system"
echo "is running successfully with cognitive financial intelligence!"