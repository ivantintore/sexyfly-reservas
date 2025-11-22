# 🚨 PROBLEMA: FORMULARIO NO FUNCIONA

## ⚡ DIAGNÓSTICO RÁPIDO

El servidor ya está corriendo en **http://localhost:8000**

### PASO 1: Test Rápido (30 segundos)

```bash
# Abrir en tu navegador:
open http://localhost:8000/test-form-simple.html
```

Este test te dirá EXACTAMENTE qué está mal.

### PASO 2: Según el resultado

#### Si dice "✅ window.sexyFlyApp existe"
- El problema es la lógica del formulario
- Probar: http://localhost:8000/test-e2e.html

#### Si dice "❌ window.sexyFlyApp NO existe"
- El problema es la inicialización
- Abrir consola del navegador (F12)
- Ver errores en rojo
- Reportar el error

### PASO 3: Debug Manual

```bash
# Abrir la app principal
open http://localhost:8000/index.html

# Abrir consola (F12)
# Pegar este código:
```

```javascript
// En la consola del navegador:
console.log('SexyFlyApp exists?', typeof window.sexyFlyApp !== 'undefined');
console.log('Form exists?', !!document.getElementById('bookingForm'));
console.log('Submit button exists?', !!document.getElementById('submitBtn'));

// Si sexyFlyApp existe, probar manualmente:
if (window.sexyFlyApp) {
  // Simular selección de fechas
  const departure = new Date();
  departure.setDate(departure.getDate() + 15);
  const returnDate = new Date(departure);
  returnDate.setDate(returnDate.getDate() + 7);
  
  window.sexyFlyApp.calendar.setDates(departure, returnDate);
  window.sexyFlyApp.handleDateSelection({
    departure: departure,
    return: returnDate
  });
  
  console.log('Fechas seleccionadas:', window.sexyFlyApp.getSelectedDates());
  console.log('Precio:', window.sexyFlyApp.getTotalPrice());
}
```

---

## 🔧 HERRAMIENTAS DE DEBUG

| URL | Qué hace |
|-----|----------|
| http://localhost:8000/test-form-simple.html | Test rápido de 30 seg |
| http://localhost:8000/test-e2e.html | Tests End-to-End completos |
| http://localhost:8000/test.html | Tests unitarios (34 tests) |
| http://localhost:8000/index.html | App principal (LA QUE NO FUNCIONA) |

---

## 🐛 POSIBLES PROBLEMAS Y SOLUCIONES

### Problema 1: Error 404 en algún .js

**Síntoma:** Consola dice "Failed to load resource: config.js" o similar

**Solución:**
```bash
# Verificar que todos los archivos existen
ls -la *.js
# Deberías ver: app.js, calendar.js, config.js, pricing.js, test.js
```

### Problema 2: Error de inicialización

**Síntoma:** "window.sexyFlyApp is undefined"

**Solución:**
1. Revisar consola para ver el error EXACTO
2. Puede ser:
   - Error en app.js (sintaxis)
   - Falta alguna dependencia
   - Problema con el orden de carga

### Problema 3: Event listener no se adjunta

**Síntoma:** Botón no responde, pero app está cargada

**Solución:**
```javascript
// En consola, verificar:
const form = document.getElementById('bookingForm');
const btn = document.getElementById('submitBtn');

console.log('Form onsubmit:', form.onsubmit);
console.log('Button onclick:', btn.onclick);

// Probar manualmente:
btn.click();
```

---

## 📞 REPORTE DE ERROR

Si encuentras un error, reporta:

1. **URL** que estás probando
2. **Qué dice test-form-simple.html** (screenshot o copiar texto)
3. **Errores en consola** (F12, pestaña Console)
4. **Qué botón presionaste** y **qué pasó** (o no pasó)

---

## ⚡ FIX RÁPIDO (Si sabemos cuál es el problema)

Si ya sabes cuál es el error específico, puedo:
- Arreglarlo en el código
- Hacer commit
- Push a GitHub
- Verificar que funciona

---

**EMPIEZA AQUÍ:** http://localhost:8000/test-form-simple.html

