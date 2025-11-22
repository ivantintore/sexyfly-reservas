# 🧪 Guía de Pruebas - SexyFly Reservas

## 🚀 Iniciar el Servidor de Pruebas

### Opción 1: Python con venv (Recomendado)
```bash
cd "/Users/ivantintore/CURSOR - AVIONES/sexyfly-reservas"

# Activar el entorno virtual
source venv/bin/activate

# Iniciar el servidor
python3 server.py
```

El servidor se abrirá automáticamente en: `http://localhost:8000/index.html`

**Nota:** Para desactivar el venv después: `deactivate`

### Opción 1b: Python sin venv
```bash
cd "/Users/ivantintore/CURSOR - AVIONES/sexyfly-reservas"
python3 server.py
```

### Opción 2: Python Simple HTTP Server
```bash
cd "/Users/ivantintore/CURSOR - AVIONES/sexyfly-reservas"
python3 -m http.server 8000
```

Luego abre: `http://localhost:8000/index.html`

### Opción 3: Node.js (si tienes http-server instalado)
```bash
cd "/Users/ivantintore/CURSOR - AVIONES/sexyfly-reservas"
npx http-server -p 8000
```

---

## ✅ Checklist de Pruebas

### 📅 Sistema Nuevo (Calendario Visual - SexyFly 2.0)

#### Calendario
- [ ] El calendario se muestra correctamente con 4 semanas
- [ ] Los días pasados están deshabilitados (grises)
- [ ] Los precios se muestran en cada día:
  - Verde: 500€ (anticipada +7 días)
  - Amarillo: 750€ (estándar 3-6 días)
  - Rojo: 1000€ (urgente <48h)
- [ ] La navegación entre semanas funciona (botones anterior/siguiente)
- [ ] El día de hoy está marcado con "Hoy"

#### Selección de Fechas
- [ ] Al hacer click en una fecha, se selecciona como "Ida" (azul)
- [ ] Aparece mensaje "Ahora selecciona fecha de vuelta"
- [ ] Al hacer click en segunda fecha, se selecciona como "Vuelta" (verde)
- [ ] Las fechas entre ida y vuelta se resaltan (rango)
- [ ] El resumen muestra ambas fechas con precios
- [ ] El total se calcula correctamente

#### Formulario
- [ ] Al seleccionar fechas, aparece la sección "Detalles del Vuelo"
- [ ] Los campos de hora de salida/regreso son obligatorios
- [ ] Los códigos OACI se validan (4 letras, mayúsculas)
- [ ] Si origen y destino son diferentes, aparece opción de pernocta
- [ ] Si origen y destino son iguales, no aparece pernocta
- [ ] Los campos de cliente son obligatorios
- [ ] El email se valida correctamente
- [ ] El teléfono acepta formato internacional

#### Envío
- [ ] Sin aceptar términos: muestra alerta
- [ ] Sin fechas seleccionadas: muestra alerta
- [ ] Sin códigos OACI válidos: muestra alerta
- [ ] Con todo completo: muestra loading y procesa
- [ ] El resumen se muestra correctamente antes de enviar

### 🔧 Sistema Antiguo (Múltiples Vuelos)

**Nota:** Este sistema está deshabilitado actualmente. Si quieres probarlo, necesitas añadir los elementos HTML correspondientes.

---

## 🐛 Errores Comunes y Soluciones

### El calendario no aparece
- Verifica que `calendar.js` y `calendar.css` estén cargados
- Abre la consola del navegador (F12) y busca errores
- Verifica que el contenedor `#flightCalendar` exista

### Los precios no se calculan
- Verifica que `pricing.js` esté cargado
- Revisa la consola para errores de JavaScript
- Verifica que las fechas seleccionadas sean futuras

### El formulario no se envía
- Verifica que todos los campos requeridos estén completos
- Revisa la consola para errores de validación
- Asegúrate de aceptar términos y condiciones

### El servidor no inicia
- Verifica que Python 3 esté instalado: `python3 --version`
- Verifica que el puerto 8000 no esté en uso
- Prueba con otro puerto: `python3 -m http.server 8080`

---

## 📊 Consola del Navegador

Abre la consola (F12 → Console) y deberías ver:

```
🚀 Inicializando SexyFlyApp...
✅ Clases cargadas correctamente
🔧 Inicializando componentes...
📅 Inicializando calendario...
✅ Calendario inicializado correctamente
✅ SexyFlyApp inicializado completamente
🚁 SexyFly 2.0 inicializado correctamente
```

Si ves errores, cópialos y revísalos.

---

## 🎯 Pruebas Específicas Recomendadas

1. **Prueba de Responsive:**
   - Abre en móvil (Chrome DevTools → Toggle device toolbar)
   - Verifica que el calendario se adapte correctamente
   - Verifica que los formularios sean usables

2. **Prueba de Precios:**
   - Selecciona una fecha dentro de 7 días → Debe ser 500€
   - Selecciona una fecha dentro de 3-6 días → Debe ser 750€
   - Selecciona una fecha dentro de 48h → Debe ser 1000€
   - Selecciona un fin de semana → Debe tener recargo +100€

3. **Prueba de Validación:**
   - Intenta enviar sin completar campos → Debe mostrar alertas
   - Introduce código OACI inválido → Debe validar
   - Introduce mismo origen y destino → Debe alertar

---

## 📝 Notas

- El sistema nuevo (SexyFly 2.0) es el activo por defecto
- El sistema antiguo está deshabilitado pero el código está presente
- Los datos del formulario se muestran en consola (no se envían realmente)
- El email se simula en consola

---

## 🆘 Ayuda

Si encuentras problemas:
1. Revisa la consola del navegador (F12)
2. Verifica que todos los archivos estén presentes
3. Verifica que el servidor esté corriendo
4. Prueba en modo incógnito para descartar cache

