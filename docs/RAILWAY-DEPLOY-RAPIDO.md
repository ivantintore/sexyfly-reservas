# ⚡ Railway Deploy RÁPIDO - 5 Minutos

**Solo los pasos esenciales para desplegar YA.**

---

## 1️⃣ Railway Backend (2 min)

### Paso 1: Crear Proyecto
1. Ve a **https://railway.app** → Sign up con GitHub
2. Click **"Deploy from GitHub repo"**
3. Selecciona **`sexyfly-reservas`**

### Paso 2: Variables de Entorno
Click en **"Variables"** → **"Raw Editor"** → Pega esto:

```env
TPV_CLAVE_TEST=sq7HjrUOBfKmC576ILgskD5srU870gJ7
TPV_CLAVE_PROD=Kmxl0wQuJmXiaukCGWTurOwhc+8Z9sAB
TPV_TEST_MODE=false
FRONTEND_URL=https://sexyfly.es
PORT=5001
```

Click **"Update Variables"**

### Paso 3: Deploy
- Se desplegará automáticamente
- Espera ~2 minutos
- Copia la URL: `https://sexyfly-backend-xxxxx.up.railway.app`

### Paso 4: Verificar
```bash
curl https://TU-URL.railway.app/api/health
```

**Debe mostrar:** `"tpv_mode": "production"` ✅

---

## 2️⃣ Vercel Frontend (2 min)

### Paso 1: Crear Proyecto
1. Ve a **https://vercel.com** → Sign up con GitHub
2. Click **"Add New Project"**
3. Selecciona **`sexyfly-reservas`**

### Paso 2: Configurar
- **Root Directory:** `public`
- **Build Command:** (vacío)
- **Output Directory:** (vacío)

### Paso 3: Deploy
- Click **"Deploy"**
- Espera ~1 minuto
- Copia la URL: `https://sexyfly-reservas.vercel.app`

---

## 3️⃣ Actualizar config.js (1 min)

En tu código local, edita `src/js/config.js`:

```javascript
apiUrl: window.location.hostname === 'localhost' 
  ? 'http://localhost:5001/api/tpv/iniciar-pago'
  : 'https://TU-BACKEND.railway.app/api/tpv/iniciar-pago',
```

**Reemplaza `TU-BACKEND.railway.app` con tu URL real de Railway**

Commit y push:
```bash
git add .
git commit -m "feat: configurar URLs de producción"
git push
```

Vercel redesplegará automáticamente.

---

## 4️⃣ Verificar Todo (30 seg)

1. Abre tu URL de Vercel
2. Abre consola del navegador (F12)
3. Busca: `✅ Backend TPV operativo`
4. Llena formulario y prueba pago

---

## ✅ ¡Listo!

**Backend:** https://tu-backend.railway.app  
**Frontend:** https://sexyfly-reservas.vercel.app

**Para WordPress:** 
- Crea página en `sexyfly.es/pilots`
- Inserta iframe:
```html
<iframe src="https://sexyfly-reservas.vercel.app" width="100%" height="900px"></iframe>
```

---

**Tiempo total:** ~5 minutos ⚡

