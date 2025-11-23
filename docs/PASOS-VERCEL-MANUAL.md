# 📝 PASOS PARA DEPLOY EN VERCEL (Manual)

**Estado actual:** Backend Railway ✅ FUNCIONANDO  
**Siguiente paso:** Deploy frontend en Vercel

---

## 🎯 PASO A PASO EXACTO

### 1️⃣ Sign Up en Vercel (Si no tienes cuenta)

**Ya estás en:** https://vercel.com/signup

1. ✅ Selecciona **"I'm working on personal project"** (Hobby - Gratis)
2. ✅ Nombre: **"SexyFly Team"** (o el que quieras)
3. Click **"Continue"**
4. Selecciona **"Continue with GitHub"**
5. Autoriza Vercel en tu cuenta de GitHub
6. ✅ ¡Cuenta creada!

### 2️⃣ Crear Nuevo Proyecto

Una vez logueado:

1. Click en **"Add New..."** o **"New Project"**
2. En la lista de repos, busca **"sexyfly-reservas"**
3. Click en **"Import"** al lado de `sexyfly-reservas`

### 3️⃣ Configurar el Proyecto ⚠️ IMPORTANTE

**Pantalla de configuración:**

```
┌─────────────────────────────────────────────┐
│ Framework Preset: Other                     │
│                                             │
│ Root Directory: static      ← ¡CRÍTICO!     │
│ (Click "Edit" si necesario)                 │
│                                             │
│ Build Command: (dejar vacío)                │
│ Output Directory: (dejar vacío)             │
│ Install Command: (dejar vacío)              │
└─────────────────────────────────────────────┘
```

**⚠️ MUY IMPORTANTE:** 
- **Root Directory:** `static` ← DEBE estar configurado como `static`
- Si no ves la opción, busca **"Edit"** o **"Configure"**

### 4️⃣ Deploy

1. Verifica que **Root Directory = static**
2. Click **"Deploy"**
3. Espera 1-2 minutos ⏳
4. ✅ **¡Listo!**

### 5️⃣ Copiar la URL

Vercel te mostrará una URL como:

```
✅ https://sexyfly-reservas.vercel.app
```

o

```
✅ https://sexyfly-reservas-TU-USUARIO.vercel.app
```

**📋 COPIA ESA URL** - La necesitaremos para el test E2E

---

## 🧪 DESPUÉS DEL DEPLOY

### Test Rápido (TÚ lo haces):

1. Abre la URL de Vercel en tu navegador
2. Presiona **F12** (Consola del navegador)
3. Busca mensajes:
   - ✅ `SexyFly Config v3.0.0 cargado correctamente`
   - ✅ Sin errores de conexión

### ¿Qué verás?

- ✅ Formulario de reserva
- ✅ Calendario funcional
- ✅ Sin errores en consola

---

## ✅ CONFIRMA CUANDO HAYAS TERMINADO

**Una vez que veas el sitio desplegado:**

1. Copia la URL de Vercel
2. Pégamela en el chat
3. YO haré el test E2E completo navegando el sitio

---

## 🚨 SI HAY PROBLEMAS

**Problema 1:** No encuentro "Root Directory"
- **Solución:** Busca botón "Configure" o "Advanced Settings"

**Problema 2:** Deploy falla
- **Solución:** Verifica que Root Directory sea exactamente `static`

**Problema 3:** La página no carga
- **Solución:** Espera 1-2 minutos, Vercel está propagando

---

**Nota:** Estoy en la página de Sign Up pero Vercel requiere autenticación con GitHub que no puedo completar automáticamente por seguridad.

**POR FAVOR:**
1. Completa el Sign Up con GitHub
2. Deploy el proyecto con Root Directory = `static`
3. Pásame la URL generada
4. YO hago el test E2E completo 🚀

