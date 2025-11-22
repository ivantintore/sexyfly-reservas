# 📡 SexyFly - Documentación de API

Documentación completa de las APIs JavaScript del sistema de reservas SexyFly.

**Versión**: 3.0.0  
**Última actualización**: 2025-11-22

---

## 📚 Índice

1. [SEXYFLY_CONFIG](#sexyfly_config)
2. [SexyFlyApp](#sexyfly app)
3. [SexyFlyPricing](#sexyflypric ing)
4. [SexyFlyCalendar](#sexyflyсаленdar)
5. [VersionManager](#versionmanager)
6. [Funciones Globales](#funciones-globales)

---

## SEXYFLY_CONFIG

Objeto de configuración global centralizado. **Única fuente de verdad** para todas las configuraciones del sistema.

### Ubicación
```javascript
window.SEXYFLY_CONFIG
```

### Estructura

```javascript
{
  // Información de la empresa
  company: {
    name: String,
    legalName: String,
    website: String,
    email: String,
    phone: String,
    address: String
  },

  // Configuración de precios (ÚNICA FUENTE DE VERDAD)
  pricing: {
    basePrice: Number,          // 500
    urgentPrice: Number,        // 1000
    surcharges: {
      weekend: Number,          // 100
      holiday: Number,          // 200
      overnight: Number         // 0
    },
    thresholds: {
      urgent: Number,           // 2 días
      standard: Number,         // 7 días
      advance: Number           // 30 días
    },
    seasonMultipliers: {
      low: Number,              // 0.9
      medium: Number,           // 1.0
      high: Number              // 1.2
    },
    volumeDiscounts: {
      3: Number,                // 0.05 (5%)
      7: Number,                // 0.10 (10%)
      14: Number                // 0.15 (15%)
    },
    currency: String,           // '€'
    currencyCode: String        // 'EUR'
  },

  // Configuración del calendario
  calendar: {
    weeksVisible: Number,       // 4
    language: String,           // 'es'
    showPrices: Boolean,        // true
    allowSingleDate: Boolean,   // false
    minDate: Date|null,
    maxDate: Date|null,
    firstDayOfWeek: Number      // 1 (lunes)
  },

  // Días festivos españoles
  holidays: Array<String>,      // ['01-01', '01-06', ...]

  // Validación de formularios
  validation: {
    icao: {
      length: Number,           // 4
      pattern: RegExp,          // /^[A-Z]{4}$/
      examples: Array<String>   // ['LELL', 'LEBL', ...]
    },
    client: {
      nameMinLength: Number,    // 3
      nameMaxLength: Number,    // 100
      phonePattern: RegExp,
      emailPattern: RegExp
    },
    reserva: {
      maxFlights: Number,       // 10
      minAdvanceHours: Number   // 24
    }
  },

  // Política de cancelación
  cancellationPolicy: Array<{
    minDays: Number,
    maxDays?: Number,
    refundPercentage: Number,
    description: String
  }>,

  // Configuración de UI
  ui: {
    colors: Object,
    transitions: Object,
    breakpoints: Object
  },

  // Integraciones
  integrations: {
    tpv: Object,
    email: Object,
    analytics: Object
  },

  // Traducciones
  i18n: {
    es: {
      selectDates: String,
      errors: Object,
      success: Object,
      // ...
    }
  },

  // Configuración de desarrollo
  dev: {
    debug: Boolean,             // false
    mockPayment: Boolean,       // true
    autoFillForm: Boolean       // false
  },

  // API y endpoints
  api: {
    baseUrl: String,
    endpoints: Object,
    timeout: Number
  },

  // Versión del sistema
  version: String,              // '3.0.0'
  buildDate: String             // ISO 8601
}
```

### Propiedades Congeladas

El objeto `SEXYFLY_CONFIG` está **congelado** (`Object.freeze()`), lo que significa que no se puede modificar directamente.

```javascript
// ❌ Esto NO funcionará
SEXYFLY_CONFIG.pricing.basePrice = 600;  // Error (en modo strict)

// ✅ Para modificar, usar métodos específicos de cada módulo
pricing.updateConfig({ basePrice: 600 });
```

---

## SexyFlyApp

Clase principal que orquesta toda la aplicación.

### Instanciación

```javascript
// Se crea automáticamente al cargar la página
const app = window.sexyFlyApp;
```

### Constructor

```javascript
new SexyFlyApp()
```

No requiere parámetros. Inicializa automáticamente todos los módulos.

### Propiedades Públicas

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `pricing` | SexyFlyPricing | Instancia del sistema de precios |
| `calendar` | SexyFlyCalendar | Instancia del calendario |
| `versionManager` | VersionManager | Gestor de versiones |
| `selectedDates` | Object\|null | Fechas seleccionadas |
| `totalPrice` | Number | Precio total calculado |

### Métodos Públicos

#### `getSelectedDates()`

Obtiene las fechas seleccionadas por el usuario.

```javascript
const dates = app.getSelectedDates();
// → { departure: Date, return: Date } | null
```

**Retorna:**
- `Object`: Con propiedades `departure` y `return` (objetos Date)
- `null`: Si no hay fechas seleccionadas

**Ejemplo:**
```javascript
const dates = app.getSelectedDates();
if (dates) {
  console.log('Ida:', dates.departure.toLocaleDateString());
  console.log('Vuelta:', dates.return.toLocaleDateString());
}
```

#### `getTotalPrice()`

Obtiene el precio total de la reserva.

```javascript
const total = app.getTotalPrice();
// → Number
```

**Retorna:**
- `Number`: Precio total en euros (sin símbolo de moneda)

**Ejemplo:**
```javascript
const total = app.getTotalPrice();
console.log(`Total: ${total}€`);  // "Total: 1500€"
```

#### `resetForm()`

Resetea todo el formulario a su estado inicial.

```javascript
app.resetForm();
// → void
```

**Efectos:**
- Limpia la selección del calendario
- Resetea todos los campos del formulario
- Oculta secciones condicionales
- Limpia el precio calculado

**Ejemplo:**
```javascript
// Después de completar una reserva
app.resetForm();
```

### Eventos

La clase `SexyFlyApp` maneja internamente los siguientes eventos:

- `submit` del formulario
- `click` en botón de submit
- `input` en campos ICAO
- `change` en selección de fechas

---

## SexyFlyPricing

Sistema avanzado de cálculo de precios dinámicos.

### Instanciación

```javascript
const pricing = new SexyFlyPricing(customConfig);
```

**Parámetros:**
- `customConfig` (opcional): Objeto de configuración personalizada

**Ejemplo:**
```javascript
// Usar configuración por defecto (desde SEXYFLY_CONFIG)
const pricing = new SexyFlyPricing();

// Personalizar configuración
const pricing = new SexyFlyPricing({
  basePrice: 600,
  urgentPrice: 1200
});
```

### Métodos Principales

#### `calculatePrice(date, options)`

Calcula el precio para una fecha específica.

```javascript
const priceInfo = pricing.calculatePrice(date, options);
```

**Parámetros:**
- `date` (Date, requerido): Fecha para calcular el precio
- `options` (Object, opcional):
  - `totalDays` (Number): Total de días para descuento por volumen

**Retorna:**
```javascript
{
  date: Date,                    // Fecha original
  price: Number,                 // Precio final
  basePrice: Number,             // Precio base sin modificadores
  daysInAdvance: Number,         // Días de antelación
  category: String,              // 'advance' | 'standard' | 'urgent'
  modifiers: {
    multiplier: Number,          // Multiplicador total
    surcharge: Number,           // Recargos totales
    applied: Array<Object>       // Modificadores aplicados
  },
  breakdown: Array<Object>,      // Desglose detallado
  cssClass: String,              // Clase CSS ('available' | 'medium' | 'urgent')
  isWeekend: Boolean,            // ¿Es fin de semana?
  isHoliday: Boolean,            // ¿Es festivo?
  season: String                 // 'low' | 'medium' | 'high'
}
```

**Ejemplo:**
```javascript
const date = new Date('2025-12-25');
const info = pricing.calculatePrice(date);

console.log(info.price);          // 700
console.log(info.basePrice);      // 500
console.log(info.category);       // 'advance'
console.log(info.isHoliday);      // true
console.log(info.breakdown);
// [
//   { concept: 'Precio base', amount: 500, type: 'base' },
//   { concept: 'Recargo día festivo', amount: 200, type: 'surcharge' },
//   { concept: 'Total', amount: 700, type: 'total' }
// ]
```

#### `calculateTotalPrice(dates, options)`

Calcula el precio total para múltiples fechas.

```javascript
const totalInfo = pricing.calculateTotalPrice(dates, options);
```

**Parámetros:**
- `dates` (Array<Date>, requerido): Array de fechas
- `options` (Object, opcional):
  - `applyMultiDayDiscount` (Boolean): Aplicar descuento multi-día

**Retorna:**
```javascript
{
  dates: Array<Date>,              // Fechas originales
  calculations: Array<Object>,     // Cálculo individual de cada fecha
  subtotal: Number,                // Subtotal sin descuentos
  total: Number,                   // Total final
  appliedDiscounts: Array<Object>, // Descuentos aplicados
  savings: Number,                 // Ahorro total
  averagePerDay: Number            // Promedio por día
}
```

**Ejemplo:**
```javascript
const dates = [
  new Date('2025-12-20'),
  new Date('2025-12-21'),
  new Date('2025-12-22')
];

const total = pricing.calculateTotalPrice(dates, {
  applyMultiDayDiscount: true
});

console.log(total.subtotal);      // 1500
console.log(total.total);         // 1425 (con descuento 5%)
console.log(total.savings);       // 75
console.log(total.averagePerDay); // 475
```

#### `getPriceRange(startDate, endDate, options)`

Obtiene información de precios para un rango de fechas.

```javascript
const range = pricing.getPriceRange(startDate, endDate, options);
```

**Parámetros:**
- `startDate` (Date, requerido): Fecha de inicio
- `endDate` (Date, requerido): Fecha de fin
- `options` (Object, opcional): Opciones adicionales

**Retorna:**
```javascript
{
  prices: Array<Object>,  // Array de objetos de precio (uno por día)
  min: Number,            // Precio mínimo en el rango
  max: Number,            // Precio máximo en el rango
  average: Number         // Precio promedio
}
```

**Ejemplo:**
```javascript
const start = new Date('2025-12-01');
const end = new Date('2025-12-31');
const range = pricing.getPriceRange(start, end);

console.log(`Precios en diciembre:`);
console.log(`Mínimo: ${range.min}€`);
console.log(`Máximo: ${range.max}€`);
console.log(`Promedio: ${range.average}€`);
console.log(`Total días: ${range.prices.length}`);
```

#### `getStats(startDate, endDate)`

Obtiene estadísticas detalladas de precios.

```javascript
const stats = pricing.getStats(startDate, endDate);
```

**Retorna:**
```javascript
{
  totalDays: Number,
  priceRange: { min: Number, max: Number, average: Number },
  byCategory: {
    advance: { count: Number, avgPrice: Number },
    standard: { count: Number, avgPrice: Number },
    urgent: { count: Number, avgPrice: Number }
  },
  weekends: Number,  // Cantidad de fines de semana
  holidays: Number   // Cantidad de festivos
}
```

#### `clearCache()`

Limpia el cache interno de cálculos.

```javascript
pricing.clearCache();
```

Útil después de cambiar la configuración.

#### `updateConfig(newConfig)`

Actualiza la configuración del sistema de precios.

```javascript
pricing.updateConfig({ basePrice: 600 });
```

**Nota:** Limpia automáticamente el cache.

---

## SexyFlyCalendar

Sistema de calendario interactivo para selección de fechas.

### Instanciación

```javascript
const calendar = new SexyFlyCalendar(containerId, options);
```

**Parámetros:**
- `containerId` (String, requerido): ID del elemento HTML contenedor
- `options` (Object, opcional):

```javascript
{
  weeksVisible: Number,                  // 4 por defecto
  language: String,                      // 'es'
  showPrices: Boolean,                   // true
  allowSingleDate: Boolean,              // false
  onDateSelect: Function,                // Callback selección de fechas
  onPriceUpdate: Function,               // Callback actualización de precio
  calculatePrice: Function               // Función de cálculo de precio
}
```

**Ejemplo:**
```javascript
const calendar = new SexyFlyCalendar('calendarContainer', {
  onDateSelect: (dates) => {
    console.log('Fechas seleccionadas:', dates);
  },
  onPriceUpdate: (prices) => {
    console.log('Precio total:', prices.total);
  },
  calculatePrice: (date) => {
    const pricing = new SexyFlyPricing();
    const info = pricing.calculatePrice(date);
    return {
      price: info.price,
      class: info.cssClass
    };
  }
});
```

### Callbacks

#### `onDateSelect(dates)`

Se ejecuta cuando el usuario completa la selección de fechas (ida + vuelta).

**Parámetros:**
```javascript
{
  departure: Date,  // Fecha de ida
  return: Date      // Fecha de vuelta
}
```

**Ejemplo:**
```javascript
onDateSelect: (dates) => {
  console.log('Ida:', dates.departure);
  console.log('Vuelta:', dates.return);
  
  // Mostrar sección de formulario
  document.getElementById('form').style.display = 'block';
}
```

#### `onPriceUpdate(prices)`

Se ejecuta cuando se calculan los precios de las fechas seleccionadas.

**Parámetros:**
```javascript
{
  departure: Number,  // Precio del vuelo de ida
  return: Number,     // Precio del vuelo de vuelta
  total: Number       // Precio total
}
```

#### `calculatePrice(date)`

Función que el calendario llama para calcular el precio de cada día.

**Parámetros:**
- `date` (Date): Fecha a calcular

**Debe retornar:**
```javascript
{
  price: Number,   // Precio del día
  class: String    // Clase CSS ('available' | 'medium' | 'urgent')
}
```

### Métodos Públicos

#### `getSelectedDates()`

Obtiene las fechas actualmente seleccionadas.

```javascript
const dates = calendar.getSelectedDates();
// → { departure: Date|null, return: Date|null }
```

#### `clearSelection()`

Limpia la selección actual.

```javascript
calendar.clearSelection();
```

#### `setDates(departure, returnDate)`

Establece fechas programáticamente.

```javascript
calendar.setDates(
  new Date('2025-12-20'),
  new Date('2025-12-27')
);
```

---

## VersionManager

Gestor del sistema de versiones visible en la UI.

### Instanciación

```javascript
const versionManager = new VersionManager();
```

Se crea automáticamente por `SexyFlyApp`.

### Métodos

#### `init()`

Inicializa el sistema de versiones (carga versions.json).

#### `refresh()`

Recarga el historial de versiones.

```javascript
await versionManager.refresh();
```

---

## Funciones Globales

### `scrollToTerms()`

Hace scroll suave a la sección de términos y condiciones.

```javascript
scrollToTerms();
```

**Disponible globalmente:**
```javascript
window.scrollToTerms();
```

---

## Tipos de Datos

### PriceInfo

```typescript
interface PriceInfo {
  date: Date;
  price: number;
  basePrice: number;
  daysInAdvance: number;
  category: 'advance' | 'standard' | 'urgent';
  modifiers: {
    multiplier: number;
    surcharge: number;
    applied: Modifier[];
  };
  breakdown: BreakdownItem[];
  cssClass: 'available' | 'medium' | 'urgent';
  isWeekend: boolean;
  isHoliday: boolean;
  season: 'low' | 'medium' | 'high';
}
```

### Modifier

```typescript
interface Modifier {
  type: 'season' | 'weekend' | 'holiday' | 'volume';
  name: string;
  factor?: number;        // Para multiplicadores
  amount?: number;        // Para recargos
  description: string;
}
```

### BreakdownItem

```typescript
interface BreakdownItem {
  concept: string;
  amount: number;
  type: 'base' | 'multiplier' | 'surcharge' | 'total';
  description?: string;
}
```

### SelectedDates

```typescript
interface SelectedDates {
  departure: Date | null;
  return: Date | null;
}
```

---

## Ejemplos de Uso

### Ejemplo Completo: Reserva Personalizada

```javascript
// 1. Obtener instancias
const app = window.sexyFlyApp;
const pricing = app.pricing;
const calendar = app.calendar;

// 2. Seleccionar fechas programáticamente
const departure = new Date('2025-12-20');
const returnDate = new Date('2025-12-27');
calendar.setDates(departure, returnDate);

// 3. Calcular precios
const depPrice = pricing.calculatePrice(departure);
const retPrice = pricing.calculatePrice(returnDate);

console.log(`Ida: ${depPrice.price}€`);
console.log(`Vuelta: ${retPrice.price}€`);
console.log(`Total: ${depPrice.price + retPrice.price}€`);

// 4. Ver desglose detallado
depPrice.breakdown.forEach(item => {
  console.log(`${item.concept}: ${item.amount}€`);
});

// 5. Obtener estadísticas del mes
const start = new Date('2025-12-01');
const end = new Date('2025-12-31');
const stats = pricing.getStats(start, end);

console.log('Estadísticas de diciembre:', stats);
```

### Ejemplo: Validación Personalizada

```javascript
// Añadir validación adicional antes del submit
const originalSubmit = app.handleFormSubmit;

app.handleFormSubmit = function() {
  // Validación personalizada
  const dates = this.getSelectedDates();
  const diffDays = (dates.return - dates.departure) / (1000 * 60 * 60 * 24);
  
  if (diffDays > 30) {
    alert('No se permiten reservas mayores a 30 días');
    return;
  }
  
  // Continuar con el submit original
  originalSubmit.call(this);
};
```

### Ejemplo: Integración con Analytics

```javascript
// Trackear selección de fechas
const originalDateSelect = app.handleDateSelection;

app.handleDateSelection = function(dates) {
  // Enviar evento a analytics
  if (window.gtag) {
    gtag('event', 'date_selected', {
      departure: dates.departure.toISOString(),
      return: dates.return.toISOString(),
      days: Math.ceil((dates.return - dates.departure) / (1000 * 60 * 60 * 24))
    });
  }
  
  // Continuar con la función original
  originalDateSelect.call(this, dates);
};
```

---

## Debugging

### Activar Modo Debug

```javascript
// En config.js
SEXYFLY_CONFIG.dev.debug = true;

// Verás logs detallados en consola
```

### Inspeccionar Estado

```javascript
// Estado de la aplicación
console.log(window.sexyFlyApp);

// Configuración actual
console.log(SEXYFLY_CONFIG);

// Fechas seleccionadas
console.log(window.sexyFlyApp.getSelectedDates());

// Precio actual
console.log(window.sexyFlyApp.getTotalPrice());

// Cache de precios
console.log(window.sexyFlyApp.pricing.priceCache);
```

### Script de Diagnóstico

Ejecutar en consola:

```javascript
// Ver test-console.js para script completo de diagnóstico
```

---

## Compatibilidad

### Navegadores Soportados

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Características ES6+ Utilizadas

- Classes
- Arrow functions
- Template literals
- Destructuring
- Default parameters
- Object.freeze()
- Async/await
- Map/Set

---

## Migración desde v2.x

### Cambios Breaking

```javascript
// ❌ v2.x - Precios hardcodeados
const price = 500;

// ✅ v3.0 - Desde configuración
const price = SEXYFLY_CONFIG.pricing.basePrice;
```

```javascript
// ❌ v2.x - Lógica en index.html
<script>
  function calculatePrice(date) { ... }
</script>

// ✅ v3.0 - Módulo separado
const pricing = new SexyFlyPricing();
const price = pricing.calculatePrice(date);
```

### Guía de Migración

1. Cargar `config.js` primero
2. Reemplazar valores hardcodeados con `SEXYFLY_CONFIG`
3. Usar nuevas instancias de clases
4. Actualizar callbacks y eventos

---

## Soporte

**Documentación**: [README.md](./README.md)  
**Email**: ivan@tintore.es  
**Issues**: GitHub Issues

---

**Última actualización**: 2025-11-22  
**Versión API**: 3.0.0

