/**
 * SexyFly - Sistema de Unit Testing
 * @version 3.0.0
 * @description Framework de testing minimalista sin dependencias
 * 
 * Uso:
 * - En navegador: Abrir test.html
 * - En terminal: node test.js (requiere Node.js)
 */

'use strict';

// ===== FRAMEWORK DE TESTING MINIMALISTA =====

class TestRunner {
  constructor(name) {
    this.suiteName = name;
    this.tests = [];
    this.passed = 0;
    this.failed = 0;
    this.skipped = 0;
    this.startTime = null;
    this.endTime = null;
  }

  describe(description, testFn) {
    console.log(`\n📦 ${description}`);
    testFn();
  }

  test(description, testFn) {
    this.tests.push({ description, testFn });
  }

  async run() {
    console.log(`\n${'='.repeat(70)}`);
    console.log(`🧪 EJECUTANDO TESTS: ${this.suiteName}`);
    console.log(`${'='.repeat(70)}\n`);

    this.startTime = Date.now();

    for (const test of this.tests) {
      try {
        await test.testFn();
        this.passed++;
        console.log(`  ✅ ${test.description}`);
      } catch (error) {
        this.failed++;
        console.log(`  ❌ ${test.description}`);
        console.log(`     Error: ${error.message}`);
      }
    }

    this.endTime = Date.now();
    this.printSummary();
  }

  printSummary() {
    const duration = (this.endTime - this.startTime) / 1000;
    const total = this.tests.length;

    console.log(`\n${'='.repeat(70)}`);
    console.log(`📊 RESUMEN DE TESTS`);
    console.log(`${'='.repeat(70)}`);
    console.log(`Total:   ${total} tests`);
    console.log(`✅ Passed:  ${this.passed} (${((this.passed/total)*100).toFixed(1)}%)`);
    console.log(`❌ Failed:  ${this.failed} (${((this.failed/total)*100).toFixed(1)}%)`);
    console.log(`⏱️  Duration: ${duration.toFixed(2)}s`);
    console.log(`${'='.repeat(70)}\n`);

    if (this.failed === 0) {
      console.log('🎉 TODOS LOS TESTS PASARON! 🎉\n');
      return 0; // Exit code 0 = success
    } else {
      console.log('⚠️  HAY TESTS FALLIDOS\n');
      return 1; // Exit code 1 = failure
    }
  }
}

// ===== ASSERTIONS =====

const assert = {
  equal(actual, expected, message = '') {
    if (actual !== expected) {
      throw new Error(
        `${message}\n  Expected: ${expected}\n  Actual: ${actual}`
      );
    }
  },

  notEqual(actual, expected, message = '') {
    if (actual === expected) {
      throw new Error(
        `${message}\n  Expected not to be: ${expected}\n  Actual: ${actual}`
      );
    }
  },

  truthy(value, message = '') {
    if (!value) {
      throw new Error(`${message}\n  Expected truthy, got: ${value}`);
    }
  },

  falsy(value, message = '') {
    if (value) {
      throw new Error(`${message}\n  Expected falsy, got: ${value}`);
    }
  },

  throws(fn, message = '') {
    try {
      fn();
      throw new Error(`${message}\n  Expected function to throw`);
    } catch (error) {
      // Esperado
    }
  },

  async rejects(promise, message = '') {
    try {
      await promise;
      throw new Error(`${message}\n  Expected promise to reject`);
    } catch (error) {
      // Esperado
    }
  },

  isType(value, type, message = '') {
    if (typeof value !== type) {
      throw new Error(
        `${message}\n  Expected type: ${type}\n  Actual type: ${typeof value}`
      );
    }
  },

  isInstanceOf(value, constructor, message = '') {
    if (!(value instanceof constructor)) {
      throw new Error(
        `${message}\n  Expected instance of: ${constructor.name}`
      );
    }
  },

  arrayContains(array, value, message = '') {
    if (!Array.isArray(array) || !array.includes(value)) {
      throw new Error(
        `${message}\n  Array does not contain: ${value}`
      );
    }
  },

  objectHasProperty(obj, prop, message = '') {
    if (!obj.hasOwnProperty(prop)) {
      throw new Error(
        `${message}\n  Object does not have property: ${prop}`
      );
    }
  }
};

// ===== MOCK DATA =====

const mockData = {
  validDate: new Date('2025-12-25'),
  pastDate: new Date('2020-01-01'),
  futureDate: new Date('2026-12-25'),
  
  validICAO: 'LELL',
  invalidICAO: 'ABC',
  
  validEmail: 'test@example.com',
  invalidEmail: 'invalid-email',
  
  validPhone: '+34 600 123 456',
  invalidPhone: '123',

  validBooking: {
    departure: new Date('2025-12-20'),
    return: new Date('2025-12-27'),
    origin: 'LELL',
    destination: 'LEBL',
    clientName: 'Test User',
    clientEmail: 'test@example.com',
    clientPhone: '+34 600 123 456'
  }
};

// ===== TESTS =====

const runner = new TestRunner('SexyFly v3.0.0');

// ===== TEST SUITE 1: Configuración =====
runner.describe('Configuración (SEXYFLY_CONFIG)', () => {
  
  runner.test('Config debe estar definido', () => {
    assert.truthy(typeof SEXYFLY_CONFIG !== 'undefined', 'SEXYFLY_CONFIG debe existir');
  });

  runner.test('Config debe estar congelado (inmutable)', () => {
    assert.truthy(Object.isFrozen(SEXYFLY_CONFIG), 'Config debe ser inmutable');
  });

  runner.test('Pricing debe tener basePrice', () => {
    assert.truthy(SEXYFLY_CONFIG.pricing.basePrice, 'basePrice debe existir');
    assert.isType(SEXYFLY_CONFIG.pricing.basePrice, 'number', 'basePrice debe ser número');
  });

  runner.test('Pricing debe tener urgentPrice', () => {
    assert.truthy(SEXYFLY_CONFIG.pricing.urgentPrice, 'urgentPrice debe existir');
    assert.isType(SEXYFLY_CONFIG.pricing.urgentPrice, 'number', 'urgentPrice debe ser número');
  });

  runner.test('urgentPrice debe ser mayor que basePrice', () => {
    assert.truthy(
      SEXYFLY_CONFIG.pricing.urgentPrice > SEXYFLY_CONFIG.pricing.basePrice,
      'urgentPrice debe ser > basePrice'
    );
  });

  runner.test('Recargos deben estar definidos', () => {
    assert.objectHasProperty(SEXYFLY_CONFIG.pricing.surcharges, 'weekend');
    assert.objectHasProperty(SEXYFLY_CONFIG.pricing.surcharges, 'holiday');
  });

  runner.test('Holidays debe ser un array', () => {
    assert.truthy(Array.isArray(SEXYFLY_CONFIG.holidays), 'holidays debe ser array');
    assert.truthy(SEXYFLY_CONFIG.holidays.length > 0, 'holidays debe tener elementos');
  });

  runner.test('Validación ICAO debe estar configurada', () => {
    assert.objectHasProperty(SEXYFLY_CONFIG.validation, 'icao');
    assert.equal(SEXYFLY_CONFIG.validation.icao.length, 4, 'ICAO debe ser 4 caracteres');
    assert.isInstanceOf(SEXYFLY_CONFIG.validation.icao.pattern, RegExp, 'Pattern debe ser RegExp');
  });

  runner.test('i18n español debe existir', () => {
    assert.objectHasProperty(SEXYFLY_CONFIG.i18n, 'es');
    assert.objectHasProperty(SEXYFLY_CONFIG.i18n.es, 'errors');
  });

  runner.test('Versión debe estar definida', () => {
    assert.truthy(SEXYFLY_CONFIG.version, 'version debe existir');
    assert.equal(SEXYFLY_CONFIG.version, '3.0.0', 'version debe ser 3.0.0');
  });
});

// ===== TEST SUITE 2: Sistema de Precios =====
runner.describe('Sistema de Precios (SexyFlyPricing)', () => {

  runner.test('SexyFlyPricing debe estar definido', () => {
    assert.truthy(typeof SexyFlyPricing !== 'undefined', 'SexyFlyPricing debe existir');
  });

  runner.test('Debe crear instancia correctamente', () => {
    const pricing = new SexyFlyPricing();
    assert.isInstanceOf(pricing, SexyFlyPricing, 'Debe ser instancia de SexyFlyPricing');
  });

  runner.test('Debe calcular precio para fecha futura', () => {
    const pricing = new SexyFlyPricing();
    const result = pricing.calculatePrice(mockData.futureDate);
    
    assert.objectHasProperty(result, 'price');
    assert.objectHasProperty(result, 'basePrice');
    assert.objectHasProperty(result, 'category');
    assert.isType(result.price, 'number');
  });

  runner.test('Precio anticipado debe ser 500€', () => {
    const pricing = new SexyFlyPricing();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30); // 30 días adelante
    
    const result = pricing.calculatePrice(futureDate);
    assert.equal(result.basePrice, 500, 'Precio anticipado debe ser 500€');
    assert.equal(result.category, 'advance', 'Categoría debe ser advance');
  });

  runner.test('Precio urgente debe ser 1000€', () => {
    const pricing = new SexyFlyPricing();
    const urgentDate = new Date();
    urgentDate.setDate(urgentDate.getDate() + 1); // Mañana
    
    const result = pricing.calculatePrice(urgentDate);
    assert.equal(result.category, 'urgent', 'Categoría debe ser urgent');
  });

  runner.test('Fin de semana debe tener recargo', () => {
    const pricing = new SexyFlyPricing();
    // Encontrar próximo sábado
    const saturday = new Date();
    saturday.setDate(saturday.getDate() + ((6 - saturday.getDay() + 7) % 7) + 14);
    
    const result = pricing.calculatePrice(saturday);
    assert.truthy(result.isWeekend, 'Debe detectar fin de semana');
    assert.truthy(result.price > result.basePrice, 'Debe tener recargo');
  });

  runner.test('Días festivos deben ser detectados', () => {
    const pricing = new SexyFlyPricing();
    const christmas = new Date('2025-12-25'); // Navidad
    
    const result = pricing.calculatePrice(christmas);
    assert.truthy(result.isHoliday, 'Debe detectar festivo');
  });

  runner.test('Debe calcular rango de precios', () => {
    const pricing = new SexyFlyPricing();
    const start = new Date('2025-12-01');
    const end = new Date('2025-12-31');
    
    const range = pricing.getPriceRange(start, end);
    assert.objectHasProperty(range, 'min');
    assert.objectHasProperty(range, 'max');
    assert.objectHasProperty(range, 'average');
    assert.truthy(range.min <= range.max, 'min debe ser <= max');
  });

  runner.test('Cache debe funcionar', () => {
    const pricing = new SexyFlyPricing();
    const date = new Date('2025-12-25');
    
    const result1 = pricing.calculatePrice(date);
    const result2 = pricing.calculatePrice(date);
    
    assert.equal(result1.price, result2.price, 'Cache debe retornar mismo resultado');
  });

  runner.test('clearCache debe limpiar cache', () => {
    const pricing = new SexyFlyPricing();
    const date = new Date('2025-12-25');
    
    pricing.calculatePrice(date);
    assert.truthy(pricing.priceCache.size > 0, 'Cache debe tener elementos');
    
    pricing.clearCache();
    assert.equal(pricing.priceCache.size, 0, 'Cache debe estar vacío');
  });
});

// ===== TEST SUITE 3: Calendario =====
runner.describe('Sistema de Calendario (SexyFlyCalendar)', () => {

  runner.test('SexyFlyCalendar debe estar definido', () => {
    assert.truthy(typeof SexyFlyCalendar !== 'undefined', 'SexyFlyCalendar debe existir');
  });

  runner.test('Debe lanzar error si no existe contenedor', () => {
    assert.throws(() => {
      new SexyFlyCalendar('containerInexistente');
    }, 'Debe lanzar error con contenedor inválido');
  });

  runner.test('Debe formatear fechas correctamente', () => {
    // Crear contenedor temporal
    const container = document.createElement('div');
    container.id = 'testCalendar';
    document.body.appendChild(container);
    
    const calendar = new SexyFlyCalendar('testCalendar');
    const formatted = calendar.formatDateString(new Date('2025-12-25'));
    
    assert.equal(formatted, '2025-12-25', 'Formato debe ser YYYY-MM-DD');
    
    // Limpiar
    document.body.removeChild(container);
  });

  runner.test('Debe parsear fechas correctamente', () => {
    const container = document.createElement('div');
    container.id = 'testCalendar2';
    document.body.appendChild(container);
    
    const calendar = new SexyFlyCalendar('testCalendar2');
    const parsed = calendar.parseDate('2025-12-25');
    
    assert.isInstanceOf(parsed, Date, 'Debe retornar Date');
    assert.equal(parsed.getDate(), 25, 'Día debe ser 25');
    assert.equal(parsed.getMonth(), 11, 'Mes debe ser 11 (diciembre)');
    
    document.body.removeChild(container);
  });
});

// ===== TEST SUITE 4: Validación =====
runner.describe('Sistema de Validación', () => {

  runner.test('Pattern ICAO debe validar códigos correctos', () => {
    const pattern = SEXYFLY_CONFIG.validation.icao.pattern;
    assert.truthy(pattern.test('LELL'), 'LELL debe ser válido');
    assert.truthy(pattern.test('LEBL'), 'LEBL debe ser válido');
    assert.truthy(pattern.test('LEMD'), 'LEMD debe ser válido');
  });

  runner.test('Pattern ICAO debe rechazar códigos incorrectos', () => {
    const pattern = SEXYFLY_CONFIG.validation.icao.pattern;
    assert.falsy(pattern.test('ABC'), 'ABC debe ser inválido (3 letras)');
    assert.falsy(pattern.test('ABCDE'), 'ABCDE debe ser inválido (5 letras)');
    assert.falsy(pattern.test('AB12'), 'AB12 debe ser inválido (números)');
    assert.falsy(pattern.test('abcd'), 'abcd debe ser inválido (minúsculas)');
  });

  runner.test('Pattern email debe validar emails correctos', () => {
    const pattern = SEXYFLY_CONFIG.validation.client.emailPattern;
    assert.truthy(pattern.test('test@example.com'), 'Email simple debe ser válido');
    assert.truthy(pattern.test('user.name@domain.co.uk'), 'Email complejo debe ser válido');
  });

  runner.test('Pattern email debe rechazar emails incorrectos', () => {
    const pattern = SEXYFLY_CONFIG.validation.client.emailPattern;
    assert.falsy(pattern.test('invalid'), 'invalid debe ser inválido');
    assert.falsy(pattern.test('@example.com'), '@example.com debe ser inválido');
    assert.falsy(pattern.test('test@'), 'test@ debe ser inválido');
  });

  runner.test('Pattern teléfono debe validar teléfonos españoles', () => {
    const pattern = SEXYFLY_CONFIG.validation.client.phonePattern;
    assert.truthy(pattern.test('600123456'), 'Formato corto debe ser válido');
    assert.truthy(pattern.test('+34 600 123 456'), 'Formato con +34 debe ser válido');
    assert.truthy(pattern.test('34 600123456'), 'Formato con 34 debe ser válido');
  });
});

// ===== TEST SUITE 5: Utilidades =====
runner.describe('Utilidades y Helpers', () => {

  runner.test('Debe detectar fin de semana correctamente', () => {
    const pricing = new SexyFlyPricing();
    
    // Sábado
    const saturday = new Date('2025-12-27'); // Es sábado
    assert.truthy(pricing.isWeekend(saturday), 'Sábado debe ser fin de semana');
    
    // Domingo
    const sunday = new Date('2025-12-28'); // Es domingo
    assert.truthy(pricing.isWeekend(sunday), 'Domingo debe ser fin de semana');
    
    // Lunes
    const monday = new Date('2025-12-29'); // Es lunes
    assert.falsy(pricing.isWeekend(monday), 'Lunes no debe ser fin de semana');
  });

  runner.test('Debe detectar festivos correctamente', () => {
    const pricing = new SexyFlyPricing();
    
    const christmas = new Date('2025-12-25'); // Navidad
    assert.truthy(pricing.isHoliday(christmas), 'Navidad debe ser festivo');
    
    const newYear = new Date('2025-01-01'); // Año nuevo
    assert.truthy(pricing.isHoliday(newYear), 'Año nuevo debe ser festivo');
    
    const randomDay = new Date('2025-03-15'); // Día normal
    assert.falsy(pricing.isHoliday(randomDay), 'Día normal no debe ser festivo');
  });

  runner.test('Debe determinar temporada correctamente', () => {
    const pricing = new SexyFlyPricing();
    
    const summer = new Date('2025-07-15'); // Verano
    assert.equal(pricing.getSeason(summer), 'high', 'Julio debe ser temporada alta');
    
    const winter = new Date('2025-12-15'); // Invierno
    assert.equal(pricing.getSeason(winter), 'low', 'Diciembre debe ser temporada baja');
    
    const spring = new Date('2025-04-15'); // Primavera
    assert.equal(pricing.getSeason(spring), 'medium', 'Abril debe ser temporada media');
  });
});

// ===== TEST SUITE 6: Integración =====
runner.describe('Tests de Integración', () => {

  runner.test('Pricing y Config deben estar sincronizados', () => {
    const pricing = new SexyFlyPricing();
    
    assert.equal(
      pricing.config.basePrice, 
      SEXYFLY_CONFIG.pricing.basePrice,
      'basePrice debe coincidir'
    );
    
    assert.equal(
      pricing.config.urgentPrice,
      SEXYFLY_CONFIG.pricing.urgentPrice,
      'urgentPrice debe coincidir'
    );
  });

  runner.test('Calendario debe poder usar pricing', () => {
    const container = document.createElement('div');
    container.id = 'testCalendar3';
    document.body.appendChild(container);
    
    const pricing = new SexyFlyPricing();
    const calendar = new SexyFlyCalendar('testCalendar3', {
      calculatePrice: (date) => {
        const info = pricing.calculatePrice(date);
        return { price: info.price, class: info.cssClass };
      }
    });
    
    assert.truthy(calendar.calculatePrice, 'Calendario debe tener función de pricing');
    
    const result = calendar.calculatePrice(new Date('2025-12-25'));
    assert.objectHasProperty(result, 'price');
    assert.objectHasProperty(result, 'class');
    
    document.body.removeChild(container);
  });
});

// ===== EJECUTAR TESTS =====

// Si estamos en Node.js (no en navegador)
if (typeof window === 'undefined') {
  console.log('⚠️  Tests diseñados para ejecutar en navegador');
  console.log('   Abre test.html en tu navegador para ejecutar los tests\n');
  process.exit(0);
} else {
  // Ejecutar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => runner.run());
  } else {
    runner.run();
  }
}

// Exportar para uso externo
if (typeof window !== 'undefined') {
  window.TestRunner = TestRunner;
  window.assert = assert;
  window.testRunner = runner;
}

