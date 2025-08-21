#!/bin/bash

# 🧪 Script de Pruebas para Backend MiAbogada
# Uso: bash test-backend.sh

BASE_URL="http://localhost:3001"
echo "🧪 Probando Backend MiAbogada - $BASE_URL"
echo "================================================="

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para hacer requests
test_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    local expected_status=$4
    local description=$5
    
    echo -e "\n${BLUE}🔍 $description${NC}"
    echo "   $method $endpoint"
    
    if [ -n "$data" ]; then
        response=$(curl -s -X $method "$BASE_URL$endpoint" \
            -H "Content-Type: application/json" \
            -d "$data" \
            -w "HTTPSTATUS:%{http_code}")
    else
        response=$(curl -s -X $method "$BASE_URL$endpoint" \
            -w "HTTPSTATUS:%{http_code}")
    fi
    
    http_code=$(echo $response | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
    response_body=$(echo $response | sed -e 's/HTTPSTATUS:.*//g')
    
    if [ "$http_code" -eq "$expected_status" ]; then
        echo -e "   ${GREEN}✅ Status: $http_code${NC}"
        echo "   📄 Response: $(echo $response_body | head -c 100)..."
    else
        echo -e "   ${RED}❌ Status: $http_code (esperado: $expected_status)${NC}"
        echo "   📄 Response: $response_body"
    fi
}

# Función para probar autenticación
test_auth() {
    echo -e "\n${YELLOW}🔐 Probando Autenticación${NC}"
    
    # Login
    login_data='{
        "email": "admin@miabogada.com",
        "password": "admin123"
    }'
    
    response=$(curl -s -X POST "$BASE_URL/api/auth/login" \
        -H "Content-Type: application/json" \
        -d "$login_data" \
        -w "HTTPSTATUS:%{http_code}")
    
    http_code=$(echo $response | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
    response_body=$(echo $response | sed -e 's/HTTPSTATUS:.*//g')
    
    if [ "$http_code" -eq 200 ]; then
        echo -e "   ${GREEN}✅ Login exitoso${NC}"
        # Extraer token (simplificado)
        echo "   🔑 Token obtenido"
        return 0
    else
        echo -e "   ${RED}❌ Login falló: $http_code${NC}"
        echo "   📄 Response: $response_body"
        return 1
    fi
}

echo -e "\n${YELLOW}🏥 1. Health Check${NC}"
test_endpoint "GET" "/api/health" "" 200 "Verificar estado del servidor"

echo -e "\n${YELLOW}📅 2. Endpoints de Citas${NC}"
test_endpoint "GET" "/api/appointments/available-dates" "" 200 "Obtener fechas disponibles"

# Crear cita
appointment_data='{
    "date": "2025-08-25",
    "time": "10:00",
    "consultationType": "Derecho Laboral",
    "clientName": "Juan Pérez Test",
    "clientEmail": "juan.test@example.com",
    "clientPhone": "+573001234567",
    "message": "Consulta de prueba desde script"
}'
test_endpoint "POST" "/api/appointments" "$appointment_data" 201 "Crear nueva cita"

echo -e "\n${YELLOW}📞 3. Endpoints de Contacto${NC}"
contact_data='{
    "name": "María Test",
    "email": "maria.test@example.com", 
    "phone": "+573009876543",
    "message": "Mensaje de prueba desde script de testing"
}'
test_endpoint "POST" "/api/contacts" "$contact_data" 201 "Enviar mensaje de contacto"

echo -e "\n${YELLOW}🔐 4. Autenticación${NC}"
test_auth

echo -e "\n${YELLOW}❌ 5. Pruebas de Error${NC}"
test_endpoint "GET" "/api/nonexistent" "" 404 "Endpoint inexistente"

# Datos inválidos
invalid_data='{"invalid": "data"}'
test_endpoint "POST" "/api/appointments" "$invalid_data" 400 "Datos inválidos para cita"

echo -e "\n${GREEN}=================================================${NC}"
echo -e "${GREEN}🎉 Pruebas completadas!${NC}"
echo -e "\n${BLUE}💡 Para más pruebas detalladas:${NC}"
echo "   - Abre Prisma Studio: docker-compose exec backend npx prisma studio"
echo "   - Ve los logs: docker-compose logs backend -f"
echo "   - Usa Postman o Insomnia para pruebas manuales"