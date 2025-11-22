# 📧 Sistema de Notificaciones por Email

**Versión**: 3.0.0  
**Email destino**: ivan@maitsa.com  
**Servicio**: FormSubmit.co (gratuito, sin registro)

---

## ✅ IMPLEMENTADO

El sistema ahora envía emails automáticamente en 2 casos:

### 1. Después de Ejecutar Tests ✅

Cuando ejecutas `./scripts/run-tests.sh`, recibirás un email:

```
📧 Para: ivan@maitsa.com
📋 Asunto: SexyFly Tests ✅ OK - 34/34
```

**Contenido del email:**
```
🧪 RESULTADOS DE TESTS - SexyFly v3.0.0
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ESTADO: ✅ OK

📊 RESUMEN:
   • Total Tests: 34
   • ✅ Pasados: 34
   • ❌ Fallados: 0
   • ⏱️ Duración: 0.15s
   • 📅 Fecha: 22/11/2025, 23:30:15

🎉 TODOS LOS TESTS PASARON CORRECTAMENTE 🎉
```

**Si hay tests fallidos:**
```
📧 Asunto: SexyFly Tests ❌ KO - 32/34

⚠️ HAY 2 TEST(S) FALLANDO - REQUIERE ATENCIÓN
```

### 2. Cuando se Completa una Reserva ✅

Cada reserva envía un email con todos los detalles:

```
📧 Para: ivan@maitsa.com
📋 Asunto: Nueva Reserva SexyFly - Ivan Tintore
```

**Contenido:**
```
🚁 NUEVA RESERVA - SexyFly
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 CLIENTE:
   • Nombre: Ivan Tintore
   • Email: test@example.com
   • Teléfono: +34656431447

✈️ VUELO:
   • Ruta: LELL → LEBL
   • 🛫 Salida: 27/11/2025 a las 10:00
   • 🛬 Regreso: 4/12/2025 a las 18:00
   • 🏨 Pernocta: SÍ

💰 PRECIO:
   • Ida: 630€
   • Vuelta: 450€
   • TOTAL: 1080€

📝 INFORMACIÓN ADICIONAL:
UNIT TESTING TEST PARA CONFIRMAR...
```

---

## 🔧 CONFIGURACIÓN

Todo se configura en `src/js/config.js`:

```javascript
integrations: {
  email: {
    provider: 'formsubmit',
    notificationEmail: 'ivan@maitsa.com',  // ← TU EMAIL
    testNotifications: true,    // ← Emails de tests
    bookingNotifications: true  // ← Emails de reservas
  }
}
```

### Cambiar Email

```javascript
// Editar src/js/config.js línea ~200
notificationEmail: 'otro@email.com'
```

### Desactivar Notificaciones

```javascript
testNotifications: false,      // No enviar emails de tests
bookingNotifications: false    // No enviar emails de reservas
```

---

## 🚀 CÓMO FUNCIONA

### FormSubmit.co

Es un servicio **GRATUITO** que:
- ✅ No requiere registro
- ✅ No requiere API key
- ✅ Sin límite de emails
- ✅ Funciona solo con fetch()

**Limitaciones:**
- ⚠️ Primer email requiere confirmación (solo la primera vez)
- ⚠️ Puede ir a spam (revisar carpeta spam)

### Primera Vez - IMPORTANTE ⚠️

La **primera vez** que envíes un email a `ivan@maitsa.com`:

1. FormSubmit enviará un email de confirmación
2. Abre ese email
3. Click en el link de confirmación
4. A partir de ahí, todos los emails llegarán automáticamente

**Solo necesitas hacerlo 1 vez** ✅

---

## 🧪 PROBAR QUE FUNCIONA

### Método 1: Ejecutar Tests

```bash
./scripts/run-tests.sh
```

**Esperar 1-2 minutos** y revisar email en `ivan@maitsa.com`

### Método 2: Hacer una Reserva

```bash
# 1. Iniciar app
./scripts/start.sh

# 2. Abrir
http://localhost:8000/public/index.html

# 3. Completar reserva
# Seleccionar fechas → Llenar formulario → Enviar

# 4. Revisar email
```

---

## 🐛 TROUBLESHOOTING

### No recibo emails

**Revisar:**
1. ✅ Carpeta de spam
2. ✅ Email de confirmación de FormSubmit (primera vez)
3. ✅ Consola del navegador (F12) para errores
4. ✅ Config: `testNotifications: true`

### Email de confirmación

Si es la **primera vez** con `ivan@maitsa.com`:

```
1. Ejecuta test: ./scripts/run-tests.sh
2. FormSubmit envía email a ivan@maitsa.com
3. Abre ese email
4. Click en "Confirm Email"
5. A partir de ahí funciona automáticamente
```

### Cambiar servicio de email

Si prefieres otro servicio (EmailJS, SendGrid, etc.):

```javascript
// En config.js
email: {
  provider: 'emailjs',  // o 'sendgrid', 'custom'
  apiKey: 'tu-api-key',
  // ...
}
```

Luego modificar `src/js/email-notifications.js`

---

## 📊 ARCHIVOS MODIFICADOS

| Archivo | Cambio |
|---------|--------|
| `src/js/config.js` | Email ivan@maitsa.com + flags |
| `src/js/email-notifications.js` | ⭐ NUEVO - Sistema de emails |
| `tests/test.js` | Integración de notificaciones |
| `tests/test.html` | Cargar email-notifications.js |
| `public/index.html` | Cargar email-notifications.js |
| `src/js/app.js` | Enviar email al completar reserva |

---

## ✅ RESULTADO

```
ANTES: Sin emails (todo simulado)
AHORA: ✅ Emails reales con FormSubmit.co

TESTS: Email ✅ OK o ❌ KO
RESERVAS: Email con todos los detalles
DESTINO: ivan@maitsa.com
COSTO: GRATIS (ilimitado)
```

---

## 🎯 PRÓXIMOS PASOS

### 1. Confirmar Email (Primera Vez)

```bash
# Ejecutar tests
./scripts/run-tests.sh

# Revisar ivan@maitsa.com
# Buscar email de FormSubmit
# Click en "Confirm Email"
# ✅ Listo
```

### 2. Probar Sistema

```bash
# Tests
./scripts/run-tests.sh
# Esperar email con resultado ✅ OK

# Reserva
# Completar una reserva en la app
# Esperar email con detalles
```

---

## 📧 EJEMPLO DE EMAIL QUE RECIBIRÁS

### Si Tests Pasan (✅ OK)

```
De: FormSubmit <noreply@formsubmit.co>
Para: ivan@maitsa.com
Asunto: SexyFly Tests ✅ OK - 34/34

🧪 RESULTADOS DE TESTS - SexyFly v3.0.0

ESTADO: ✅ OK

📊 RESUMEN:
   • Total Tests: 34
   • ✅ Pasados: 34
   • ❌ Fallados: 0
   • ⏱️ Duración: 0.15s

🎉 TODOS LOS TESTS PASARON CORRECTAMENTE 🎉
```

### Si Tests Fallan (❌ KO)

```
De: FormSubmit <noreply@formsubmit.co>
Para: ivan@maitsa.com
Asunto: SexyFly Tests ❌ KO - 32/34

🧪 RESULTADOS DE TESTS - SexyFly v3.0.0

ESTADO: ❌ KO

📊 RESUMEN:
   • Total Tests: 34
   • ✅ Pasados: 32
   • ❌ Fallados: 2
   • ⏱️ Duración: 0.18s

⚠️ HAY 2 TEST(S) FALLANDO - REQUIERE ATENCIÓN
```

---

## 🎊 VENTAJAS

✅ **Notificaciones automáticas** - Sabes inmediatamente si algo falla  
✅ **Sin configuración** - FormSubmit no requiere API keys  
✅ **Gratis e ilimitado** - Sin costos ni límites  
✅ **Profesional** - Emails bien formateados  
✅ **Confiable** - Servicio establecido  

---

**🎉 ¡Sistema de notificaciones por email implementado! 🎉**

**Email destino:** ivan@maitsa.com ✅

