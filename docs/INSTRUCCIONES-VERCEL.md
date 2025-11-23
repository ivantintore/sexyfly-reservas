# 📘 Instrucciones para Deploy en Vercel

**Backend:** ✅ FUNCIONANDO en Railway  
**Frontend:** ⏳ PENDIENTE en Vercel

---

## 🚀 PASO A PASO: Deploy Frontend en Vercel

### 1️⃣ Ir a Vercel

Abre tu navegador y ve a: **https://vercel.com**

### 2️⃣ Sign Up / Login

- Click en **"Sign Up"** o **"Login"**
- Usa tu cuenta de **GitHub**
- Autoriza Vercel para acceder a tus repositorios

### 3️⃣ Crear Nuevo Proyecto

- Click en **"Add New..."** o **"New Project"**
- Click en **"Import"** al lado de `sexyfly-reservas`

### 4️⃣ Configurar el Proyecto

**IMPORTANTE: Configuración específica**

```
Framework Preset: Other
Root Directory: static      ← ¡IMPORTANTE!
Build Command: (dejar vacío)
Output Directory: (dejar vacío)
Install Command: (dejar vacío)
```

**⚠️ CRÍTICO:** El `Root Directory` debe ser `static`

### 5️⃣ Deploy

- Click en **"Deploy"**
- Espera 1-2 minutos
- ✅ **¡Listo!**

### 6️⃣ Copiar la URL

Vercel te dará una URL como:
```
https://sexyfly-reservas.vercel.app
```

o

```
https://sexyfly-reservas-tu-usuario.vercel.app
```

**¡Copia esa URL!**

---

## 🧪 VERIFICAR QUE TODO FUNCIONA

### Test Backend (Railway)

```bash
curl https://web-production-a113a.up.railway.app/api/health
```

**Debe mostrar:**
```json
{
  "merchant_code": "340829647",
  "status": "ok",
  "tpv_mode": "production",
  "version": "3.1.0"
}
```

### Test Frontend (Vercel)

1. Abre la URL de Vercel en tu navegador
2. Abre la consola del navegador (F12)
3. Busca mensajes de:
   - `✅ SexyFly Config v3.0.0 cargado correctamente`
   - Conexión al backend

---

## 📋 CONFIGURACIÓN DE VERCEL (Captura)

Cuando estés en la pantalla de configuración, asegúrate de que se vea así:

```
┌─────────────────────────────────────────────┐
│ Configure Project                           │
├─────────────────────────────────────────────┤
│ Framework Preset: Other                     │
│                                             │
│ Root Directory: static      ← ¡IMPORTANTE! │
│                                             │
│ Build Command: (vacío)                      │
│                                             │
│ Output Directory: (vacío)                   │
│                                             │
│ Install Command: (vacío)                    │
└─────────────────────────────────────────────┘
```

---

## 🌐 URLs FINALES

**Backend (Railway):**
```
https://web-production-a113a.up.railway.app
```

**Frontend (Vercel):**
```
https://sexyfly-reservas.vercel.app  (o similar)
```

---

## 🎯 DESPUÉS DEL DEPLOY

### Configurar Dominio Personalizado (Opcional)

Si tienes `sexyfly.es`:

1. En Vercel → Settings → Domains
2. Agregar `sexyfly.es`
3. Configurar DNS según instrucciones de Vercel

### Integrar en WordPress (Opcional)

En tu WordPress (`sexyfly.es/pilots` o similar):

```html
<iframe 
  src="https://tu-url-vercel.vercel.app" 
  width="100%" 
  height="900px"
  frameborder="0">
</iframe>
```

---

## ✅ CHECKLIST FINAL

Antes de considerar terminado:

- [ ] Frontend desplegado en Vercel
- [ ] Abrir URL de Vercel en navegador
- [ ] Verificar consola (F12) sin errores
- [ ] Probar formulario de reserva
- [ ] Verificar que llega a pantalla de pago TPV

---

**¡Estamos a UN PASO de completar todo! 🚀**

