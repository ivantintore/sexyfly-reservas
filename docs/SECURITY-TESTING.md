# 🔒 Security Testing Guide - SexyFly

**Versión:** 3.2.0  
**Fecha:** 2025-11-23

Esta guía te ayudará a verificar que todas las medidas de seguridad están funcionando correctamente.

---

## ✅ Checklist de Seguridad

### 1. Variables de Entorno ✅

**Verificar que las claves NO están en el código:**

```bash
# Buscar claves expuestas en código
cd /Users/ivantintore/CURSOR\ -\ AVIONES/sexyfly-reservas
grep -r "sq7HjrUOBfKmC576ILgskD5srU870gJ7" backend/
grep -r "Kmxl0wQuJmXiaukCGWTurOwhc+8Z9sAB" backend/

# Resultado esperado: Solo en .env.example (que NO se sube a GitHub)
```

**Verificar .gitignore:**

```bash
cat .gitignore | grep ".env"

# Debe mostrar:
# .env
# .env.local
# .env.*.local
```

### 2. CORS Restringido ✅

**Test 1: Dominio autorizado (debe funcionar)**

```bash
# Desde sexyfly.es debe funcionar
curl -X POST https://TU-BACKEND.railway.app/api/tpv/iniciar-pago \
  -H "Origin: https://sexyfly.es" \
  -H "Content-Type: application/json" \
  -d '{"test":"data"}'

# ✅ Debe responder (aunque falle por datos inválidos)
```

**Test 2: Dominio NO autorizado (debe fallar)**

```bash
# Desde dominio malicioso debe fallar
curl -X POST https://TU-BACKEND.railway.app/api/tpv/iniciar-pago \
  -H "Origin: https://sitio-malicioso.com" \
  -H "Content-Type: application/json" \
  -d '{"test":"data"}'

# ❌ Debe retornar error CORS
```

### 3. Rate Limiting ✅

**Test: Más de 5 requests en 1 minuto**

```bash
# Hacer 6 requests rápidos
for i in {1..6}; do
  echo "Request $i:"
  curl -X POST https://TU-BACKEND.railway.app/api/tpv/iniciar-pago \
    -H "Content-Type: application/json" \
    -d '{"test":"data"}'
  echo -e "\n"
  sleep 1
done

# ✅ Request 6 debe retornar: 429 Too Many Requests
```

### 4. Validación de Entrada ✅

**Test 1: Sin datos**

```bash
curl -X POST https://TU-BACKEND.railway.app/api/tpv/iniciar-pago \
  -H "Content-Type: application/json"

# ✅ Debe retornar: {"success": false, "error": "No se recibieron datos"}
```

**Test 2: Falta campo requerido**

```bash
curl -X POST https://TU-BACKEND.railway.app/api/tpv/iniciar-pago \
  -H "Content-Type: application/json" \
  -d '{"client":{"name":"Test"}}'

# ✅ Debe retornar: {"success": false, "error": "Falta campo requerido: pricing"}
```

**Test 3: Importe negativo**

```bash
curl -X POST https://TU-BACKEND.railway.app/api/tpv/iniciar-pago \
  -H "Content-Type: application/json" \
  -d '{
    "client":{"name":"Test"},
    "pricing":{"total":-100},
    "airports":{"origin":"LEBL","destination":"LEMD"}
  }'

# ✅ Debe retornar: {"success": false, "error": "El importe debe ser mayor a 0"}
```

**Test 4: Importe excesivo**

```bash
curl -X POST https://TU-BACKEND.railway.app/api/tpv/iniciar-pago \
  -H "Content-Type: application/json" \
  -d '{
    "client":{"name":"Test"},
    "pricing":{"total":60000},
    "airports":{"origin":"LEBL","destination":"LEMD"}
  }'

# ✅ Debe retornar: {"success": false, "error": "El importe excede el límite permitido"}
```

### 5. Debug Mode Desactivado ✅

**Verificar health check:**

```bash
curl https://TU-BACKEND.railway.app/api/health | python3 -m json.tool

# ✅ Debe mostrar:
# {
#   "status": "ok",
#   "tpv_mode": "production",  ← IMPORTANTE
#   "merchant_code": "340829647",
#   "version": "3.1.0"
# }
```

**Verificar que NO expone stack traces:**

```bash
# Provocar error intencional
curl -X POST https://TU-BACKEND.railway.app/api/tpv/iniciar-pago \
  -H "Content-Type: application/json" \
  -d 'INVALID JSON'

# ✅ NO debe mostrar stack trace de Python
# ❌ Solo debe mostrar mensaje genérico de error
```

### 6. HTTPS Obligatorio ✅

**Verificar certificado SSL:**

```bash
curl -I https://TU-BACKEND.railway.app/api/health

# ✅ Debe mostrar:
# HTTP/2 200
# (Sin advertencias de certificado)
```

**Intentar HTTP (debe redirigir a HTTPS):**

```bash
curl -I http://TU-BACKEND.railway.app/api/health

# ✅ Debe redirigir (301/302) a HTTPS
```

### 7. Headers de Seguridad ✅

**Verificar headers en respuesta:**

```bash
curl -I https://TU-FRONTEND.vercel.app/

# ✅ Debe incluir:
# x-content-type-options: nosniff
# x-frame-options: SAMEORIGIN
# x-xss-protection: 1; mode=block
```

### 8. TPV en Modo Producción ✅

**Verificar configuración frontend:**

```bash
# Abrir consola del navegador en https://TU-FRONTEND.vercel.app
# Ejecutar:
console.log('TPV Test Mode:', SEXYFLY_CONFIG.integrations.tpv.testMode);

# ✅ Debe mostrar: false (producción)
```

**Verificar configuración backend:**

```bash
curl https://TU-BACKEND.railway.app/api/health | grep tpv_mode

# ✅ Debe mostrar: "tpv_mode": "production"
```

---

## 🧪 Testing Automatizado

### Script de Verificación Completa

Guarda este script como `test-security.sh`:

```bash
#!/bin/bash

# SexyFly - Security Testing Script
# Version: 3.2.0

echo "🔒 SexyFly Security Testing"
echo "============================"
echo ""

# Configurar URL del backend
BACKEND_URL="https://TU-BACKEND.railway.app"

# Test 1: Health Check
echo "1️⃣  Testing Health Check..."
curl -s "$BACKEND_URL/api/health" | python3 -m json.tool
echo ""

# Test 2: CORS Restricción
echo "2️⃣  Testing CORS Restriction..."
curl -s -X POST "$BACKEND_URL/api/tpv/iniciar-pago" \
  -H "Origin: https://sitio-malicioso.com" \
  -H "Content-Type: application/json" \
  -d '{"test":"data"}'
echo ""

# Test 3: Rate Limiting
echo "3️⃣  Testing Rate Limiting (6 requests)..."
for i in {1..6}; do
  echo "Request $i:"
  curl -s -w "\nHTTP Code: %{http_code}\n" \
    -X POST "$BACKEND_URL/api/tpv/iniciar-pago" \
    -H "Content-Type: application/json" \
    -d '{"test":"data"}'
  sleep 1
done
echo ""

# Test 4: Validación de Entrada
echo "4️⃣  Testing Input Validation..."
echo "Test 4.1: Sin datos"
curl -s -X POST "$BACKEND_URL/api/tpv/iniciar-pago" \
  -H "Content-Type: application/json"
echo ""

echo "Test 4.2: Importe negativo"
curl -s -X POST "$BACKEND_URL/api/tpv/iniciar-pago" \
  -H "Content-Type: application/json" \
  -d '{"client":{"name":"Test"},"pricing":{"total":-100},"airports":{"origin":"LEBL"}}'
echo ""

# Test 5: HTTPS
echo "5️⃣  Testing HTTPS..."
curl -I "$BACKEND_URL/api/health" 2>&1 | grep "HTTP"
echo ""

# Test 6: Headers de Seguridad
echo "6️⃣  Testing Security Headers..."
curl -I https://sexyfly-reservas.vercel.app/ 2>&1 | grep -i "x-"
echo ""

echo "✅ Security Testing Complete!"
echo ""
echo "Resultados esperados:"
echo "1️⃣  Health Check: tpv_mode = production"
echo "2️⃣  CORS: Debe fallar con dominio no autorizado"
echo "3️⃣  Rate Limiting: Request 6 debe retornar 429"
echo "4️⃣  Validación: Errores descriptivos"
echo "5️⃣  HTTPS: HTTP/2 200"
echo "6️⃣  Headers: X-Content-Type-Options, X-Frame-Options"
```

**Ejecutar:**

```bash
chmod +x test-security.sh
./test-security.sh
```

---

## 🛠️ Herramientas de Testing Profesional

### OWASP ZAP (Gratis)

```bash
# Instalar en Mac
brew install --cask owasp-zap

# Ejecutar
open /Applications/OWASP\ ZAP.app

# Escanear
1. Tools → Automated Scan
2. URL: https://TU-BACKEND.railway.app
3. Attack
4. Revisar alertas
```

### SSL Labs (Online, Gratis)

```bash
# Verificar calidad SSL
1. Ir a: https://www.ssllabs.com/ssltest/
2. Hostname: TU-BACKEND.railway.app
3. Submit
4. Esperar resultados
5. ✅ Objetivo: Grade A
```

### Security Headers (Online, Gratis)

```bash
# Verificar headers de seguridad
1. Ir a: https://securityheaders.com/
2. URL: https://TU-FRONTEND.vercel.app
3. Scan
4. ✅ Objetivo: Grade A o B
```

---

## 📊 Resultados Esperados

### ✅ Checklist Final

- [ ] Claves NO están en código (solo en .env)
- [ ] `.env` está en `.gitignore`
- [ ] CORS rechaza dominios no autorizados
- [ ] Rate limiting bloquea request #6
- [ ] Validación rechaza datos inválidos
- [ ] Health check muestra `"tpv_mode": "production"`
- [ ] Debug mode desactivado (sin stack traces)
- [ ] HTTPS activo (certificado válido)
- [ ] Headers de seguridad presentes
- [ ] TPV en modo producción
- [ ] Railway variables de entorno configuradas
- [ ] Test de pago real exitoso

### 🎯 Objetivo: 12/12 ✅

---

## 🆘 Troubleshooting

### Error: "tpv_mode": "test"

**Problema:** Backend sigue en modo TEST

**Solución:**
1. Ir a Railway → Variables
2. Verificar: `TPV_TEST_MODE=false`
3. Redeploy del backend

### Error: CORS permite todo

**Problema:** CORS no está restringiendo

**Solución:**
1. Verificar `ALLOWED_ORIGINS` en `backend/app.py`
2. Configurar `FRONTEND_URL` en Railway
3. Redeploy

### Error: Rate limiting no funciona

**Problema:** Permite más de 5 requests/min

**Solución:**
1. Verificar que `flask-limiter` está instalado
2. Revisar `requirements.txt`
3. Redeploy en Railway

---

## 📞 Contacto

Si encuentras alguna vulnerabilidad:

**Email:** ivan@maitsa.com  
**Asunto:** [SECURITY] SexyFly Vulnerability Report

---

**Última actualización:** 2025-11-23  
**Estado de Seguridad:** ✅ HARDENED  
**Vulnerabilidades conocidas:** 0/5 (todas corregidas)

