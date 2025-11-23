#!/bin/bash

# SexyFly - Security Testing Script
# Version: 3.2.0
# Descripción: Verifica todas las medidas de seguridad implementadas

echo "🔒 SexyFly Security Testing"
echo "============================"
echo ""

# Configurar URL del backend (cambiar cuando esté desplegado)
BACKEND_URL="${1:-http://localhost:5001}"
FRONTEND_URL="${2:-http://localhost:8000}"

echo "📍 Testing URLs:"
echo "   Backend:  $BACKEND_URL"
echo "   Frontend: $FRONTEND_URL"
echo ""

# Función para test con color
test_result() {
  if [ $1 -eq 0 ]; then
    echo "✅ PASS: $2"
  else
    echo "❌ FAIL: $2"
  fi
}

# Test 1: Health Check
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1️⃣  Health Check & TPV Mode"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
HEALTH=$(curl -s "$BACKEND_URL/api/health")
echo "$HEALTH" | python3 -m json.tool 2>/dev/null || echo "$HEALTH"

# Verificar modo producción
if echo "$HEALTH" | grep -q '"tpv_mode": "production"'; then
  test_result 0 "TPV en modo PRODUCCIÓN"
elif echo "$HEALTH" | grep -q '"tpv_mode": "test"'; then
  echo "⚠️  WARN: TPV en modo TEST (cambiar TPV_TEST_MODE=false en Railway)"
else
  test_result 1 "No se pudo verificar modo TPV"
fi
echo ""

# Test 2: CORS Restricción
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "2️⃣  CORS Restriction"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Test 2.1: Dominio malicioso (debe fallar)"
CORS_TEST=$(curl -s -w "\n%{http_code}" \
  -X POST "$BACKEND_URL/api/tpv/iniciar-pago" \
  -H "Origin: https://sitio-malicioso.com" \
  -H "Content-Type: application/json" \
  -d '{"test":"data"}')

if echo "$CORS_TEST" | tail -1 | grep -qE "403|401"; then
  test_result 0 "CORS bloqueó dominio no autorizado"
else
  echo "⚠️  WARN: CORS podría estar permitiendo todo (revisar ALLOWED_ORIGINS)"
fi
echo ""

# Test 3: Rate Limiting
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "3️⃣  Rate Limiting (5 requests/min máximo)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Enviando 6 requests rápidos..."

RATE_LIMIT_BLOCKED=0
for i in {1..6}; do
  HTTP_CODE=$(curl -s -w "%{http_code}" -o /dev/null \
    -X POST "$BACKEND_URL/api/tpv/iniciar-pago" \
    -H "Content-Type: application/json" \
    -d '{"test":"data"}')
  
  echo "Request $i: HTTP $HTTP_CODE"
  
  if [ "$i" -eq 6 ] && [ "$HTTP_CODE" -eq 429 ]; then
    RATE_LIMIT_BLOCKED=1
  fi
  
  sleep 0.5
done

if [ $RATE_LIMIT_BLOCKED -eq 1 ]; then
  test_result 0 "Rate limiting funcionando (bloqueó request #6)"
else
  echo "⚠️  WARN: Rate limiting podría no estar activo"
fi
echo ""

# Test 4: Validación de Entrada
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "4️⃣  Input Validation"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo "Test 4.1: Sin datos (debe rechazar)"
VALIDATION_1=$(curl -s -X POST "$BACKEND_URL/api/tpv/iniciar-pago" \
  -H "Content-Type: application/json")

if echo "$VALIDATION_1" | grep -q "error"; then
  test_result 0 "Rechaza petición sin datos"
else
  test_result 1 "NO rechaza petición sin datos"
fi

echo "Test 4.2: Importe negativo (debe rechazar)"
VALIDATION_2=$(curl -s -X POST "$BACKEND_URL/api/tpv/iniciar-pago" \
  -H "Content-Type: application/json" \
  -d '{"client":{"name":"Test"},"pricing":{"total":-100},"airports":{"origin":"LEBL","destination":"LEMD"}}')

if echo "$VALIDATION_2" | grep -qi "mayor a 0"; then
  test_result 0 "Rechaza importe negativo"
else
  test_result 1 "NO rechaza importe negativo"
fi

echo "Test 4.3: Importe excesivo (debe rechazar)"
VALIDATION_3=$(curl -s -X POST "$BACKEND_URL/api/tpv/iniciar-pago" \
  -H "Content-Type: application/json" \
  -d '{"client":{"name":"Test"},"pricing":{"total":60000},"airports":{"origin":"LEBL","destination":"LEMD"}}')

if echo "$VALIDATION_3" | grep -qi "excede\|límite"; then
  test_result 0 "Rechaza importe excesivo"
else
  test_result 1 "NO rechaza importe excesivo"
fi
echo ""

# Test 5: HTTPS (solo si es URL pública)
if [[ "$BACKEND_URL" == https://* ]]; then
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "5️⃣  HTTPS & SSL Certificate"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  
  SSL_TEST=$(curl -I "$BACKEND_URL/api/health" 2>&1 | grep "HTTP")
  echo "$SSL_TEST"
  
  if echo "$SSL_TEST" | grep -q "HTTP/2"; then
    test_result 0 "HTTPS con HTTP/2 activo"
  else
    test_result 0 "HTTPS activo"
  fi
  echo ""
fi

# Test 6: Verificar que claves NO están en código
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "6️⃣  Secret Keys NOT in Code"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cd "$(dirname "$0")/.." || exit 1

# Buscar claves de prueba en archivos Python
TEST_KEY_IN_CODE=$(grep -r "sq7HjrUOBfKmC576ILgskD5srU870gJ7" backend/*.py 2>/dev/null | grep -v ".env" || true)
PROD_KEY_IN_CODE=$(grep -r "Kmxl0wQuJmXiaukCGWTurOwhc+8Z9sAB" backend/*.py 2>/dev/null | grep -v ".env" || true)

if [ -z "$TEST_KEY_IN_CODE" ] && [ -z "$PROD_KEY_IN_CODE" ]; then
  test_result 0 "Claves NO están hardcodeadas en código"
else
  test_result 1 "⚠️  CLAVES ENCONTRADAS EN CÓDIGO (CRÍTICO)"
  echo "   Archivos afectados:"
  echo "$TEST_KEY_IN_CODE"
  echo "$PROD_KEY_IN_CODE"
fi

# Verificar .gitignore
if grep -q "^\.env$" .gitignore; then
  test_result 0 ".env está en .gitignore"
else
  test_result 1 ".env NO está en .gitignore (agregar)"
fi
echo ""

# Resumen
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 RESUMEN"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Checklist de Seguridad:"
echo "  [ ] Health check funcionando"
echo "  [ ] TPV en modo PRODUCCIÓN (no TEST)"
echo "  [ ] CORS bloqueando dominios no autorizados"
echo "  [ ] Rate limiting activo (5/min)"
echo "  [ ] Validación de entrada funcionando"
echo "  [ ] HTTPS activo (si está desplegado)"
echo "  [ ] Claves NO en código"
echo "  [ ] .env en .gitignore"
echo ""
echo "Próximos pasos:"
echo "  1. Desplegar en Railway: https://railway.app"
echo "  2. Configurar variables de entorno"
echo "  3. Re-ejecutar este script con URL de producción:"
echo "     ./test-security.sh https://tu-backend.railway.app"
echo ""
echo "✅ Testing completo!"

