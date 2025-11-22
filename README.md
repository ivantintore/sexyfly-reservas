# ✈️ SexyFly - Sistema de Reservas de Piloto Comercial

![Version](https://img.shields.io/badge/version-3.0.0-blue.svg)
![License](https://img.shields.io/badge/license-Proprietary-red.svg)
![Status](https://img.shields.io/badge/status-Production%20Ready-success.svg)

Sistema profesional de reservas para servicios de piloto comercial con calendario interactivo, precios dinámicos y gestión completa de reservas.

---

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Demo](#-demo)
- [Instalación](#-instalación)
- [Uso](#-uso)
- [Configuración](#-configuración)
- [Arquitectura](#-arquitectura)
- [API](#-api)
- [Precios](#-precios)
- [Testing](#-testing)
- [Despliegue](#-despliegue)
- [Contribución](#-contribución)
- [Licencia](#-licencia)

---

## ✨ Características

### 🎯 Funcionalidades Principales

- **Calendario Interactivo**: Selección visual de fechas con precios en tiempo real
- **Precios Dinámicos**: Sistema inteligente de pricing basado en:
  - Días de antelación (anticipada/estándar/urgente)
  - Temporadas (baja/media/alta)
  - Días especiales (festivos/fin de semana)
  - Descuentos por volumen
  
- **Validación Robusta**: Validación completa de formularios con feedback en tiempo real
- **Responsive Design**: Totalmente optimizado para móvil, tablet y desktop
- **Accesibilidad**: Cumple con estándares WCAG 2.1 Level AA
- **Sistema de Versiones**: Historial completo de cambios visible en la UI

### 🛠️ Tecnologías

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Arquitectura**: Modular, orientada a objetos
- **Sin dependencias**: Vanilla JavaScript puro (sin frameworks)
- **Build**: No requiere compilación
- **Backend**: Python 3 (servidor de desarrollo)

---

## 🚀 Demo

**URL de Producción**: https://ivantintore.github.io/sexyfly-reservas/

**URL de Desarrollo**: http://localhost:8000/public/index.html

## 💳 Sistema de Pagos

**TPV Virtual MAITSA/Redsys** integrado en v3.1.0

- **Provider**: MAITSA (Caixabank/Redsys)
- **Merchant Code**: 340829647
- **Modo actual**: TEST
- **Tarjetas de prueba**: Ver `docs/TPV-MAITSA-INTEGRATION.md`

Para más detalles ver: [Documentación TPV](docs/TPV-MAITSA-INTEGRATION.md)

---

## 💻 Instalación

### Requisitos Previos

- Python 3.7+ (para servidor de desarrollo)
- Navegador web moderno (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- Git

### Pasos de Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/ivantintore/sexyfly-reservas.git
cd sexyfly-reservas

# 2. Iniciar servidor de desarrollo
./start.sh
# O manualmente:
python3 server.py

# 3. Abrir en el navegador
# El navegador se abrirá automáticamente en http://localhost:8000
```

---

## 📖 Uso

### Flujo de Usuario

1. **Seleccionar Fechas**: El usuario selecciona fechas de ida y vuelta en el calendario
2. **Completar Detalles**: Ingresa códigos OACI, horarios y datos personales
3. **Revisar Precio**: El sistema calcula automáticamente el precio total
4. **Confirmar Reserva**: Acepta términos y procede al pago

### Ejemplo de Uso

```javascript
// Acceder a la aplicación desde la consola del navegador
const app = window.sexyFlyApp;

// Obtener fechas seleccionadas
const dates = app.getSelectedDates();
console.log(dates); // { departure: Date, return: Date }

// Obtener precio total
const total = app.getTotalPrice();
console.log(total); // 1500

// Resetear formulario
app.resetForm();
```

---

## ⚙️ Configuración

### Archivo de Configuración Central

Todas las configuraciones del sistema están centralizadas en `config.js`:

```javascript
// config.js
const SEXYFLY_CONFIG = {
  pricing: {
    basePrice: 500,        // Precio base (anticipada)
    urgentPrice: 1000,     // Precio urgente
    surcharges: {
      weekend: 100,        // Recargo fin de semana
      holiday: 200,        // Recargo festivos
    },
    // ... más configuraciones
  },
  // ... más secciones
};
```

### Personalización de Precios

Edita `config.js` para modificar:

- **Precios base**: `pricing.basePrice` y `pricing.urgentPrice`
- **Recargos**: `pricing.surcharges`
- **Temporadas**: `pricing.seasonMultipliers`
- **Descuentos**: `pricing.volumeDiscounts`
- **Días festivos**: `holidays`

### Variables de Entorno

```javascript
// En config.js - Sección de desarrollo
dev: {
  debug: false,           // Activar logs detallados
  mockPayment: true,      // Simular pagos
  autoFillForm: false,    // Rellenar formulario automáticamente
}
```

---

## 🏗️ Arquitectura

### Estructura del Proyecto

```
sexyfly-reservas/
├── index.html              # HTML principal
├── config.js               # ⭐ Configuración centralizada
├── app.js                  # Lógica principal de la aplicación
├── pricing.js              # Sistema de precios
├── calendar.js             # Sistema de calendario
├── styles.css              # Estilos principales
├── calendar.css            # Estilos del calendario
├── versions.json           # Historial de versiones
├── server.py               # Servidor de desarrollo
├── start.sh                # Script de inicio
├── requirements.txt        # Dependencias Python
├── .gitignore             # Archivos ignorados por Git
├── README.md              # Esta documentación
├── API.md                 # Documentación de API
└── Payments docs/         # Documentación de TPV

Archivos de Testing:
├── test-console.js        # Script de diagnóstico
├── check-server.sh        # Verificar servidor
├── debug.html             # Página de debug
├── TESTING.md             # Guía de testing
└── README-TESTING.md      # Testing avanzado
```

### Diagrama de Flujo de Datos

```
┌─────────────┐
│  index.html │
└──────┬──────┘
       │
       ├─────► config.js (Configuración global)
       │
       ├─────► pricing.js (Sistema de precios)
       │            │
       │            └─► Usa: config.js
       │
       ├─────► calendar.js (Sistema de calendario)
       │            │
       │            └─► Usa: config.js, pricing.js
       │
       └─────► app.js (Lógica principal)
                    │
                    └─► Usa: config.js, pricing.js, calendar.js
```

### Principios de Diseño

1. **Separación de Responsabilidades**: Cada módulo tiene una única responsabilidad
2. **Configuración Centralizada**: Una sola fuente de verdad para configuraciones
3. **Inyección de Dependencias**: Los módulos reciben dependencias externamente
4. **Inmutabilidad de Config**: El objeto de configuración está congelado
5. **Validación en Capas**: Validación en cliente + preparado para servidor

---

## 📡 API

### Módulos Principales

#### SexyFlyApp

```javascript
// Instancia global
const app = window.sexyFlyApp;

// Métodos públicos
app.getSelectedDates()  // → { departure: Date, return: Date }
app.getTotalPrice()     // → Number
app.resetForm()         // → void
```

#### SexyFlyPricing

```javascript
const pricing = new SexyFlyPricing();

// Calcular precio para una fecha
const priceInfo = pricing.calculatePrice(new Date('2025-12-25'));
// → { 
//     price: 1300, 
//     basePrice: 1000,
//     category: 'urgent',
//     isWeekend: false,
//     isHoliday: true,
//     ...
//   }

// Rango de precios
const range = pricing.getPriceRange(startDate, endDate);
// → { prices: [...], min: 500, max: 1300, average: 750 }

// Estadísticas
const stats = pricing.getStats(startDate, endDate);
```

#### SexyFlyCalendar

```javascript
const calendar = new SexyFlyCalendar('containerId', {
  onDateSelect: (dates) => console.log(dates),
  onPriceUpdate: (prices) => console.log(prices),
  calculatePrice: (date) => ({ price: 500, class: 'available' })
});

// API pública
calendar.getSelectedDates()  // → { departure: Date, return: Date }
calendar.clearSelection()    // → void
calendar.setDates(dep, ret)  // → void
```

Ver [API.md](./API.md) para documentación completa.

---

## 💰 Precios

### Sistema de Precios Dinámicos

#### Precio Base (según antelación)

| Antelación | Precio | Categoría |
|------------|--------|-----------|
| +7 días    | 500€   | Anticipada |
| 3-6 días   | 500-1000€ | Estándar (gradual) |
| <2 días    | 1000€  | Urgente |

#### Recargos Adicionales

| Concepto | Recargo |
|----------|---------|
| Fin de semana (Sáb/Dom) | +100€ |
| Día festivo | +200€ |
| Temporada alta (Jun-Ago) | +20% |
| Temporada baja (Nov-Feb) | -10% |

#### Descuentos por Volumen

| Días consecutivos | Descuento |
|-------------------|-----------|
| 3+ días | 5% |
| 7+ días | 10% |
| 14+ días | 15% |

#### Ejemplos de Cálculo

```javascript
// Ejemplo 1: Reserva anticipada (10 días antes, lunes)
// Precio base: 500€
// Total: 500€

// Ejemplo 2: Reserva urgente (1 día antes, sábado)
// Precio base: 1000€
// Recargo fin de semana: +100€
// Total: 1100€

// Ejemplo 3: Reserva en Navidad (15 días antes)
// Precio base: 500€
// Recargo festivo: +200€
// Total: 700€
```

---

## 🧪 Testing

### Testing Manual

```bash
# 1. Abrir consola del navegador (F12)

# 2. Ejecutar script de diagnóstico
# Copiar y pegar el contenido de test-console.js

# 3. Verificar todos los componentes
# El script mostrará el estado de cada módulo
```

### Casos de Prueba

Ver [TESTING.md](./TESTING.md) para la guía completa de testing.

**Checklist de Testing**:
- [ ] Selección de fechas en calendario
- [ ] Cálculo de precios correcto
- [ ] Validación de códigos ICAO
- [ ] Validación de email y teléfono
- [ ] Responsive en móvil
- [ ] Accesibilidad (teclado)
- [ ] Sistema de versiones funciona

---

## 🚀 Despliegue

### GitHub Pages (Recomendado)

```bash
# 1. Asegurarse de que todo está commiteado
git add .
git commit -m "feat: version 3.0.0 lista para producción"

# 2. Push a main
git push origin main

# 3. GitHub Pages se despliega automáticamente
# Esperar 1-2 minutos y verificar en:
# https://ivantintore.github.io/sexyfly-reservas/
```

### Servidor Propio

```bash
# Opción 1: Python
python3 -m http.server 8000

# Opción 2: Node.js (npx)
npx http-server -p 8000

# Opción 3: PHP
php -S localhost:8000
```

### Variables de Entorno para Producción

Antes de desplegar, actualizar en `config.js`:

```javascript
// Cambiar a modo producción
dev: {
  debug: false,           // ❌ Desactivar logs
  mockPayment: false,     // ❌ Pagos reales
},

integrations: {
  tpv: {
    testMode: false,      // ❌ Modo real
  }
}
```

---

## 🔐 Seguridad

### Validación

- **Cliente**: Validación completa en JavaScript
- **Servidor**: SIEMPRE validar en backend (próximamente)
- **OACI**: Validación con expresiones regulares
- **Email/Teléfono**: Validación con patrones estrictos

### Content Security Policy

Añadir headers CSP en producción:

```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';">
```

### Datos Sensibles

- ❌ NO guardar datos de pago en localStorage
- ✅ Enviar directamente a TPV
- ✅ HTTPS obligatorio en producción

---

## 📊 Métricas y Analytics

### Integración Google Analytics (Opcional)

En `config.js`:

```javascript
integrations: {
  analytics: {
    enabled: true,
    googleAnalyticsId: 'G-XXXXXXXXXX',  // Tu ID
  }
}
```

---

## 🐛 Troubleshooting

### Problemas Comunes

**1. Calendario no se muestra**
```javascript
// Verificar que config.js se carga antes
// Orden correcto en index.html:
// 1. config.js
// 2. pricing.js
// 3. calendar.js
// 4. app.js
```

**2. Precios incorrectos**
```javascript
// Verificar configuración
console.log(SEXYFLY_CONFIG.pricing);

// Limpiar cache de precios
sexyFlyApp.pricing.clearCache();
```

**3. Validación no funciona**
```javascript
// Verificar patrones de validación
console.log(SEXYFLY_CONFIG.validation);
```

---

## 📞 Soporte

**Email**: ivan@tintore.es  
**Website**: https://sexyfly.es

---

## 🗺️ Roadmap

### v3.1.0 (Próximamente)
- [ ] Integración completa TPV MAITSA
- [ ] Backend API con Node.js/Express
- [ ] Base de datos (PostgreSQL)
- [ ] Panel de administración

### v3.2.0 (Futuro)
- [ ] Multi-idioma (EN, FR, DE)
- [ ] Reservas recurrentes
- [ ] Sistema de cupones/descuentos
- [ ] Notificaciones email automáticas
- [ ] Exportar a PDF/iCalendar

### v4.0.0 (Visión)
- [ ] App móvil (React Native)
- [ ] Integración con sistemas de gestión de vuelos
- [ ] API pública para partners
- [ ] Sistema de reviews/valoraciones

---

## 📜 Licencia

Copyright © 2025 KYTO SL. Todos los derechos reservados.

Este software es propietario y confidencial. No está permitida su distribución, modificación o uso sin autorización expresa.

---

## 👨‍💻 Autor

**Ivan Tintore**  
Email: ivan@tintore.es  
Empresa: KYTO SL

---

## 🙏 Agradecimientos

- Inspiración de diseño: Booking.com, Ryanair, Vueling
- Sistema de calendario: Inspirado en date-range-pickers modernos
- Iconografía: Emojis nativos para mejor compatibilidad

---

## 📝 Changelog

Ver [versions.json](./versions.json) para el historial completo de cambios.

### v3.0.0 (2025-11-22) - Refactorización Mayor

**🎉 Nuevo Sistema Arquitectural**
- ✅ Configuración centralizada en `config.js` (única fuente de verdad)
- ✅ Código completamente modular y mantenible
- ✅ Eliminación de código duplicado y legacy
- ✅ Separación de estilos (styles.css)
- ✅ Aplicación principal (app.js) con manejo de errores robusto
- ✅ Validación mejorada con feedback en tiempo real
- ✅ Documentación completa (README, API, TESTING)
- ✅ 100% production-ready

**Cambios Breaking**
- Requiere cargar `config.js` antes que otros scripts
- Nuevo orden de archivos JS en HTML

---

**⭐ Si este proyecto te ha sido útil, considera darle una estrella en GitHub!**
