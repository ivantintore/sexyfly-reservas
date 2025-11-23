# 🚀 Guía de Deploy a Producción - SexyFly

**Versión:** 3.2.0  
**Fecha:** 2025-11-23  
**Estado:** ✅ Listo para deploy

---

## 📋 Resumen

Esta guía te llevará paso a paso para desplegar SexyFly en producción de forma **SEGURA** usando:
- **Backend:** Railway.app (gratis, Python/Flask)
- **Frontend:** Vercel (gratis, HTML/JS) o WordPress

---

## ✅ Mejoras de Seguridad Implementadas

### 1. Claves Secretas en Variables de Entorno ✅
- ❌ **ANTES:** Claves hardcodeadas en código
- ✅ **AHORA:** Variables de entorno (`.env`)
- **Archivos modificados:**
  - `backend/tpv_redsys.py`
  - `backend/app.py`

### 2. CORS Restringido ✅
- ❌ **ANTES:** `CORS(app)` - Cualquier origen
- ✅ **AHORA:** Solo dominios autorizados:
  - `https://sexyfly.es`
  - `https://www.sexyfly.es`
  - Variable de entorno `FRONTEND_URL`

### 3. Debug Mode Solo en Test ✅
- ❌ **ANTES:** `debug=True` siempre
- ✅ **AHORA:** `debug=TEST_MODE` (False en producción)

### 4. Rate Limiting ✅
- **Global:** 200/día, 50/hora
- **Endpoint /iniciar-pago:** 5/minuto
- Protección contra ataques de fuerza bruta

### 5. Validación de Entrada ✅
- Campos requeridos validados
- Tipos de datos verificados
- Importes con límites (> 0€, < 50,000€)
- Mensajes de error descriptivos

### 6. TPV en Modo Producción ✅
- `testMode: false` en config.js
- `TPV_TEST_MODE=false` en variables de entorno
- Clave de producción configurada

---

## 🎯 FASE 1: Deploy Backend en Railway

### Paso 1.1: Crear Cuenta en Railway

1. Ve a **https://railway.app**
2. Click en **"Start a New Project"**
3. Autoriza con **GitHub**

### Paso 1.2: Crear Proyecto desde GitHub

1. Click en **"Deploy from GitHub repo"**
2. Selecciona **`ivantintore/sexyfly-reservas`**
3. Railway detectará automáticamente Python

### Paso 1.3: Configurar Variables de Entorno

En el panel de Railway, ve a **"Variables"** y agrega:

```env
TPV_CLAVE_TEST=sq7HjrUOBfKmC576ILgskD5srU870gJ7
TPV_CLAVE_PROD=Kmxl0wQuJmXiaukCGWTurOwhc+8Z9sAB
TPV_TEST_MODE=false
FRONTEND_URL=https://sexyfly.es
PORT=5001
```

⚠️ **IMPORTANTE:** Verifica que `TPV_TEST_MODE=false` para producción

### Paso 1.4: Verificar Deploy

1. Railway mostrará logs del deploy
2. Espera a ver: ✅ **"Build successful"**
3. Copia la URL generada (ejemplo):
   ```
   https://sexyfly-backend-production.up.railway.app
   ```

### Paso 1.5: Probar Backend

```bash
# Verificar health check
curl https://TU-URL.railway.app/api/health

# Respuesta esperada:
{
  "status": "ok",
  "tpv_mode": "production",
  "merchant_code": "340829647",
  "version": "3.1.0"
}
```

✅ **Si ves `"tpv_mode": "production"`, está en modo PRODUCCIÓN correctamente**

---

## 🎯 FASE 2: Deploy Frontend

### Opción A: Vercel (Recomendado para empezar)

#### Paso 2A.1: Crear Cuenta en Vercel

1. Ve a **https://vercel.com**
2. Sign up con **GitHub**

#### Paso 2A.2: Importar Proyecto

1. Click en **"Add New Project"**
2. Selecciona **`sexyfly-reservas`**
3. Configurar:
   - **Framework Preset:** Other
   - **Root Directory:** `public`
   - **Build Command:** (dejar vacío)
   - **Output Directory:** (dejar vacío)

#### Paso 2A.3: Configurar Variables de Entorno (Opcional)

En Vercel, no necesitas variables ya que todo está en el código JavaScript.

#### Paso 2A.4: Deploy

1. Click en **"Deploy"**
2. Espera 1-2 minutos
3. Copia la URL (ejemplo):
   ```
   https://sexyfly-reservas.vercel.app
   ```

#### Paso 2A.5: Actualizar config.js con URL Backend

1. Edita `src/js/config.js`
2. Actualiza la URL del backend:

```javascript
apiUrl: window.location.hostname === 'localhost' 
  ? 'http://localhost:5001/api/tpv/iniciar-pago'
  : 'https://TU-BACKEND.railway.app/api/tpv/iniciar-pago',
```

3. Commit y push → Vercel redesplegará automáticamente

---

### Opción B: WordPress (sexyfly.es/pilots)

#### Paso 2B.1: Acceder a WordPress

1. Ve a **https://sexyfly.es/wp-admin/**
2. Usuario: `administrator`
3. Password: `7BxfA^Y(71dul5F*GN`

#### Paso 2B.2: Crear Página "Pilots"

1. En el menú lateral: **Páginas → Añadir nueva**
2. Título: **"Reserva de Piloto"**
3. Slug: **"pilots"** (se convierte en `sexyfly.es/pilots`)

#### Paso 2B.3: Insertar Código

**Opción 1 - Iframe (más simple):**

```html
<iframe 
  src="https://sexyfly-reservas.vercel.app" 
  width="100%" 
  height="900px" 
  frameborder="0"
  style="border: none; overflow: hidden;">
</iframe>
```

**Opción 2 - Insertar directamente (más integrado):**

1. Copia todo el contenido de `public/index.html`
2. Pega en el editor HTML de WordPress
3. Actualiza las rutas de CSS/JS:

```html
<!-- Cambiar rutas relativas a absolutas -->
<link rel="stylesheet" href="https://sexyfly-reservas.vercel.app/src/css/calendar.css">
<link rel="stylesheet" href="https://sexyfly-reservas.vercel.app/src/css/styles.css">

<script src="https://sexyfly-reservas.vercel.app/src/js/config.js"></script>
<script src="https://sexyfly-reservas.vercel.app/src/js/calendar.js"></script>
<!-- etc -->
```

#### Paso 2B.4: Publicar

1. Click en **"Publicar"**
2. Ve a **https://sexyfly.es/pilots**
3. Verifica que cargue correctamente

---

## 🎯 FASE 3: Configurar Redsys

### Paso 3.1: Actualizar URLs de Callback en Redsys

1. Ve al panel de Redsys:
   - **TEST:** https://sis-t.redsys.es:25443/canales/
   - **PRODUCCIÓN:** https://canales.redsys.es/lacaixa/
   
2. Usuario: `340829647`
3. Password: (recuperar si es necesario)

4. En **"Configuración → URLs Callback"**, configurar:

```
URL OK: https://sexyfly.es/pilots/pago-ok.html
URL KO: https://sexyfly.es/pilots/pago-ko.html
URL Notificación: https://TU-BACKEND.railway.app/api/tpv/notificacion
```

⚠️ **Reemplaza `TU-BACKEND.railway.app` con tu URL real de Railway**

---

## 🧪 FASE 4: Testing en Producción

### Test 1: Verificar Backend

```bash
curl https://TU-BACKEND.railway.app/api/health
```

**Respuesta esperada:**
```json
{
  "status": "ok",
  "tpv_mode": "production",
  "merchant_code": "340829647"
}
```

### Test 2: Verificar Frontend

1. Abre **https://sexyfly.es/pilots** (o tu URL de Vercel)
2. Abre la consola del navegador (F12)
3. Busca: `✅ Módulo TPV Redsys/MAITSA cargado`

### Test 3: Pago de Prueba (Con Tarjeta Real)

⚠️ **IMPORTANTE:** Ahora estás en PRODUCCIÓN. Usa una tarjeta real con importe mínimo (1€).

1. Llena el formulario de reserva
2. Click en **"Reservar"**
3. Verifica redirección a Redsys
4. Completa el pago con tarjeta real
5. Verifica redirect a `pago-ok.html`

### Test 4: Verificar CORS

```bash
# Desde otro dominio, debería fallar
curl -X POST https://TU-BACKEND.railway.app/api/tpv/iniciar-pago \
  -H "Origin: https://ejemplo-malicioso.com" \
  -H "Content-Type: application/json"

# Debería retornar error CORS
```

### Test 5: Verificar Rate Limiting

```bash
# Hacer 6 requests rápidos (debería bloquear la 6ta)
for i in {1..6}; do
  curl -X POST https://TU-BACKEND.railway.app/api/tpv/iniciar-pago \
    -H "Content-Type: application/json" \
    -d '{"test":"data"}'
  echo "Request $i"
done

# La 6ta debería retornar 429 (Too Many Requests)
```

---

## 📊 Monitoreo

### Railway Logs

1. En Railway, ve a **"Logs"**
2. Filtra por:
   - ✅ Pagos exitosos
   - ❌ Errores
   - ⚠️ Rate limiting activado

### Verificar Pagos en Redsys

1. Panel Redsys: **"Transacciones → Consultar"**
2. Buscar por fecha/importe
3. Verificar estado: **"Autorizada"**

---

## 🔒 Checklist de Seguridad Final

Antes de anunciar públicamente:

- [ ] ✅ Claves en variables de entorno (NO en código)
- [ ] ✅ CORS restringido a dominios permitidos
- [ ] ✅ Rate limiting activo (5/min en pago)
- [ ] ✅ Debug mode desactivado (`TPV_TEST_MODE=false`)
- [ ] ✅ HTTPS en todas las URLs
- [ ] ✅ Validación de entrada en endpoints
- [ ] ✅ `.env` en `.gitignore`
- [ ] ✅ Test de pago real exitoso
- [ ] ✅ URLs callback configuradas en Redsys
- [ ] ✅ Logs monitoreados en Railway

---

## 🆘 Troubleshooting

### Error: "Backend no disponible"

**Síntoma:** Error 501/503 en frontend

**Solución:**
1. Verifica que Railway esté corriendo
2. Revisa logs en Railway
3. Verifica variables de entorno

### Error: "CORS blocked"

**Síntoma:** Error en consola del navegador

**Solución:**
1. Verifica que `FRONTEND_URL` esté configurada en Railway
2. Añade el dominio a `ALLOWED_ORIGINS` en `backend/app.py`
3. Redespliega en Railway

### Error: "Firma inválida" en Redsys

**Síntoma:** Redsys rechaza el pago

**Solución:**
1. Verifica que `TPV_CLAVE_PROD` esté correcta en Railway
2. Confirma que `TPV_TEST_MODE=false`
3. Revisa logs del backend

### Error: "Rate limit exceeded"

**Síntoma:** Error 429 en peticiones

**Solución:**
- Normal, espera 1 minuto
- Si es problema, aumenta límite en `backend/app.py`

---

## 📞 Soporte

### Railway
- Docs: https://docs.railway.app
- Discord: https://discord.gg/railway

### Vercel
- Docs: https://vercel.com/docs
- Soporte: support@vercel.com

### Redsys/MAITSA
- Email: virtualtpv@comerciaglobalpay.com
- Teléfono: +34 914 353 028 (Opción 2)
- Horario: Lunes-Viernes 9:00-19:00

---

## 🎊 URLs Finales

Una vez desplegado, tendrás:

**Backend API:**
```
https://sexyfly-backend-production.up.railway.app
```

**Frontend (Vercel):**
```
https://sexyfly-reservas.vercel.app
```

**Frontend (WordPress):**
```
https://sexyfly.es/pilots
```

**Panel Redsys Producción:**
```
https://canales.redsys.es/lacaixa/
Usuario: 340829647
```

---

## 🎯 Próximos Pasos Opcionales

### 1. Base de Datos
- Actualmente: Reservas en memoria (se pierden al reiniciar)
- Recomendado: PostgreSQL en Railway (gratis hasta 500MB)

### 2. Dominio Personalizado Backend
- Actualmente: `*.railway.app`
- Opcional: `api.sexyfly.es`

### 3. Emails Automatizados
- Enviar confirmaciones de reserva
- Notificar pagos exitosos

### 4. Analytics
- Google Analytics
- Plausible (privacy-friendly)

---

**¡Tu aplicación está lista para producción!** 🚀

**Cambios importantes:**
- ✅ **5 vulnerabilidades** corregidas
- ✅ **TPV en modo producción**
- ✅ **Deploy automatizado**
- ✅ **Monitoreo activo**

**Versión:** 3.2.0 (Producción Security Hardened)

