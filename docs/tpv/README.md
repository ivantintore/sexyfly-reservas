# 📁 Documentación TPV MAITSA/Redsys

**Comercio**: KYTO SL  
**Merchant Code**: 340829647  
**Provider**: MAITSA (Redsys/Caixabank)

---

## 📋 Contenido de Esta Carpeta

### Documentación Principal

**⭐ LEE PRIMERO:** `FUNCIONAMIENTO-TPV-COMPLETO.md`

Este archivo contiene:
- ✅ Datos de acceso completos
- ✅ Claves de cifrado (TEST y PRODUCCIÓN)
- ✅ Configuración del terminal
- ✅ Cómo funciona paso a paso
- ✅ Flujo de pago detallado (8 pasos)
- ✅ URLs y endpoints
- ✅ Códigos de respuesta Redsys
- ✅ Testing con tarjetas de prueba
- ✅ Cómo pasar a producción
- ✅ Troubleshooting completo

### Documentos Oficiales Redsys

**PDFs de MAITSA/Redsys:**

1. **Guia de integracion.pdf**
   - Guía oficial de Redsys
   - Proceso de integración completo
   - Plataformas soportadas
   - Requisitos técnicos

2. **INTEGRACIÓN TPV 1 MAITSA Mail - Alta de TPV Virtual en pruebas.pdf**
   - Email de alta en entorno TEST
   - Credenciales de acceso panel TEST
   - Clave SHA256 TEST
   - Tarjetas de prueba

3. **Documentación TPV MAITSA Mail - Alta de TPV Virtual en real.pdf**
   - Email de alta en entorno PRODUCCIÓN
   - Credenciales de acceso panel PRODUCCIÓN
   - Instrucciones para obtener clave PRODUCCIÓN

4. **Paso a entorno real.pdf**
   - Guía paso a paso para pasar a producción
   - Cómo obtener clave SHA256 de producción del panel
   - Configuración necesaria

5. **Ayuda a la integración.pdf**
   - Resolución de errores comunes
   - FAQ
   - Códigos de error

6. **Consultas y devoluciones en Canales.pdf**
   - Cómo consultar operaciones
   - Cómo hacer devoluciones
   - Uso del panel de administración

7. **PDFDUA.html**
   - (Vacío)

### Screenshots

- `Screenshot 2025-09-23 at 18.17.23.png`
- `Screenshot 2025-09-23 at 18.17.32.png`
- `Screenshot 2025-09-23 at 18.17.49.png`
- `Screenshot 2025-09-23 at 18.33.57.png`

---

## 🚀 INICIO RÁPIDO

### Para Entender el Sistema

1. **Lee:** `FUNCIONAMIENTO-TPV-COMPLETO.md`
2. **Revisa:** Sección "Cómo Funciona" (diagrama de 8 pasos)
3. **Prueba:** `http://localhost:8000/tests/test-tpv.html`

### Para Desarrollar

**Archivos de código:**
- Backend: `backend/tpv_redsys.py`, `backend/app.py`
- Frontend: `src/js/tpv-integration.js`
- Config: `src/js/config.js`

**Ver:** `docs/TPV-MAITSA-INTEGRATION.md` (guía técnica)

### Para Soporte

**Dudas técnicas:** virtualtpv@comerciaglobalpay.com  
**Panel TEST:** https://sis-t.redsys.es:25443/canales/  
**Panel PRODUCCIÓN:** https://canales.redsys.es/lacaixa/

---

## 🔑 DATOS IMPORTANTES

### Claves (SENSIBLES)

**TEST:** `sq7HjrUOBfKmC576ILgskD5srU870gJ7`  
**PRODUCCIÓN:** `Kmxl0wQuJmXiaukCGWTurOwhc+8Z9sAB`

**⚠️ NUNCA expongas estas claves en frontend o GitHub público**

### Tarjetas de Prueba

**OK:** 4548810000000003 (CVV: 123, Cad: 12/25)  
**KO:** 1111111111111117

---

**🎯 Para información completa, abre:** `FUNCIONAMIENTO-TPV-COMPLETO.md`

