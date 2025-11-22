# 💳 Integración TPV MAITSA/Redsys - Documentación Completa

**Versión**: 3.1.0  
**Provider**: MAITSA (Redsys/Caixabank)  
**Merchant Code**: 340829647  
**Estado**: ✅ Implementado en Modo TEST

---

## 📋 Resumen

Sistema de pagos integrado con TPV Virtual Redsys/MAITSA que permite:
- ✅ Pagos con tarjeta de crédito/débito
- ✅ Firmas SHA256 seguras (backend)
- ✅ Modo TEST con tarjetas de prueba
- ✅ Callbacks OK/KO automáticos
- ✅ Notificaciones servidor a servidor

---

## 🏗️ Arquitectura

```
Usuario → Formulario (Frontend)
  ↓
Backend Flask → Genera firma SHA256
  ↓
Redsys TPV (Pasarela de pago)
  ↓
Usuario ingresa tarjeta
  ↓
Redsys → Callback (pago-ok.html o pago-ko.html)
  ↓
Redsys → Notificación servidor (confirmación definitiva)
```

**Seguridad:** La clave SHA256 NUNCA va al frontend (solo en backend)

---

## 📁 Archivos Implementados

### Backend (Python/Flask)
- `backend/tpv_redsys.py` - Lógica TPV, firmas SHA256
- `backend/app.py` - API Flask con endpoints
- `scripts/requirements.txt` - Dependencias (Flask, pycryptodome)

### Frontend (JavaScript)
- `src/js/config.js` - Configuración TPV
- `src/js/tpv-integration.js` - Integración con pasarela
- `src/js/app.js` - Llama a TPV al completar reserva
- `public/index.html` - Carga tpv-integration.js

### Páginas Callback
- `public/pago-ok.html` - Pago exitoso
- `public/pago-ko.html` - Pago cancelado/denegado

### Testing
- `tests/test-tpv.html` - Test automatizado

---

## 🚀 Instalación y Configuración

### 1. Instalar Dependencias

```bash
# Crear/activar venv
./scripts/setup-venv.sh
source venv/bin/activate

# Instalar dependencias
pip install -r scripts/requirements.txt
```

### 2. Iniciar Backend

```bash
# Terminal 1: Backend Flask (puerto 5000)
python backend/app.py
```

### 3. Iniciar Frontend

```bash
# Terminal 2: Servidor estático (puerto 8000)
./scripts/start.sh
```

### 4. Para Desarrollo Local (Callbacks)

Las URLs de callback deben ser públicas. Usa ngrok:

```bash
# Terminal 3: Ngrok
ngrok http 5000

# Copia la URL pública (ej: https://abc123.ngrok.io)
# Actualiza config.js con esa URL base
```

---

## 🔧 Configuración

### Modo TEST (Actual)

```javascript
// src/js/config.js
tpv: {
  enabled: true,
  provider: 'REDSYS_MAITSA',
  testMode: true,        // ← TEST
  merchantCode: '340829647',
  terminal: '1',
  currency: '978',
  // ...
}
```

### Cambiar a Producción

**IMPORTANTE:** Primero debes obtener la clave SHA256 de producción:

1. Ir a: https://canales.redsys.es/lacaixa/
2. Usuario: 340829647
3. Password: Click en "¿Ha olvidado su contraseña?"
4. Administración → Comercio → Buscar → Detalles
5. Ver clave → Copiar clave SHA256 (la larga)

```python
# backend/tpv_redsys.py línea ~24
CLAVE_SHA256_PRODUCTION = 'TU_CLAVE_DE_PRODUCCION_AQUI'
```

```javascript
// src/js/config.js
tpv: {
  testMode: false,  // ← PRODUCCIÓN
  // resto igual
}
```

```python
# backend/app.py línea ~18
TEST_MODE = False  # ← PRODUCCIÓN
```

---

## 🧪 Testing

### Test Automatizado

```
http://localhost:8000/tests/test-tpv.html
```

**Tests disponibles:**
1. Verificar Backend - Comprueba que Flask está corriendo
2. Generar Parámetros - Test de firma SHA256
3. Pago Completo - Redirige a Redsys (usar tarjetas de prueba)

### Tarjetas de Prueba

**Pago AUTORIZADO ✅:**
```
Número: 4548810000000003
CVV: 123
Caducidad: 12/25
CIP (si pide): 123456
```

**Pago DENEGADO ❌:**
```
Número: 1111111111111117
Caducidad: 12/25
```

### Flujo de Prueba Manual

1. Abrir: http://localhost:8000/public/index.html
2. Completar reserva (fechas, formulario)
3. Click en "Reservar Piloto - Pagar Ahora"
4. Redirige a Redsys
5. Ingresar tarjeta de prueba (4548810000000003)
6. Completar pago
7. Vuelve a pago-ok.html

---

## 📡 API Endpoints

### POST /api/tpv/iniciar-pago

**Request:**
```json
{
  "pricing": { "total": 1080.50 },
  "client": { "name": "Cliente" },
  "airports": { "origin": "LELL", "destination": "LEBL" }
}
```

**Response:**
```json
{
  "success": true,
  "parametros_tpv": {
    "Ds_SignatureVersion": "HMAC_SHA256_V1",
    "Ds_MerchantParameters": "eyJ...",
    "Ds_Signature": "abc...",
    "url_tpv": "https://sis-t.redsys.es:25443..."
  },
  "numero_pedido": "202511221430AB"
}
```

### GET /api/health

Verificar estado del backend.

### POST /api/tpv/notificacion

Recibe notificaciones servidor a servidor de Redsys (confirmación definitiva del pago).

---

## 🐛 Troubleshooting

### Backend no arranca

```bash
# Verificar Python
python3 --version

# Instalar dependencias
pip install -r scripts/requirements.txt

# Ejecutar
python backend/app.py
```

### Error "Firma inválida"

- Verifica que la clave SHA256 sea correcta
- En TEST: `sq7HjrUOBfKmC576ILgskD5srU870gJ7`
- En PRODUCCIÓN: Obtener del panel Redsys

### Callbacks no funcionan

- URLs deben ser públicas (usar ngrok en desarrollo)
- Verificar que backend está corriendo
- Revisar logs del backend

### Pago no se autoriza

- Usa tarjeta de prueba correcta: 4548810000000003
- CVV: 123
- CIP si pide: 123456

---

## 🔐 Seguridad

### Claves Sensibles

**NUNCA en el código cliente:**
- ❌ Clave SHA256 en JavaScript
- ❌ Clave SHA256 en HTML
- ❌ Clave SHA256 en GitHub público

**SIEMPRE en el servidor:**
- ✅ Clave en backend/tpv_redsys.py
- ✅ O mejor: en variable de entorno

### Variables de Entorno (Recomendado)

```bash
# .env (no subir a GitHub)
TPV_CLAVE_SHA256=sq7HjrUOBfKmC576ILgskD5srU870gJ7
TPV_MERCHANT_CODE=340829647
TPV_TEST_MODE=true
```

```python
# backend/app.py
from dotenv import load_dotenv
load_dotenv()

CLAVE_SHA256 = os.getenv('TPV_CLAVE_SHA256')
```

---

## 📊 Códigos de Respuesta Redsys

| Código | Significado |
|--------|-------------|
| 0000-0099 | Autorizada ✅ |
| 0101 | Tarjeta caducada |
| 0116 | Saldo insuficiente |
| 0129 | CVV2 incorrecto |
| 0180 | Tarjeta no válida |
| 0190 | Denegado por banco |
| 9904 | Cancelado por usuario |

Ver códigos completos en backend/app.py

---

## 🎯 Próximos Pasos

### Para Producción

1. **Obtener clave SHA256 de producción** (panel Redsys)
2. **Configurar variables de entorno**
3. **Cambiar testMode: false**
4. **Desplegar backend** (Heroku, Railway, VPS)
5. **Configurar URLs públicas**
6. **Probar con tarjeta real**

### Mejoras Futuras

- [ ] Guardar transacciones en base de datos
- [ ] Panel de administración de pagos
- [ ] Devoluciones desde panel
- [ ] Webhooks para estados
- [ ] Logs detallados de transacciones

---

## 📞 Soporte MAITSA

**Email**: virtualtpv@comerciaglobalpay.com  
**Teléfono**: +34 914 353 028 (Opción 2)  
**Horario**: Lunes a viernes 9:00-19:00  
**Panel Test**: https://sis-t.redsys.es:25443/canales/  
**Panel Producción**: https://canales.redsys.es/lacaixa/

---

## ✅ Checklist de Verificación

```
[x] Backend Python/Flask creado
[x] Módulo tpv_redsys.py con firmas SHA256
[x] API endpoints implementados
[x] Frontend tpv-integration.js
[x] Integrado en app.js
[x] Páginas callback (OK/KO)
[x] Test automatizado
[x] Configuración en config.js
[x] Documentación completa
[ ] Dependencias instaladas (pip install -r scripts/requirements.txt)
[ ] Backend corriendo (python backend/app.py)
[ ] Probado con tarjetas de prueba
[ ] Pago OK funciona
[ ] Pago KO funciona
```

---

**Sistema de pagos TPV MAITSA/Redsys completamente implementado** ✅

