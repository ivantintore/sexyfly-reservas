# 📧 ACTIVAR EMAILS - Paso a Paso

**Email destino**: ivan@maitsa.com  
**Estado**: ⚠️ Requiere activación (primera vez)

---

## 🚨 PROBLEMA: No Recibes Emails

**Causa**: FormSubmit.co requiere **confirmar el email la primera vez**

---

## ✅ SOLUCIÓN (5 minutos)

### PASO 1: Enviar Email de Prueba

Abre en tu navegador:

```
http://localhost:8000/tests/enviar-email-tests.html
```

Esto enviará automáticamente un email de prueba en 2 segundos.

### PASO 2: Revisar tu Email

1. Abre **ivan@maitsa.com**
2. Busca email de **FormSubmit** (puede estar en **SPAM**)
3. Asunto: "Confirm Form Submission"

### PASO 3: Confirmar

1. Abre el email de FormSubmit
2. Click en el botón **"Confirm Email"** o en el link
3. ¡Listo! ✅

### PASO 4: Probar que Funciona

```bash
# Ejecuta tests
./scripts/run-tests.sh

# En 1-2 minutos deberías recibir:
# "SexyFly Tests ✅ OK - 34/34"
```

---

## 🔍 SI NO ENCUENTRAS EL EMAIL

### Revisar Spam/Correo no Deseado

FormSubmit puede ir a spam la primera vez:

1. Abre tu correo (ivan@maitsa.com)
2. Ve a **Spam** o **Correo no deseado**
3. Busca: "FormSubmit" o "Confirm"

### Esperar 5-10 Minutos

A veces FormSubmit tarda un poco:

- Espera 5-10 minutos
- Actualiza tu bandeja
- Revisa spam

### Volver a Intentar

```
http://localhost:8000/tests/enviar-email-tests.html
```

Abre de nuevo y enviará otro email de prueba.

---

## 📋 CHECKLIST DE VERIFICACIÓN

```
[ ] Abrí http://localhost:8000/tests/enviar-email-tests.html
[ ] Vi mensaje "✅ Email enviado!"
[ ] Esperé 2-5 minutos
[ ] Revisé bandeja de entrada de ivan@maitsa.com
[ ] Revisé carpeta de SPAM
[ ] Busqué "FormSubmit" o "Confirm"
[ ] Click en "Confirm Email"
[ ] Probé ./scripts/run-tests.sh
[ ] Recibí email "SexyFly Tests ✅ OK"
```

---

## 🎯 DESPUÉS DE CONFIRMAR

Una vez confirmado el email:

**TODOS los emails futuros llegarán automáticamente:**

- ✅ Email después de cada test (OK/KO)
- ✅ Email con cada reserva
- ✅ Sin más confirmaciones
- ✅ Automático y confiable

---

## 🐛 TROUBLESHOOTING

### Email no llega después de confirmar

1. **Revisar spam** - Puede seguir yendo a spam
2. **Marcar como "No es spam"** - Para que lleguen a inbox
3. **Agregar a contactos** - `noreply@formsubmit.co`

### Error en formulario

Abrir consola (F12) en:
```
http://localhost:8000/tests/enviar-email-tests.html
```

Ver si hay errores en rojo.

---

## 📞 ALTERNATIVA (Si FormSubmit No Funciona)

Si después de 30 minutos no recibes nada, puedo implementar:

1. **EmailJS** (requiere registro gratuito, 5 min)
2. **SendGrid** (requiere API key, 10 min)
3. **Backend propio** (2 días)

---

## ⚡ EMPIEZA AQUÍ

```
http://localhost:8000/tests/enviar-email-tests.html
```

**Ábrelo AHORA y revisa ivan@maitsa.com en 2-5 minutos** ✅

---

**¿Qué ves cuando abres esa URL?** 🔍

