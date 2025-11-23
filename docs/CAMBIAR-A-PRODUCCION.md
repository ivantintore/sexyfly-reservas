# 🚀 CAMBIAR TPV A MODO PRODUCCIÓN

**Versión**: 3.1.0  
**Estado actual**: TEST  
**Tiempo necesario**: 5 minutos

---

## ✅ CLAVE DE PRODUCCIÓN OBTENIDA

Ya tienes la clave SHA-256 de PRODUCCIÓN del panel Redsys:

```
Kmxl0wQuJmXiaukCGWTurOwhc+8Z9sAB
```

**YA ESTÁ CONFIGURADA** en `backend/tpv_redsys.py` ✅

---

## 🎯 PARA ACTIVAR MODO PRODUCCIÓN

### Opción A: Cambiar Código Directamente (2 minutos)

**1. Editar `src/js/config.js` línea ~169:**

```javascript
tpv: {
  enabled: true,
  provider: 'REDSYS_MAITSA',
  testMode: false,  // ← Cambiar a false
  // resto igual
}
```

**2. Editar `backend/app.py` línea ~18:**

```python
TEST_MODE = False  # ← Cambiar a False
```

**3. Reiniciar backend:**

```bash
# Detener backend (Ctrl+C)
# Volver a iniciar:
source venv/bin/activate
python backend/app.py
```

**Verás:** `🔴 MODO PRODUCCIÓN - Aceptando pagos reales`

**¡Listo!** Ahora acepta tarjetas reales y cobra dinero 💰

---

### Opción B: Usar Variables de Entorno (Recomendado - 5 minutos)

**1. Copiar plantilla:**

```bash
cp .env.example .env
```

**2. Editar `.env`:**

```bash
# Cambiar esta línea:
TPV_TEST_MODE=false  # ← false para producción
```

**3. Modificar `backend/app.py`** para leer de .env:

```python
# Al inicio del archivo
from dotenv import load_dotenv
load_dotenv()

# Cambiar línea 18:
TEST_MODE = os.getenv('TPV_TEST_MODE', 'true').lower() == 'true'
```

**4. Reiniciar backend**

**Ventaja:** Cambias entre TEST/PRODUCCIÓN solo editando .env ✅

---

## ⚠️ IMPORTANTE ANTES DE PASAR A PRODUCCIÓN

### 1. URLs de Callback Deben Ser Públicas

**Problema:** localhost NO es accesible desde Redsys

**Solución temporal (desarrollo):**

```bash
# Instalar ngrok
brew install ngrok
# O descargar de https://ngrok.com

# Ejecutar
ngrok http 5001

# Copiar URL pública (ej: https://abc123.ngrok.io)
```

**Luego actualizar callbacks:**

```javascript
// src/js/config.js
urlOK: 'https://abc123.ngrok.io/public/pago-ok.html',
urlKO: 'https://abc123.ngrok.io/public/pago-ko.html',
```

### 2. Probar Primero en TEST

```bash
# Con backend en TEST:
http://localhost:8000/tests/test-e2e-completo-con-pago.html

# Usar tarjeta: 4548810000000003
# Verificar que todo funciona
```

### 3. Luego Pasar a PRODUCCIÓN

Solo si el test funciona correctamente.

---

## 🧪 VERIFICACIÓN

### Modo TEST (Actual)

**Backend dice:**
```
⚠️ MODO TEST - Solo tarjetas de prueba
```

**Tarjetas aceptadas:**
- 4548810000000003 ✅
- Tarjetas reales ❌

### Modo PRODUCCIÓN (Después del cambio)

**Backend dice:**
```
🔴 MODO PRODUCCIÓN - Aceptando pagos reales
```

**Tarjetas aceptadas:**
- Todas las tarjetas reales ✅
- Tarjetas de prueba ❌

---

## 📊 RESUMEN

```
Clave PRODUCCIÓN: ✅ Obtenida y configurada
Código actualizado: ✅ Listo
Falta para REAL: Cambiar 1 flag (testMode: false)
Tiempo: 2 minutos
```

**CASI LISTO** - Solo falta cambiar el flag ✅

---

## 🎯 ¿QUÉ QUIERES HACER?

**A.** Pasar a PRODUCCIÓN AHORA (2 min)
**B.** Probar en TEST primero (5 min)
**C.** Configurar ngrok para URLs públicas primero (10 min)

**¿Cuál opción?** 😊

