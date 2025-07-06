#!/bin/bash

# Script para probar las rutas del API Gateway
echo "🧪 Testing API Gateway Routes"
echo "================================="

# Configuración
API_GATEWAY_URL="http://cocianndo_express:3001"

# Función para hacer peticiones y mostrar resultados
test_endpoint() {
    local method=$1
    local path=$2
    local description=$3
    
    echo ""
    echo "📡 Testing: $description"
    echo "   $method $API_GATEWAY_URL$path"
    
    response=$(curl -s -w "HTTP_STATUS:%{http_code}" -X $method "$API_GATEWAY_URL$path" 2>/dev/null)
    http_status=$(echo $response | grep -o "HTTP_STATUS:[0-9]*" | cut -d: -f2)
    body=$(echo $response | sed 's/HTTP_STATUS:[0-9]*$//')
    
    if [[ $http_status == "200" ]]; then
        echo "   ✅ Status: $http_status"
    else
        echo "   ❌ Status: $http_status"
    fi
    
    if [[ ! -z "$body" && "$body" != "null" ]]; then
        echo "   📄 Response: $(echo $body | jq . 2>/dev/null || echo $body)"
    fi
}

# Función para verificar si el servidor está corriendo
check_server() {
    echo "🔍 Checking if API Gateway is running..."
    if curl -s "$API_GATEWAY_URL/health" > /dev/null 2>&1; then
        echo "✅ API Gateway is running on $API_GATEWAY_URL"
        return 0
    else
        echo "❌ API Gateway is not running on $API_GATEWAY_URL"
        echo "   Please start it with: npm run start:dev"
        return 1
    fi
}

# Verificar servidor
if ! check_server; then
    exit 1
fi

echo ""
echo "🚀 Starting Route Tests"
echo "======================="

# Probar endpoints del API Gateway
test_endpoint "GET" "/health" "Health Check"
test_endpoint "GET" "/health/detailed" "Detailed Health Check"
test_endpoint "GET" "/proxy/status" "Proxy Status"
test_endpoint "GET" "/proxy/routes" "Proxy Routes"
test_endpoint "GET" "/proxy/config" "Proxy Configuration"

# Probar rutas de proxy (estas pueden fallar si los servicios no están corriendo)
echo ""
echo "🔀 Testing Proxy Routes"
echo "======================"
echo "ℹ️  Note: These may fail if backend services are not running"

test_endpoint "GET" "/api/v1/recipe" "Recipe Service (Express)"
test_endpoint "GET" "/api/v1/usuarios" "Users Service (Nest)"
test_endpoint "GET" "/api/v1/auth" "Auth Service (Nest)"
test_endpoint "GET" "/api/v1/payments" "Payments Service (Express)"

echo ""
echo "✅ Test completed!"
echo "📊 Check the results above to verify your API Gateway configuration" 