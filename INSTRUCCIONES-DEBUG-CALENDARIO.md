# 🔍 Instrucciones para Debuggear el Calendario

## 🎯 OBJETIVO

Encontrar por qué no puedes seleccionar 2 fechas en el calendario.

---

## 📋 PASOS (Síguelos EXACTAMENTE)

### 1. Recarga la Página (IMPORTANTE)

```
Cmd+Shift+R (Mac) o Ctrl+Shift+R (Windows)
```

Esto limpia el cache y carga la versión nueva con logging.

### 2. Abre la Consola del Navegador

```
Presiona F12
O
Click derecho → Inspeccionar → Pestaña "Console"
```

### 3. Haz Click en una Fecha del Calendario (IDA)

Deberías ver en la consola algo como:

```
╔═══════════════════════════════════════════════════
║ 📅 CLICK EN FECHA DETECTADO
╠═══════════════════════════════════════════════════
║ Fecha clickeada: Fri Dec 06 2025 00:00:00 GMT...
║ Departure actual: null
║ Return actual: null
║ ¿Seleccionando vuelta?: false
╚═══════════════════════════════════════════════════
➡️ CASO 1: Estableciendo fecha de IDA
✅ Fecha de IDA establecida: Fri Dec 06 2025...
✅ isSelectingReturn: true
🔄 Renderizando calendario...
✅ Render completado
```

### 4. Haz Click en OTRA Fecha del Calendario (VUELTA)

Deberías ver en la consola:

```
╔═══════════════════════════════════════════════════
║ 📅 CLICK EN FECHA DETECTADO
╠═══════════════════════════════════════════════════
║ Fecha clickeada: Fri Dec 13 2025 00:00:00 GMT...
║ Departure actual: Fri Dec 06 2025...
║ Return actual: null
║ ¿Seleccionando vuelta?: true  ← IMPORTANTE: debe ser TRUE
╚═══════════════════════════════════════════════════
➡️ CASO 2: Estableciendo fecha de VUELTA  ← DEBE DECIR CASO 2
✅ Fecha de VUELTA posterior a IDA
✅ AMBAS FECHAS SELECCIONADAS:
   - IDA: Fri Dec 06 2025...
   - VUELTA: Fri Dec 13 2025...
🔔 Llamando callback onDateSelect...
✅ Callback ejecutado
```

---

## 🐛 POSIBLES PROBLEMAS Y QUÉ REPORTAR

### Caso A: NO aparece "CASO 1" en el primer click

**Significa:** El click no está llegando a la función selectDate()

**Reporta:**
- "No aparece CASO 1"
- Copia TODO lo que aparece en consola

### Caso B: Aparece CASO 1, pero NO aparece CASO 2 en el segundo click

**Significa:** `isSelectingReturn` está en false o no detecta el segundo click

**Reporta:**
- "Aparece CASO 1 pero no CASO 2"
- Copia TODOS los logs, especialmente:
  - `¿Seleccionando vuelta?:` del segundo click
  - Si dice true o false

### Caso C: Aparece CASO 3 en el segundo click (en lugar de CASO 2)

**Significa:** `isSelectingReturn` se puso en false de alguna manera

**Reporta:**
- "Aparece CASO 3 en lugar de CASO 2"
- Copia los logs completos

### Caso D: No aparece NADA al hacer click

**Significa:** Los event listeners no están funcionando

**Reporta:**
- "No aparece nada al hacer click"
- ¿Ves el calendario? (Toma screenshot)
- ¿Los días tienen un efecto hover cuando pasas el mouse?

---

## ✅ SI FUNCIONA CORRECTAMENTE

Deberías ver:
1. Primer click → CASO 1 + "Fecha de IDA establecida"
2. Segundo click → CASO 2 + "AMBAS FECHAS SELECCIONADAS"
3. El formulario de detalles de vuelo aparece
4. El precio total se calcula y muestra

---

## 📋 TEMPLATE PARA REPORTAR

Copia esto y llena los espacios:

```
REPORTE DE DEBUG - CALENDARIO

1. ¿Recargaste con Cmd+Shift+R? [SÍ/NO]

2. ¿Abriste la consola (F12)? [SÍ/NO]

3. Al hacer PRIMER click en calendario:
   - ¿Qué apareció en consola? [Copiar aquí]
   
4. Al hacer SEGUNDO click en calendario:
   - ¿Qué apareció en consola? [Copiar aquí]

5. ¿Cuál de los casos A, B, C o D describe tu problema?
   [A/B/C/D]

6. ¿Otros errores en consola (en rojo)?
   [Copiar aquí si hay]
```

---

## 🚀 ALTERNATIVA: Déjame ver tu consola

Si prefieres, puedes hacer screenshot de:
1. La consola del navegador (F12) después de hacer los 2 clicks
2. La página completa mostrando el calendario

Y me los mandas.

---

**¡Con esta información podré arreglar el problema en 5 minutos!** 🚀

