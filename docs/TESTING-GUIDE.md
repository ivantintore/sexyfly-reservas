# 🧪 Guía de Testing - SexyFly v3.0.0

Sistema de Unit Testing automatizado sin dependencias externas.

---

## 🚀 Inicio Rápido

### Opción 1: Script Automático (Recomendado)

```bash
./run-tests.sh
```

Esto:
1. ✅ Inicia servidor en puerto 8001
2. ✅ Abre automáticamente el navegador
3. ✅ Ejecuta todos los tests
4. ✅ Muestra resultados en tiempo real

### Opción 2: Manual

```bash
# 1. Iniciar servidor
python3 -m http.server 8001

# 2. Abrir en navegador
open http://localhost:8001/test.html
```

---

## 📊 ¿Qué Tests se Ejecutan?

### 1. **Configuración (SEXYFLY_CONFIG)** - 10 tests
- ✅ Config está definido
- ✅ Config está congelado (inmutable)
- ✅ Precios están configurados correctamente
- ✅ Validaciones están definidas
- ✅ i18n funciona

### 2. **Sistema de Precios** - 10 tests
- ✅ Cálculo de precios anticipados (500€)
- ✅ Cálculo de precios urgentes (1000€)
- ✅ Recargos de fin de semana
- ✅ Recargos de festivos
- ✅ Cache de precios
- ✅ Rango de precios

### 3. **Sistema de Calendario** - 3 tests
- ✅ Creación de calendario
- ✅ Formato de fechas
- ✅ Parsing de fechas

### 4. **Sistema de Validación** - 6 tests
- ✅ Validación ICAO (códigos de aeropuerto)
- ✅ Validación email
- ✅ Validación teléfono español

### 5. **Utilidades** - 3 tests
- ✅ Detección de fin de semana
- ✅ Detección de festivos
- ✅ Determinación de temporadas

### 6. **Integración** - 2 tests
- ✅ Pricing + Config sincronizados
- ✅ Calendar puede usar Pricing

**TOTAL: ~34 tests** ejecutándose automáticamente

---

## 📋 Interpretar Resultados

### ✅ Todos los Tests Pasan

```
============================================================
📊 RESUMEN DE TESTS
============================================================
Total:   34 tests
✅ Passed:  34 (100.0%)
❌ Failed:  0 (0.0%)
⏱️  Duration: 0.15s
============================================================

🎉 TODOS LOS TESTS PASARON! 🎉
```

**Significa:** Todo funciona correctamente, puedes hacer deploy.

### ❌ Hay Tests Fallidos

```
============================================================
📊 RESUMEN DE TESTS
============================================================
Total:   34 tests
✅ Passed:  32 (94.1%)
❌ Failed:  2 (5.9%)
⏱️  Duration: 0.18s
============================================================

⚠️  HAY TESTS FALLIDOS
```

**Significa:** Algo se rompió, revisar los errores antes de deployar.

---

## 🔄 Flujo de Trabajo Recomendado

### ANTES de hacer cambios

```bash
# 1. Ejecutar tests para asegurar que todo funciona
./run-tests.sh

# 2. Verificar que todos pasan (✅ 100%)
```

### DESPUÉS de hacer cambios

```bash
# 1. Guardar cambios
git add .

# 2. Ejecutar tests
./run-tests.sh

# 3. Si pasan ✅ → Hacer commit
git commit -m "feat: mi nuevo feature"

# 4. Si fallan ❌ → Arreglar y volver a probar
```

---

## 🎯 Casos de Uso

### Cambiar Precios

```javascript
// 1. Editar config.js
SEXYFLY_CONFIG.pricing.basePrice = 600;  // Cambio

// 2. Ejecutar tests
./run-tests.sh

// 3. Verificar que "Pricing debe tener basePrice" pasa
```

### Añadir Festivo Nuevo

```javascript
// 1. Editar config.js
holidays: [
  '01-01',
  '05-15',  // NUEVO
  // ...
]

// 2. Ejecutar tests
./run-tests.sh

// 3. Verificar tests de festivos
```

### Cambiar Validación

```javascript
// 1. Editar config.js
validation: {
  icao: {
    length: 3,  // Cambio de 4 a 3
  }
}

// 2. Ejecutar tests - FALLARÁN ❌
./run-tests.sh

// 3. Ver error específico
// 4. Arreglar o revertir cambio
```

---

## 🛠️ Añadir Nuevos Tests

### Estructura de un Test

```javascript
// En test.js, añade dentro de un describe:

runner.test('Debe hacer algo específico', () => {
  // 1. Preparar (Arrange)
  const pricing = new SexyFlyPricing();
  const date = new Date('2025-12-25');
  
  // 2. Ejecutar (Act)
  const result = pricing.calculatePrice(date);
  
  // 3. Verificar (Assert)
  assert.equal(result.price, 700, 'Precio debe ser 700€');
  assert.truthy(result.isHoliday, 'Debe ser festivo');
});
```

### Assertions Disponibles

```javascript
// Igualdad
assert.equal(actual, expected, 'mensaje');
assert.notEqual(actual, expected, 'mensaje');

// Booleanos
assert.truthy(value, 'debe ser verdadero');
assert.falsy(value, 'debe ser falso');

// Tipos
assert.isType(value, 'number', 'debe ser número');
assert.isInstanceOf(obj, Constructor, 'debe ser instancia');

// Arrays y objetos
assert.arrayContains(array, value, 'debe contener');
assert.objectHasProperty(obj, 'prop', 'debe tener propiedad');

// Errores
assert.throws(() => { throw new Error() }, 'debe lanzar error');
```

---

## 🐛 Debugging de Tests

### Ver logs en consola

Los tests ya muestran logs automáticamente en la página. Para debugging adicional:

```javascript
runner.test('Mi test con debug', () => {
  const pricing = new SexyFlyPricing();
  
  // Añadir console.log
  console.log('Debug:', pricing.config);
  
  const result = pricing.calculatePrice(new Date());
  console.log('Result:', result);
  
  assert.truthy(result.price > 0);
});
```

### Ejecutar un solo test

Comenta los demás temporalmente:

```javascript
// runner.test('Test 1', () => { ... });
// runner.test('Test 2', () => { ... });
runner.test('Test 3 - El que quiero probar', () => { ... });
// runner.test('Test 4', () => { ... });
```

---

## 📈 Estadísticas en la UI

La interfaz web muestra:

- **Total Tests**: Cantidad total de tests
- **Passed**: Tests que pasaron ✅
- **Failed**: Tests que fallaron ❌
- **Duration**: Tiempo de ejecución

Y un badge de estado:
- 🟢 `ALL PASSED ✓` - Todo bien
- 🔴 `FAILED ✗` - Hay errores

---

## ⚡ Integración con Git

### Pre-commit Hook (Opcional)

Ejecutar tests automáticamente antes de cada commit:

```bash
# Crear .git/hooks/pre-commit
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
echo "🧪 Ejecutando tests antes de commit..."

# Aquí podrías ejecutar tests en modo headless
# Por ahora, solo recordatorio
echo "⚠️  Recuerda ejecutar ./run-tests.sh antes de commitear"
EOF

chmod +x .git/hooks/pre-commit
```

---

## 🚨 Solución de Problemas

### Tests no cargan

**Problema:** Página en blanco o error
**Solución:** 
1. Verificar que config.js se carga primero
2. Abrir consola del navegador (F12)
3. Ver errores específicos

### Tests fallan después de cambio

**Problema:** Tests pasaban antes, ahora fallan
**Solución:**
1. Ver qué test específico falla
2. Revisar el mensaje de error
3. Verificar que el cambio no rompió algo
4. Ajustar test o código según corresponda

### Servidor no inicia

**Problema:** `./run-tests.sh` no funciona
**Solución:**
```bash
# Verificar permisos
chmod +x run-tests.sh

# Verificar Python
python3 --version

# Ejecutar manualmente
python3 -m http.server 8001
```

---

## 📚 Recursos

- **Archivo de tests**: `test.js` (Framework + Tests)
- **UI de tests**: `test.html` (Interfaz web)
- **Script de ejecución**: `run-tests.sh` (Launcher)
- **Esta guía**: `TESTING-GUIDE.md`

---

## ✅ Checklist de Testing

Antes de cada deploy:

- [ ] Ejecutar `./run-tests.sh`
- [ ] Verificar que todos los tests pasan (100%)
- [ ] Revisar consola del navegador (F12) para warnings
- [ ] Probar manualmente funcionalidad principal
- [ ] Hacer commit solo si todo está ✅

---

## 🎓 Best Practices

1. **Ejecuta tests SIEMPRE antes de commit**
2. **No ignores tests fallidos** - arregla o revierte
3. **Añade tests para nuevas features**
4. **Mantén tests simples y focalizados**
5. **Usa nombres descriptivos** para tests
6. **No modifiques tests solo para que pasen** - arregla el código

---

## 🎯 Ejemplo Completo

```bash
# Escenario: Quieres cambiar el recargo de fin de semana

# 1. Ejecutar tests (estado actual)
./run-tests.sh
# ✅ Todos pasan - 34/34

# 2. Hacer cambio en config.js
# SEXYFLY_CONFIG.pricing.surcharges.weekend = 200;

# 3. Ejecutar tests de nuevo
./run-tests.sh
# ✅ Todos pasan - 34/34 (el test verifica que existe, no el valor específico)

# 4. Probar manualmente en index.html
python3 server.py
# Abrir localhost:8000
# Seleccionar un sábado
# Verificar que precio tiene +200€

# 5. Si todo OK, commit
git add config.js
git commit -m "feat: aumentar recargo fin de semana a 200€"
git push

# ✅ Listo!
```

---

**🎉 ¡Sistema de testing listo para usar!**

Ejecuta `./run-tests.sh` cada vez que hagas cambios para asegurar que nada se rompa.

