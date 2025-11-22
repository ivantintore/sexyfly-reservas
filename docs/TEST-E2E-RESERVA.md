# 🧪 Test E2E - Reserva Completa Automatizada

**Versión**: 3.0.0  
**Propósito**: Verificar flujo completo de reserva de inicio a fin

---

## 🎯 ¿Qué Hace Este Test?

Simula un usuario real completando una reserva:

1. ✅ Selecciona fechas (automático)
2. ✅ Rellena formulario (datos predefinidos)
3. ✅ Envía reserva
4. ✅ Verifica que todo funciona

---

## 🚀 Ejecución Rápida

### Opción 1: Script Automático (Recomendado)

```bash
./run-test-e2e.sh
```

Esto:
- Inicia servidor en puerto 8002
- Abre navegador automáticamente
- Ejecuta test en 4 segundos
- Muestra resultados en tiempo real

### Opción 2: Manual

```bash
# 1. Iniciar servidor
python3 -m http.server 8002

# 2. Abrir en navegador
open http://localhost:8002/test-reserva-completa.html

# 3. El test se auto-ejecuta en 4 segundos
```

---

## 📋 Datos de Test Utilizados

### Fechas
- **IDA**: Today + 5 días
- **VUELTA**: IDA + random(1-5) días

### Ruta
- **Origen**: LELL (Lleida-Alguaire)
- **Destino**: LEBL (Barcelona-El Prat)

### Horarios
- **Salida**: 10:00
- **Regreso**: 18:00

### Cliente
- **Nombre**: Ivan Tintore TEST
- **Email**: ivantintore@gmail.com
- **Teléfono**: +34656431447

### Info Adicional
```
ESTO ES UN UNIT TESTING TEST PARA CONFIRMAR QUE FUNCIONA EL SISTEMA
```

---

## 📊 Pasos del Test (10 total)

| # | Paso | Verifica |
|---|------|----------|
| 1 | Verificar SexyFlyApp | App cargada correctamente |
| 2 | Calcular fechas | Fechas válidas generadas |
| 3 | Seleccionar en calendario | Calendario funcional |
| 4 | Rellenar horarios | Campos aceptan datos |
| 5 | Códigos ICAO | Validación ICAO funciona |
| 6 | Datos del cliente | Formulario funcional |
| 7 | Info adicional | Textarea funcional |
| 8 | Verificar precio | Pricing calcula correctamente |
| 9 | Aceptar términos | Checkbox funcional |
| 10 | Enviar formulario | Submit procesa reserva |

---

## ✅ Resultado Esperado

```
═══════════════════════════════════════════════
🎉 TEST COMPLETADO EXITOSAMENTE
═══════════════════════════════════════════════

📊 RESUMEN DE LA RESERVA:
   Ruta: LELL → LEBL
   Fecha IDA: 27/11/2025 (Today+5)
   Fecha VUELTA: 30/11/2025 (+3 días)
   Precio Total: 1080€
   Cliente: ivantintore@gmail.com

✅ Formulario enviado correctamente
✅ Todos los pasos completados
✅ Sistema 100% funcional
```

---

## 🎬 Visualización del Test

El test muestra un **panel lateral** con:
- **Estado**: En progreso / Éxito / Fallido
- **Progreso**: 5/10 pasos
- **Tiempo**: Duración en segundos
- **Log**: Detalle de cada paso

Todo en tiempo real mientras se ejecuta.

---

## 🐛 Si el Test Falla

### Revisar Consola
- Abre DevTools (F12)
- Pestaña "Console"
- Busca errores en rojo

### Errores Comunes

**"SexyFlyApp no está disponible"**
- Problema: App no se inicializó
- Solución: Verificar que todos los .js se cargan

**"Fechas no se seleccionaron"**
- Problema: Calendario no funcionó
- Solución: Revisar calendar.js

**"Precio no calculado"**
- Problema: Pricing no funcionó
- Solución: Revisar pricing.js y callbacks

---

## 🔄 Flujo de Trabajo

### Antes de Cada Deploy

```bash
# 1. Ejecutar tests unitarios
./run-tests.sh

# 2. Ejecutar test E2E
./run-test-e2e.sh

# 3. Si ambos pasan ✅
git push origin main
```

### Para la Auditoría

```bash
# Mostrar test E2E en vivo
./run-test-e2e.sh

# Dejar que se ejecute completo
# Mostrar el resultado exitoso
```

---

## 📈 Integración con CI/CD (Futuro)

Este test se puede integrar con:
- GitHub Actions
- Travis CI
- Jenkins

Ejemplo para GitHub Actions:

```yaml
name: E2E Tests
on: [push]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run E2E Tests
        run: |
          python3 -m http.server 8002 &
          # Ejecutar con headless browser
```

---

## 🎯 Casos de Uso

### 1. Verificación Rápida
```bash
./run-test-e2e.sh
# Ver que todo funciona en <10 segundos
```

### 2. Antes de Auditoría
```bash
./run-test-e2e.sh
# Demostrar que el sistema funciona end-to-end
```

### 3. Después de Cambios
```bash
# Modificas código
./run-test-e2e.sh
# Verificas que no rompiste nada
```

### 4. Demo para Clientes
```bash
./run-test-e2e.sh
# Mostrar funcionalidad completa automatizada
```

---

## 🎓 Best Practices

1. **Ejecuta SIEMPRE** antes de deploy
2. **No ignores** tests fallidos
3. **Usa datos de test** claramente identificables
4. **Documenta** cualquier cambio en los datos de test
5. **Mantén actualizado** si cambias el flujo de la app

---

## 📞 Soporte

**Documentación**: README.md, API.md  
**Tests Unitarios**: ./run-tests.sh  
**Test E2E**: ./run-test-e2e.sh  
**Email**: ivan@tintore.es

---

## ✅ Checklist de Verificación

Antes de la auditoría, ejecuta:

- [ ] `./run-tests.sh` → 34/34 tests pasando
- [ ] `./run-test-e2e.sh` → Test E2E completo exitoso
- [ ] Revisar consola (F12) → Sin errores
- [ ] Probar manualmente → Hacer 1 reserva
- [ ] Verificar GitHub → Todos los commits pusheados

---

**🎉 Con este test puedes demostrar que el sistema funciona 100% ✅**

