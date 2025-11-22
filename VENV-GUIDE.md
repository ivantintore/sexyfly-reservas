# 📦 Guía de Entorno Virtual (venv)

**Versión**: 3.0.0  
**Proyecto**: SexyFly Reservas

---

## 🎯 ¿Necesitas venv en Este Proyecto?

### ❌ ACTUALMENTE: **NO**

Este proyecto usa **SOLO** librerías estándar de Python:
- `http.server` - Para servidor de desarrollo
- `socketserver` - Para TCP
- `webbrowser` - Para abrir navegador
- `pathlib` - Para rutas

**No hay dependencias externas** → **No necesitas venv**

### ✅ CUÁNDO SÍ LO NECESITARÁS

Cuando añadas backend con:
- Flask/Django (framework web)
- SQLAlchemy (base de datos)
- Requests (HTTP client)
- Pillow (imágenes)
- etc.

---

## 🔧 Cómo Crear venv (Si lo Necesitas)

### Opción 1: Script Automático (Recomendado)

```bash
./setup-venv.sh
```

Esto:
- Verifica Python instalado
- Crea venv si no existe
- Actualiza pip
- Instala requirements.txt
- Te da instrucciones

### Opción 2: Manual

```bash
# 1. Crear venv
python3 -m venv venv

# 2. Activar
source venv/bin/activate  # Mac/Linux
# O
venv\Scripts\activate  # Windows

# 3. Actualizar pip
pip install --upgrade pip

# 4. Instalar dependencias (si existen)
pip install -r requirements.txt

# 5. Desactivar (cuando termines)
deactivate
```

---

## 📅 ¿Cada Cuánto Crear/Actualizar venv?

### NO Necesitas Recrearlo Diariamente

Un venv es **persistente**. Solo necesitas:

| Acción | Cuándo | Comando |
|--------|--------|---------|
| **Crear** | 1 vez (al inicio) | `./setup-venv.sh` |
| **Activar** | Cada vez que abres terminal | `source venv/bin/activate` |
| **Actualizar** | Cuando añades dependencias | `pip install -r requirements.txt` |
| **Recrear** | Problemas o corrupción | `rm -rf venv && ./setup-venv.sh` |

### Recomendación:

```
CREAR venv: 1 sola vez (o cuando cambies de máquina)
ACTIVAR: Cada sesión de desarrollo
ACTUALIZAR: Solo cuando requirements.txt cambie
RECREAR: Cada 3-6 meses (limpieza) o si hay problemas
```

---

## 🚀 Flujo de Trabajo Recomendado

### Para Este Proyecto (SIN dependencias)

```bash
# Cada día:
./start.sh  # Ya está, no necesita más
```

### Para Proyecto con Dependencias (Futuro)

```bash
# Primera vez:
./setup-venv.sh

# Cada día:
source venv/bin/activate  # Activar venv
./start.sh                # Iniciar servidor

# Al terminar:
deactivate                # Desactivar venv
```

---

## 🤖 Automatización del venv

### Script de Inicio Inteligente

He mejorado `start.sh` para que:
1. Detecte si existe venv
2. Lo active automáticamente si existe
3. Funcione sin venv si no existe

**Ya está hecho** ✅ (ver `start.sh` línea 7-13)

### Auto-Creación Diaria (NO RECOMENDADO)

❌ **NO hagas esto** - Es innecesario y lento

```bash
# MAL: Recrear venv cada día
rm -rf venv && python3 -m venv venv  # LENTO (30-60 segundos)
```

✅ **HAZ esto** - Crear una vez, activar siempre

```bash
# BIEN: Activar venv existente
source venv/bin/activate  # RÁPIDO (<1 segundo)
```

---

## 📋 Cuándo SÍ Recrear venv

### Caso 1: Añades nuevas dependencias

```bash
# 1. Editar requirements.txt
echo "flask==2.3.0" >> requirements.txt

# 2. Activar venv
source venv/bin/activate

# 3. Instalar nuevas deps
pip install -r requirements.txt

# NO necesitas recrear venv ✅
```

### Caso 2: Actualizar Python

```bash
# Si actualizas de Python 3.9 a 3.11
rm -rf venv
./setup-venv.sh
```

### Caso 3: Problemas/Corrupción

```bash
# Si venv da errores raros
rm -rf venv
./setup-venv.sh
```

### Caso 4: Limpieza Periódica

```bash
# Cada 3-6 meses (opcional)
rm -rf venv
./setup-venv.sh
```

---

## 🎯 Para la Auditoría

### Lo Que Tienes Ahora (CORRECTO)

```
✅ venv/ en .gitignore (no se sube a GitHub)
✅ requirements.txt (documentado, aunque vacío)
✅ setup-venv.sh (script de creación)
✅ start.sh (detecta y activa venv automáticamente)
```

### Lo Que Puedes Decir

**P: "¿Usan entorno virtual?"**

**R:** "Sí, tenemos venv configurado y gitignoreado. Actualmente el proyecto solo usa librerías estándar de Python (http.server), por lo que requirements.txt está vacío. Cuando añadamos backend con Flask/Django, el venv ya está preparado. Tenemos script de setup automatizado (`./setup-venv.sh`)."

---

## 💡 Recomendación FINAL para Ti

### Para Desarrollo Diario (AHORA)

```bash
# Simplemente:
./start.sh

# Eso es todo. No necesitas venv.
```

### Para Backend Futuro (v3.1.0+)

```bash
# 1. Primera vez (crear venv)
./setup-venv.sh

# 2. Añadir dependencias a requirements.txt
echo "flask==2.3.0" >> requirements.txt
echo "sqlalchemy==2.0.0" >> requirements.txt

# 3. Instalar
source venv/bin/activate
pip install -r requirements.txt

# 4. Cada día después
source venv/bin/activate
./start.sh
```

---

## 🔄 Script de Mantenimiento Automatizado

Si quieres un script que verifique y actualice todo:

```bash
# Crear script de mantenimiento semanal
./maintain.sh  # Verifica todo, actualiza si es necesario
```

¿Quieres que cree ese script también?

---

## ✅ Resumen

| Pregunta | Respuesta |
|----------|-----------|
| ¿Se crea siempre al principio? | No, solo la primera vez |
| ¿Cada cuánto recrearlo? | Cada 3-6 meses o si hay problemas |
| ¿Activarlo cada día? | Sí, si usas dependencias |
| ¿En este proyecto? | NO necesario (todo estándar) |
| ¿Automatizar creación? | No recomendado (solo activación) |

---

**En resumen:** 
- ✅ El venv ya está configurado correctamente
- ✅ NO lo necesitas recrear cada día
- ✅ Solo actívalo si añades dependencias
- ✅ `./start.sh` ya lo maneja automáticamente

**¿Te parece bien así o quieres que cree el script de mantenimiento automático?** 🚀

