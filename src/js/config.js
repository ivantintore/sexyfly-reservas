/**
 * SexyFly - Configuración Central
 * @version 3.0.0
 * @description Configuración unificada del sistema de reservas
 * ÚNICA FUENTE DE VERDAD para precios, constantes y configuración
 */

const SEXYFLY_CONFIG = {
  // ===== INFORMACIÓN DE LA EMPRESA =====
  company: {
    name: 'SexyFly',
    legalName: 'KYTO SL',
    website: 'https://sexyfly.es',
    email: 'ivan@tintore.es',
    phone: '+34 XXX XXX XXX',
    address: 'España',
  },

  // ===== PRECIOS BASE (ÚNICA FUENTE DE VERDAD) =====
  pricing: {
    // Precios base por antelación
    basePrice: 500,           // Reserva anticipada (+7 días)
    urgentPrice: 1000,        // Reserva urgente (<48h)
    
    // Recargos adicionales
    surcharges: {
      weekend: 200,           // Fin de semana (Sáb/Dom)
      holiday: 200,           // Días festivos nacionales
      overnight: 0,           // Pernocta (gastos incluidos en precio base)
    },
    
    // Umbrales de tiempo (en días)
    thresholds: {
      urgent: 2,              // <2 días = urgente (1000€)
      standard: 7,            // 2-6 días = estándar (gradual)
      advance: 30,            // >7 días = anticipada (500€)
    },
    
    // Multiplicadores de temporada
    seasonMultipliers: {
      low: 0.9,               // Nov-Feb (10% descuento)
      medium: 1.0,            // Mar-May, Sep-Oct (precio normal)
      high: 1.2,              // Jun-Ago (20% recargo)
    },
    
    // Descuentos por volumen (días consecutivos)
    volumeDiscounts: {
      3: 0.05,                // 5% para 3+ días
      7: 0.10,                // 10% para 7+ días
      14: 0.15,               // 15% para 14+ días
    },
    
    // Moneda
    currency: '€',
    currencyCode: 'EUR',
  },

  // ===== CALENDARIO =====
  calendar: {
    weeksVisible: 4,                    // Semanas mostradas
    language: 'es',
    showPrices: true,
    allowSingleDate: false,             // Siempre ida + vuelta
    minDate: null,                      // Se calcula dinámicamente (hoy)
    maxDate: null,                      // Se calcula dinámicamente (1 año)
    firstDayOfWeek: 1,                  // 0=Domingo, 1=Lunes
  },

  // ===== DÍAS FESTIVOS ESPAÑOLES =====
  // Festivos nacionales (aplicables en toda España)
  // Formato: 'MM-DD' para compatibilidad con cualquier año
  holidays: [
    '01-01', // Año Nuevo
    '01-06', // Reyes Magos
    '05-01', // Día del Trabajo
    '08-15', // Asunción de la Virgen
    '10-12', // Fiesta Nacional de España
    '11-01', // Todos los Santos
    '12-06', // Día de la Constitución Española
    '12-08', // Inmaculada Concepción
    '12-25', // Navidad
  ],

  // Festivos detallados (con información adicional)
  // Útil para mostrar tooltips o filtrar por región
  holidaysDetailed: [
    { date: '01-01', name: 'Año Nuevo', type: 'nacional', region: 'todas' },
    { date: '01-06', name: 'Reyes Magos', type: 'nacional', region: 'todas' },
    { date: '05-01', name: 'Día del Trabajo', type: 'nacional', region: 'todas' },
    { date: '08-15', name: 'Asunción de la Virgen', type: 'nacional', region: 'todas' },
    { date: '10-12', name: 'Fiesta Nacional de España', type: 'nacional', region: 'todas' },
    { date: '11-01', name: 'Todos los Santos', type: 'nacional', region: 'todas' },
    { date: '12-06', name: 'Día de la Constitución Española', type: 'nacional', region: 'todas' },
    { date: '12-08', name: 'Inmaculada Concepción', type: 'nacional', region: 'todas' },
    { date: '12-25', name: 'Navidad', type: 'nacional', region: 'todas' },
    // Añadir festivos autonómicos aquí si es necesario
    // { date: '04-23', name: 'Sant Jordi', type: 'autonomico', region: 'catalunya' },
    // { date: '03-01', name: 'Día de las Islas Baleares', type: 'autonomico', region: 'baleares' },
  ],

  // ===== VALIDACIÓN DE FORMULARIOS =====
  validation: {
    icao: {
      length: 4,
      pattern: /^[A-Z]{4}$/,
      examples: ['LELL', 'LEBL', 'LEMD', 'LEZL'],
    },
    client: {
      nameMinLength: 3,
      nameMaxLength: 100,
      phonePattern: /^(\+34|0034|34)?[ -]?[6-9]\d{2}[ -]?\d{3}[ -]?\d{3}$/,
      emailPattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    reserva: {
      maxFlights: 10,
      minAdvanceHours: 24,              // Mínimo 24h de antelación
    },
  },

  // ===== POLÍTICA DE CANCELACIÓN =====
  cancellationPolicy: [
    {
      minDays: 5,
      refundPercentage: 100,
      description: 'Cancelación gratuita',
    },
    {
      minDays: 2,
      maxDays: 4,
      refundPercentage: 50,
      description: '50% del importe',
    },
    {
      minDays: 0,
      maxDays: 1,
      refundPercentage: 0,
      description: 'No reembolsable',
    },
  ],

  // ===== CONFIGURACIÓN DE UI =====
  ui: {
    colors: {
      primary: '#1E40AF',
      secondary: '#3B82F6',
      success: '#10B981',
      warning: '#F59E0B',
      danger: '#EF4444',
      neutral: '#6B7280',
    },
    transitions: {
      fast: '0.2s',
      normal: '0.3s',
      slow: '0.5s',
    },
    breakpoints: {
      mobile: '480px',
      tablet: '768px',
      desktop: '1024px',
      wide: '1200px',
    },
  },

  // ===== INTEGRACIONES =====
  integrations: {
    tpv: {
      enabled: true,
      provider: 'MAITSA',
      testMode: true,                   // Cambiar a false en producción
      merchantId: '340829647',
    },
    email: {
      provider: 'custom',               // Implementar según necesidad
      notificationEmail: 'ivan@tintore.es',
    },
    analytics: {
      enabled: false,
      googleAnalyticsId: null,
    },
  },

  // ===== TEXTOS Y TRADUCCIONES =====
  i18n: {
    es: {
      selectDates: 'Selecciona tus fechas',
      selectReturn: 'Ahora selecciona fecha de vuelta',
      datesSelected: '¡Fechas seleccionadas!',
      departure: 'Ida',
      return: 'Vuelta',
      total: 'Total',
      pricePerDay: 'por día',
      acceptTerms: 'Acepto los términos y condiciones',
      reserveNow: 'Reservar Piloto - Pagar Ahora',
      processing: 'Procesando reserva...',
      today: 'Hoy',
      weekend: 'Fin de semana',
      holiday: 'Festivo',
      errors: {
        selectDates: 'Por favor, selecciona las fechas de ida y vuelta en el calendario.',
        invalidICAO: 'Por favor, introduce un código OACI válido (4 letras).',
        sameICAO: 'El aeropuerto de origen y destino no pueden ser el mismo.',
        missingTime: 'Por favor, especifica las horas de salida y regreso.',
        missingName: 'Por favor, introduce tu nombre completo.',
        invalidEmail: 'Por favor, introduce un email válido.',
        missingPhone: 'Por favor, introduce tu teléfono.',
        acceptTermsRequired: 'Debe aceptar los términos y condiciones para continuar',
      },
      success: {
        bookingProcessed: '✅ Reserva procesada correctamente!',
        emailSent: '📧 Email de confirmación enviado',
        redirecting: 'Serás redirigido al sistema de pago...',
      },
    },
  },

  // ===== CONFIGURACIÓN DE DESARROLLO =====
  dev: {
    debug: true,                        // Activar logs detallados
    mockPayment: true,                  // Simular pagos en desarrollo
    autoFillForm: false,                // Rellenar formulario automáticamente (testing)
  },

  // ===== API Y ENDPOINTS =====
  api: {
    baseUrl: window.location.origin,
    endpoints: {
      booking: '/api/booking',
      payment: '/api/payment',
      availability: '/api/availability',
    },
    timeout: 30000,                     // 30 segundos
  },

  // ===== VERSIÓN =====
  version: '3.0.0',
  buildDate: new Date().toISOString(),
};

// Congelar el objeto para prevenir modificaciones accidentales
Object.freeze(SEXYFLY_CONFIG);
Object.freeze(SEXYFLY_CONFIG.pricing);
Object.freeze(SEXYFLY_CONFIG.validation);
Object.freeze(SEXYFLY_CONFIG.cancellationPolicy);

// Exportar para uso global
if (typeof window !== 'undefined') {
  window.SEXYFLY_CONFIG = SEXYFLY_CONFIG;
}

// Exportar para módulos ES6 (si se usa build system futuro)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SEXYFLY_CONFIG;
}

console.log(`✅ SexyFly Config v${SEXYFLY_CONFIG.version} cargado correctamente`);

