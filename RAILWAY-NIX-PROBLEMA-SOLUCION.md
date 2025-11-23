# 🔧 RAILWAY + NIXPACKS: Problema y Solución

**Fecha:** 23 Noviembre 2025  
**Problema:** Filesystem inmutable de Nix  
**Solución:** Crear venv dentro del contenedor

---

## ❌ EL PROBLEMA

### Por qué fallaba Railway

Railway usa **Nixpacks** para construir el contenedor:

1. **Nixpacks detecta Python** en el proyecto
2. Instala Python usando **Nix** (un gestor de paquetes)
3. Python se instala en `/nix/store` (filesystem **INMUTABLE**)
4. ❌ **No se puede modificar** `/nix/store`
5. ❌ `pip install` FALLA

### Errores que vimos (en orden):

#### Error #1: `pip: command not found`
```bash
/bin/bash: line 1: pip: command not found
```

#### Error #2: `No module named pip`
```bash
/root/.nix-profile/bin/python3: No module named pip
```

#### Error #3: `externally-managed-environment`
```
error: externally-managed-environment
This environment is externally managed
This command has been disabled as it tries to modify the immutable `/nix/store` filesystem.
```

---

## ✅ LA SOLUCIÓN CORRECTA

### `nixpacks.toml` (CONFIGURACIÓN FINAL)

```toml
[phases.setup]
nixPkgs = ["python312"]

[phases.install]
cmds = [
  "python3 -m venv /opt/venv",
  ". /opt/venv/bin/activate && pip install -r requirements.txt"
]

[start]
cmd = ". /opt/venv/bin/activate && gunicorn app:app --bind 0.0.0.0:$PORT"
```

### ¿Por qué funciona?

1. ✅ **Crea un venv DENTRO del contenedor** en `/opt/venv`
2. ✅ El venv **NO está en** `/nix/store` (inmutable)
3. ✅ Podemos instalar paquetes en `/opt/venv`
4. ✅ Activamos el venv antes de ejecutar gunicorn

---

## 🚨 IMPORTANTE: NO CONFUNDIR

### VENV LOCAL vs VENV EN RAILWAY

| Aspecto | LOCAL | RAILWAY |
|---------|-------|---------|
| **Ubicación** | `./venv/` | `/opt/venv/` |
| **En Git?** | ❌ NO (.gitignore) | ❌ NO (se crea en build) |
| **Cuándo se crea** | Manual (`python -m venv venv`) | Automático (nixpacks.toml) |
| **Propósito** | Desarrollo local | Producción en Railway |

### ¿Por qué el venv local NO se usa en Railway?

```
# En .gitignore:
venv/      ← NO se sube a GitHub
```

**Esto es CORRECTO** ✅

- El venv local contiene binarios compilados para tu Mac
- Railway es Linux x86_64
- Los binarios **NO son compatibles**
- Por eso cada ambiente crea su propio venv

---

## 📝 LECCIONES APRENDIDAS

### 1️⃣ **Railway + Nixpacks requiere venv**
- Nix tiene filesystem inmutable
- Solución: crear venv en el build

### 2️⃣ **Cada ambiente tiene su venv**
- **Local:** `./venv/` (Mac/Linux local)
- **Railway:** `/opt/venv/` (Linux x86_64)
- **Render:** Se crea automáticamente

### 3️⃣ **NO subir venv a Git**
- Siempre en `.gitignore`
- Cada ambiente crea el suyo

### 4️⃣ **Archivo crítico: `nixpacks.toml`**
- Define cómo Railway construye el contenedor
- **NO MODIFICAR** sin entender Nix

---

## 🎯 CONFIGURACIÓN FINAL

### Archivos importantes (NO TOCAR):

#### `nixpacks.toml` ← **CRÍTICO**
```toml
[phases.setup]
nixPkgs = ["python312"]

[phases.install]
cmds = [
  "python3 -m venv /opt/venv",
  ". /opt/venv/bin/activate && pip install -r requirements.txt"
]

[start]
cmd = ". /opt/venv/bin/activate && gunicorn app:app --bind 0.0.0.0:$PORT"
```

#### `Procfile` ← Alternativa (Railway puede usarlo)
```
web: gunicorn app:app --bind 0.0.0.0:$PORT
```

#### `railway.json` ← Configuración Railway
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "gunicorn app:app --bind 0.0.0.0:$PORT",
    "healthcheckPath": "/api/health"
  }
}
```

---

## 🔄 FLUJO DE TRABAJO CORRECTO

### Desarrollo Local
```bash
# 1. Activar venv local
source venv/bin/activate

# 2. Trabajar normalmente
python app.py

# 3. Commit (venv NO se incluye)
git add .
git commit -m "..."
git push
```

### Deploy en Railway
```
Railway detecta push
    ↓
Clona repo (SIN venv local)
    ↓
Ejecuta nixpacks.toml
    ↓
Crea /opt/venv nuevo
    ↓
Instala requirements.txt
    ↓
Ejecuta: . /opt/venv/bin/activate && gunicorn ...
    ↓
✅ FUNCIONA
```

---

## 🚀 PRÓXIMOS PASOS

**Ahora mismo:**
1. ✅ Código correcto subido (commit: `84480c4`)
2. ⏳ Railway está haciendo build...
3. 🎯 Esperamos ~2 minutos más

**Si funciona:**
- ✅ Copiar URL de Railway
- ✅ Actualizar `src/js/config.js` con la URL real
- ✅ Deploy frontend en Vercel

**Si sigue fallando:**
- 🔄 Considerar eliminar `railway.json` (puede conflictuar)
- 🔄 O cambiar a Render.com (más simple)

---

## 📌 PARA EL FUTURO

### ✅ HACER
- Mantener `nixpacks.toml` como está
- Mantener `venv/` en `.gitignore`
- Crear venv local para desarrollo

### ❌ NO HACER
- NO subir `venv/` a Git
- NO modificar `nixpacks.toml` sin entender Nix
- NO usar `ensurepip` en Nix (filesystem inmutable)

---

**TL;DR:** Railway usa Nix (filesystem inmutable). Necesitamos crear un venv dentro del contenedor. Ya lo hicimos. Ahora esperamos. 🚀

