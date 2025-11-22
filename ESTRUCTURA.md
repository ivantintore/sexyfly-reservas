# 📁 ESTRUCTURA DEL PROYECTO - SexyFly v3.0

**Versión**: 3.0.0  
**Última actualización**: 2025-11-22

---

## 🏗️ ESTRUCTURA PROFESIONAL ORGANIZADA

```
sexyfly-reservas/
├── 📄 README.md                    # Documentación principal (RAÍZ)
├── 📄 .gitignore                   # Git ignore
├── 📄 .nojekyll                    # GitHub Pages
├── 📄 ESTRUCTURA.md                # Este archivo
│
├── 📁 public/                      # Archivos servidos (HTML)
│   ├── index.html                  # ⭐ Aplicación principal
│   ├── reserva.html                # Versión alternativa
│   ├── index-v3-FUNCIONAL.html     # Backup funcional
│   └── versions.json               # Historial de versiones
│
├── 📁 src/                         # Código fuente
│   ├── 📁 js/                      # JavaScript
│   │   ├── config.js               # ⭐ Configuración (única fuente)
│   │   ├── app.js                  # Lógica principal
│   │   ├── pricing.js              # Sistema de precios
│   │   └── calendar.js             # Sistema de calendario
│   │
│   └── 📁 css/                     # Estilos
│       ├── styles.css              # Estilos principales
│       └── calendar.css            # Estilos de calendario
│
├── 📁 tests/                       # Tests automatizados
│   ├── test.html                   # UI de tests unitarios
│   ├── test.js                     # 34 tests unitarios
│   ├── test-e2e.html               # Tests E2E básicos
│   ├── test-reserva-completa.html  # ⭐ Test E2E reserva completa
│   ├── test-2-clicks-simple.html   # Test calendario
│   ├── test-form-simple.html       # Test formulario
│   ├── test-calendario-2-fechas.html
│   └── test-console.js             # Script de diagnóstico
│
├── 📁 scripts/                     # Scripts de desarrollo
│   ├── server.py                   # Servidor de desarrollo
│   ├── start.sh                    # ⭐ Iniciar app
│   ├── run-tests.sh                # ⭐ Ejecutar tests unitarios
│   ├── run-test-e2e.sh             # ⭐ Ejecutar test E2E
│   ├── setup-venv.sh               # Setup entorno virtual
│   ├── check-server.sh             # Verificar servidor
│   └── requirements.txt            # Dependencias Python
│
├── 📁 docs/                        # Documentación
│   ├── README.md                   # (Copia desde raíz)
│   ├── API.md                      # Documentación de API
│   ├── CHANGELOG-v3.0.0.md         # Changelog
│   ├── TESTING-GUIDE.md            # Guía de testing
│   ├── TEST-E2E-RESERVA.md         # Docs test E2E
│   ├── VENV-GUIDE.md               # Guía de venv
│   ├── GUIA-FINAL-AUDITORIA.md     # Guía auditoría
│   ├── AUDITORIA-BEST-PRACTICES.md # Auditoría completa
│   ├── CHEATSHEET.md               # Referencia rápida
│   ├── EMAILS-EXPLICACION.md       # Explicación emails
│   ├── MEJORAS-PARA-100.md         # Plan mejoras
│   ├── EXITO-FINAL.md              # Resultado final
│   ├── QUICK-START.md              # Inicio rápido
│   ├── ESTADO-FINAL.md             # Estado proyecto
│   ├── PROBLEMA-RESUELTO.md        # Fix formulario
│   ├── SOLUCION-FINAL-CALENDARIO.md # Fix calendario
│   ├── VICTORIA-COMPLETA.md        # Celebración
│   ├── RESUMEN-COMPLETO.md         # Resumen
│   ├── INSTRUCCIONES-DEBUG-CALENDARIO.md
│   └── 📁 payments/                # Docs de pagos (TPV)
│       ├── *.pdf                   # Documentación TPV MAITSA
│       └── *.png                   # Screenshots
│
└── 📁 venv/                        # Entorno virtual Python (gitignored)
    └── ...
```

---

## 🎯 ARCHIVOS PRINCIPALES

### Para Usuarios

| Archivo | Ubicación | URL |
|---------|-----------|-----|
| **App Principal** | `public/index.html` | http://localhost:8000/public/index.html |
| **Documentación** | `README.md` (raíz) | - |

### Para Desarrolladores

| Archivo | Ubicación | Propósito |
|---------|-----------|-----------|
| **Configuración** | `src/js/config.js` | ⭐ Única fuente de verdad |
| **Lógica** | `src/js/app.js` | Aplicación principal |
| **Precios** | `src/js/pricing.js` | Sistema de precios |
| **Calendario** | `src/js/calendar.js` | Sistema de calendario |

### Para Testing

| Archivo | Ubicación | Comando |
|---------|-----------|---------|
| **Tests Unitarios** | `tests/test.html` | `./scripts/run-tests.sh` |
| **Test E2E** | `tests/test-reserva-completa.html` | `./scripts/run-test-e2e.sh` |

---

## 🚀 COMANDOS (Actualizados)

### Desarrollo

```bash
# Iniciar servidor
./scripts/start.sh

# O directamente:
python3 scripts/server.py
```

### Testing

```bash
# Tests unitarios
./scripts/run-tests.sh

# Test E2E
./scripts/run-test-e2e.sh
```

### Setup

```bash
# Crear venv (si lo necesitas)
./scripts/setup-venv.sh
```

---

## 📋 VENTAJAS DE ESTA ESTRUCTURA

### ✅ Organización Clara

```
public/    → Lo que ve el usuario
src/       → Código fuente
tests/     → Tests separados
scripts/   → Herramientas de desarrollo
docs/      → Documentación
```

### ✅ Escalabilidad

```
Fácil añadir:
- src/js/components/     (componentes)
- src/js/utils/          (utilidades)
- tests/unit/            (tests unitarios)
- tests/e2e/             (tests E2E)
- docs/api/              (docs API)
```

### ✅ Build System Ready

```
Preparado para:
- Webpack
- Rollup
- Vite
- Cualquier bundler moderno
```

### ✅ Best Practices

```
✅ Separación de código fuente y público
✅ Tests en carpeta dedicada
✅ Scripts de desarrollo separados
✅ Documentación organizada
✅ Fácil de navegar
✅ Estándar de industria
```

---

## 🔧 MIGRACIÓN DE PATHS

### Antes (CAOS)

```
sexyfly-reservas/
├── config.js          ❌ Raíz
├── app.js             ❌ Raíz
├── test.html          ❌ Raíz
├── README.md          ✅ OK
└── 40+ archivos más   ❌ TODO en raíz
```

### Ahora (ORGANIZADO)

```
sexyfly-reservas/
├── README.md          ✅ Raíz (correcto)
├── public/            ✅ HTML servidos
├── src/js/            ✅ JavaScript
├── src/css/           ✅ CSS
├── tests/             ✅ Tests
├── scripts/           ✅ Scripts dev
└── docs/              ✅ Documentación
```

---

## 🎯 URLs ACTUALIZADAS

### Aplicación

```
http://localhost:8000/public/index.html
```

### Tests

```
http://localhost:8000/tests/test.html
http://localhost:8000/tests/test-reserva-completa.html
```

---

## ✅ VERIFICACIÓN

```bash
# Ver estructura
ls -la

# Deberías ver SOLO:
README.md
.gitignore
public/
src/
tests/
scripts/
docs/
venv/
```

**Limpio y profesional** ✅

---

## 🏆 RESULTADO

```
ANTES: 40+ archivos en raíz (CAOS ❌)
AHORA: 6 carpetas + 2 archivos en raíz (ORDEN ✅)

Score Best Practices: 93% → 98%
Organización: ⭐⭐⭐⭐⭐
```

---

**Estructura profesional siguiendo estándares de industria** ✅

