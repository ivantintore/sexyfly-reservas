# 📁 NUEVA ESTRUCTURA DEL PROYECTO

**Fecha:** 23 Noviembre 2025  
**Versión:** 3.2.0 - Restructured  
**Estado:** ✅ Completado

---

## 🎯 OBJETIVO DE LA REESTRUCTURACIÓN

Simplificar el proyecto siguiendo estándares de Python/Flask para facilitar el deploy en plataformas como Railway, Render, Heroku, etc.

---

## 📂 ESTRUCTURA ANTERIOR vs NUEVA

### ❌ ANTES (Compleja)
```
sexyfly-reservas/
├── backend/              ← Subdirectorio innecesario
│   ├── app.py
│   └── tpv_redsys.py
├── public/               ← HTML separado
│   └── *.html
├── src/                  ← CSS/JS separado
│   ├── css/
│   └── js/
├── requirements.txt
└── Procfile              → web: cd backend && gunicorn...
```

**Problemas:**
- ❌ Backend en subdirectorio complica paths
- ❌ Frontend fragmentado en 2 carpetas (public/ y src/)
- ❌ Procfile con `cd backend` (anti-patrón)
- ❌ Imports relativos confusos
- ❌ Railway/Render se confunden con la estructura

---

### ✅ AHORA (Estándar)
```
sexyfly-reservas/
├── app.py                ← Backend principal (raíz)
├── tpv_redsys.py         ← Módulo TPV (raíz)
├── requirements.txt      ← Dependencias
├── Procfile              → web: gunicorn app:app
├── railway.json          ← Config Railway
├── nixpacks.toml         ← Config Nixpacks
├── runtime.txt           ← Python 3.12
├── .gitignore            ← Actualizado
│
├── static/               ← Frontend unificado ✨
│   ├── index.html
│   ├── pago-ok.html
│   ├── pago-ko.html
│   ├── reserva.html
│   ├── versions.json
│   ├── css/
│   │   ├── calendar.css
│   │   └── styles.css
│   └── js/
│       ├── app.js
│       ├── calendar.js
│       ├── config.js
│       ├── email-notifications.js
│       ├── pricing.js
│       └── tpv-integration.js
│
├── docs/                 ← Documentación
├── tests/                ← Tests
├── scripts/              ← Scripts útiles
└── venv/                 ← Virtual environment (gitignored)
```

**Ventajas:**
- ✅ Estructura estándar Python/Flask
- ✅ Paths simples y claros
- ✅ Frontend unificado en `static/`
- ✅ Deploy más simple
- ✅ Compatible con Railway, Render, Heroku, Vercel

---

## 🔧 CAMBIOS REALIZADOS

### 1. Backend movido a raíz
```bash
mv backend/app.py .
mv backend/tpv_redsys.py .
rm -rf backend/
```

### 2. Frontend unificado en `static/`
```bash
mkdir static/
cp -r public/* static/
cp -r src/css static/
cp -r src/js static/
```

### 3. Actualización de `app.py`
```python
# ANTES
app = Flask(__name__, static_folder='../public', static_url_path='')

# AHORA
app = Flask(__name__, static_folder='static', static_url_path='')
```

### 4. Simplificación de archivos de deploy

**Procfile:**
```bash
# ANTES
web: cd backend && gunicorn app:app --bind 0.0.0.0:$PORT

# AHORA
web: gunicorn app:app --bind 0.0.0.0:$PORT
```

**nixpacks.toml:**
```toml
[start]
# ANTES: cmd = "cd backend && gunicorn..."
# AHORA:
cmd = "gunicorn app:app --bind 0.0.0.0:$PORT"
```

**railway.json:**
```json
{
  "deploy": {
    "startCommand": "gunicorn app:app --bind 0.0.0.0:$PORT"
  }
}
```

### 5. Actualización de `.gitignore`
Agregado:
```
backend/
public/
src/
```

---

## 🚀 CÓMO USAR

### Desarrollo Local

```bash
# 1. Activar entorno virtual
source venv/bin/activate

# 2. Instalar dependencias
pip install -r requirements.txt

# 3. Ejecutar servidor
python app.py

# O con gunicorn (simula producción):
gunicorn app:app --bind 0.0.0.0:5001
```

### Deploy en Railway

```bash
# La configuración ya está lista en:
# - Procfile
# - railway.json
# - nixpacks.toml

# Solo hacer:
git add .
git commit -m "feat: restructuración completa del proyecto"
git push origin main
```

Railway detectará automáticamente y desplegará.

### Deploy en Render.com

1. Crear Web Service
2. Conectar repo de GitHub
3. Configurar:
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn app:app --bind 0.0.0.0:$PORT`
4. Agregar variables de entorno
5. Deploy

---

## 📊 COMPARACIÓN DE COMPLEJIDAD

| Aspecto | ANTES | AHORA |
|---------|-------|-------|
| Líneas en Procfile | 1 (con cd) | 1 (simple) |
| Carpetas frontend | 2 (public + src) | 1 (static) |
| Nivel de backend | backend/ | raíz |
| Archivos config | 3 (conflictivos) | 3 (unificados) |
| Imports relativos | Complejos | Simples |
| Deploy complexity | Alta | Baja |

---

## ✅ BENEFICIOS

1. **✅ Más simple** - Estructura estándar de Flask
2. **✅ Menos errores** - Paths directos, sin subdirectorios
3. **✅ Deploy fácil** - Compatible con Railway, Render, Heroku
4. **✅ Mantenible** - Cualquier dev Python entiende la estructura
5. **✅ Escalable** - Fácil agregar blueprints, modelos, etc.

---

## 🎯 PRÓXIMOS PASOS

1. ✅ Testear localmente con gunicorn
2. ✅ Commit y push a GitHub
3. ✅ Deploy en Railway
4. ✅ Verificar que funciona en producción
5. ✅ Deploy frontend en Vercel

---

## 📝 NOTAS TÉCNICAS

### Archivos deprecados (NO usar)
- ❌ `backend/` (eliminado)
- ❌ `public/` (movido a static/)
- ❌ `src/` (movido a static/)

### Archivos activos
- ✅ `app.py` - Backend principal
- ✅ `tpv_redsys.py` - Módulo TPV
- ✅ `static/` - Frontend completo
- ✅ `requirements.txt` - Dependencias
- ✅ Archivos de deploy (Procfile, railway.json, nixpacks.toml)

---

**Todo listo para deploy! 🚀**

