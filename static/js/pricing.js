/**
 * SexyFly Pricing System v3.0
 * Sistema avanzado de precios dinámicos para servicios de piloto comercial
 * @requires config.js - Configuración centralizada
 * 
 * @description
 * Maneja el cálculo de precios basándose en:
 * - Días de antelación (anticipada/estándar/urgente)
 * - Temporada (baja/media/alta)
 * - Días especiales (festivos/fin de semana)
 * - Descuentos por volumen
 * 
 * @author Ivan Tintore
 * @version 3.0.0
 */

class SexyFlyPricing {
  /**
   * Inicializar el sistema de precios
   * @param {Object} customConfig - Configuración personalizada (opcional)
   */
  constructor(customConfig = {}) {
    // Verificar que la configuración global existe
    if (typeof SEXYFLY_CONFIG === 'undefined') {
      console.error('❌ SEXYFLY_CONFIG no está definido. Asegúrate de cargar config.js antes que pricing.js');
      throw new Error('Configuración requerida no encontrada');
    }

    // Usar configuración global como base
    this.config = {
      ...SEXYFLY_CONFIG.pricing,
      holidays: SEXYFLY_CONFIG.holidays,
      ...customConfig
    };

    // Cache para optimizar cálculos repetidos
    this.priceCache = new Map();
    this.seasonCache = new Map();

    console.log('✅ SexyFlyPricing v3.0 inicializado con config centralizado');
  }

  /**
   * Calcular precio para una fecha específica
   * @param {Date} date - Fecha para calcular precio
   * @param {Object} options - Opciones adicionales (totalDays, etc.)
   * @returns {Object} Información completa del precio
   */
  calculatePrice(date, options = {}) {
    const dateKey = this.getDateKey(date);
    
    // Verificar cache
    if (this.priceCache.has(dateKey) && !options.totalDays) {
      return this.priceCache.get(dateKey);
    }
    
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Calcular precio base según antelación
    let basePrice = this.getBasePriceByAnticipation(diffDays);
    
    // Aplicar modificadores (temporada, fin de semana, festivos)
    const modifiers = this.calculateModifiers(date, diffDays, options);
    
    // Precio final
    const finalPrice = Math.round(basePrice * modifiers.multiplier + modifiers.surcharge);
    
    const category = this.getPriceCategory(diffDays);
    
    const result = {
      date: new Date(date),
      price: finalPrice,
      basePrice,
      daysInAdvance: diffDays,
      category: category,
      modifiers,
      breakdown: this.generatePriceBreakdown(basePrice, modifiers, finalPrice, category),
      cssClass: this.getCSSClass(diffDays, finalPrice),
      isWeekend: this.isWeekend(date),
      isHoliday: this.isHoliday(date),
      season: this.getSeason(date)
    };
    
    // Guardar en cache (solo si no hay opciones específicas)
    if (!options.totalDays) {
      this.priceCache.set(dateKey, result);
    }
    
    return result;
  }

  /**
   * Calcular precio base según días de antelación
   * Escala gradual entre urgente y anticipada
   * @private
   */
  getBasePriceByAnticipation(diffDays) {
    const { basePrice, urgentPrice, thresholds } = this.config;

    if (diffDays < thresholds.urgent) {
      // Menos de 2 días = urgente
      return urgentPrice;
    } else if (diffDays < thresholds.standard) {
      // Entre 2 y 7 días = escala gradual
      const factor = (thresholds.standard - diffDays) / 
                    (thresholds.standard - thresholds.urgent);
      return Math.round(basePrice + ((urgentPrice - basePrice) * factor));
    } else {
      // Más de 7 días = anticipada
      return basePrice;
    }
  }

  /**
   * Calcular todos los modificadores de precio
   * @private
   */
  calculateModifiers(date, diffDays, options = {}) {
    let multiplier = 1.0;
    let surcharge = 0;
    const appliedModifiers = [];
    
    // 1. Temporada (multiplicador)
    const season = this.getSeason(date);
    const seasonMultiplier = this.config.seasonMultipliers[season];
    if (seasonMultiplier !== 1.0) {
      multiplier *= seasonMultiplier;
      appliedModifiers.push({
        type: 'season',
        name: `Temporada ${season}`,
        factor: seasonMultiplier,
        description: `${(seasonMultiplier - 1) * 100 > 0 ? '+' : ''}${((seasonMultiplier - 1) * 100).toFixed(0)}%`
      });
    }
    
    // 2. Fin de semana (recargo fijo)
    if (this.isWeekend(date)) {
      surcharge += this.config.surcharges.weekend;
      appliedModifiers.push({
        type: 'weekend',
        name: 'Recargo fin de semana',
        amount: this.config.surcharges.weekend,
        description: `+${this.config.surcharges.weekend}€`
      });
    }
    
    // 3. Días festivos (recargo fijo)
    if (this.isHoliday(date)) {
      surcharge += this.config.surcharges.holiday;
      appliedModifiers.push({
        type: 'holiday',
        name: 'Recargo día festivo',
        amount: this.config.surcharges.holiday,
        description: `+${this.config.surcharges.holiday}€`
      });
    }
    
    // 4. Descuento por volumen (si aplica)
    if (options.totalDays) {
      const discount = this.getVolumeDiscount(options.totalDays);
      if (discount > 0) {
        multiplier *= (1 - discount);
        appliedModifiers.push({
          type: 'volume',
          name: 'Descuento por volumen',
          factor: (1 - discount),
          description: `-${(discount * 100).toFixed(0)}%`
        });
      }
    }
    
    return {
      multiplier,
      surcharge,
      applied: appliedModifiers
    };
  }

  /**
   * Obtener descuento por volumen según días totales
   * @private
   */
  getVolumeDiscount(totalDays) {
    const thresholds = Object.keys(this.config.volumeDiscounts)
      .map(Number)
      .sort((a, b) => b - a); // Ordenar descendente
    
    for (const threshold of thresholds) {
      if (totalDays >= threshold) {
        return this.config.volumeDiscounts[threshold];
      }
    }
    
    return 0;
  }

  /**
   * Determinar temporada según la fecha
   * @private
   */
  getSeason(date) {
    const dateKey = this.getDateKey(date);
    
    if (this.seasonCache.has(dateKey)) {
      return this.seasonCache.get(dateKey);
    }
    
    const month = date.getMonth() + 1; // 1-12
    
    let season;
    if (month >= 6 && month <= 8) {
      season = 'high';        // Jun-Ago: Temporada alta
    } else if (month >= 11 || month <= 2) {
      season = 'low';         // Nov-Feb: Temporada baja
    } else {
      season = 'medium';      // Mar-May, Sep-Oct: Temporada media
    }
    
    this.seasonCache.set(dateKey, season);
    return season;
  }

  /**
   * Verificar si es fin de semana
   * @private
   */
  isWeekend(date) {
    const day = date.getDay();
    return day === 0 || day === 6; // Domingo o Sábado
  }

  /**
   * Verificar si es día festivo
   * @private
   */
  isHoliday(date) {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateString = `${month}-${day}`;
    
    return this.config.holidays.includes(dateString);
  }

  /**
   * Obtener categoría de precio para UI
   * @private
   */
  getPriceCategory(diffDays) {
    const { thresholds } = this.config;
    
    if (diffDays < thresholds.urgent) {
      return 'urgent';
    } else if (diffDays < thresholds.standard) {
      return 'standard';
    } else {
      return 'advance';
    }
  }

  /**
   * Obtener clase CSS según categoría de precio
   * @private
   */
  getCSSClass(diffDays, finalPrice) {
    const { thresholds } = this.config;
    
    if (diffDays < thresholds.urgent) {
      return 'urgent';
    } else if (diffDays < thresholds.standard) {
      return 'medium';
    } else {
      return 'available';
    }
  }

  /**
   * Generar desglose detallado del precio
   * @private
   */
  generatePriceBreakdown(basePrice, modifiers, finalPrice, category) {
    // Determinar el concepto del precio base según la categoría
    let baseConcept = 'Precio base';
    if (category === 'urgent') {
      baseConcept = 'Reserva urgente (<48h)';
    } else if (category === 'standard') {
      baseConcept = 'Reserva estándar (2-6 días)';
    } else {
      baseConcept = 'Reserva anticipada (+7 días)';
    }
    
    const breakdown = [
      {
        concept: baseConcept,
        amount: basePrice,
        type: 'base'
      }
    ];
    
    // Agregar modificadores aplicados
    modifiers.applied.forEach(modifier => {
      if (modifier.type === 'season' || modifier.type === 'volume') {
        // Modificadores multiplicativos
        const amount = Math.round(basePrice * (modifier.factor - 1));
        breakdown.push({
          concept: modifier.name,
          amount: amount,
          type: 'multiplier',
          description: modifier.description
        });
      } else {
        // Modificadores aditivos
        breakdown.push({
          concept: modifier.name,
          amount: modifier.amount,
          type: 'surcharge',
          description: modifier.description
        });
      }
    });
    
    breakdown.push({
      concept: 'Total',
      amount: finalPrice,
      type: 'total'
    });
    
    return breakdown;
  }

  /**
   * Calcular precio total para múltiples fechas
   * @param {Date[]} dates - Array de fechas
   * @param {Object} options - Opciones adicionales
   * @returns {Object} Información del precio total
   */
  calculateTotalPrice(dates, options = {}) {
    if (!Array.isArray(dates) || dates.length === 0) {
      return null;
    }
    
    const calculations = dates.map(date => 
      this.calculatePrice(date, { ...options, totalDays: dates.length })
    );
    
    const subtotal = calculations.reduce((sum, calc) => sum + calc.price, 0);
    
    // Aplicar descuentos adicionales si es necesario
    let total = subtotal;
    const appliedDiscounts = [];
    
    // Descuento por reserva múltiple (ejemplo)
    if (dates.length >= 2 && options.applyMultiDayDiscount) {
      const discount = Math.round(subtotal * 0.05); // 5% descuento
      total -= discount;
      appliedDiscounts.push({
        name: 'Descuento reserva múltiple',
        amount: -discount,
        description: '-5%'
      });
    }
    
    return {
      dates: dates.map(d => new Date(d)),
      calculations,
      subtotal,
      total,
      appliedDiscounts,
      savings: subtotal - total,
      averagePerDay: Math.round(total / dates.length)
    };
  }

  /**
   * Obtener información de precios para un rango de fechas
   * @param {Date} startDate - Fecha inicio
   * @param {Date} endDate - Fecha fin
   * @param {Object} options - Opciones adicionales
   * @returns {Object} Información del rango de precios
   */
  getPriceRange(startDate, endDate, options = {}) {
    const prices = [];
    const current = new Date(startDate);
    
    while (current <= endDate) {
      prices.push(this.calculatePrice(current, options));
      current.setDate(current.getDate() + 1);
    }
    
    return {
      prices,
      min: Math.min(...prices.map(p => p.price)),
      max: Math.max(...prices.map(p => p.price)),
      average: Math.round(prices.reduce((sum, p) => sum + p.price, 0) / prices.length)
    };
  }

  /**
   * Obtener estadísticas de precios
   * @param {Date} startDate - Fecha inicio
   * @param {Date} endDate - Fecha fin
   * @returns {Object} Estadísticas detalladas
   */
  getStats(startDate, endDate) {
    const range = this.getPriceRange(startDate, endDate);
    
    const byCategory = {
      advance: range.prices.filter(p => p.category === 'advance'),
      standard: range.prices.filter(p => p.category === 'standard'),
      urgent: range.prices.filter(p => p.category === 'urgent')
    };
    
    return {
      totalDays: range.prices.length,
      priceRange: { min: range.min, max: range.max, average: range.average },
      byCategory: {
        advance: { count: byCategory.advance.length, avgPrice: this.getAverage(byCategory.advance) },
        standard: { count: byCategory.standard.length, avgPrice: this.getAverage(byCategory.standard) },
        urgent: { count: byCategory.urgent.length, avgPrice: this.getAverage(byCategory.urgent) }
      },
      weekends: range.prices.filter(p => p.isWeekend).length,
      holidays: range.prices.filter(p => p.isHoliday).length
    };
  }

  /**
   * Calcular promedio de precios
   * @private
   */
  getAverage(priceArray) {
    if (priceArray.length === 0) return 0;
    return Math.round(priceArray.reduce((sum, p) => sum + p.price, 0) / priceArray.length);
  }

  /**
   * Obtener clave única para fecha (para cache)
   * @private
   */
  getDateKey(date) {
    return date.toISOString().split('T')[0];
  }

  /**
   * Limpiar cache (útil para actualizaciones)
   * @public
   */
  clearCache() {
    this.priceCache.clear();
    this.seasonCache.clear();
  }

  /**
   * Actualizar configuración
   * @param {Object} newConfig - Nueva configuración
   * @public
   */
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    this.clearCache(); // Limpiar cache al cambiar configuración
  }
}

// Exportar para uso global
if (typeof window !== 'undefined') {
  window.SexyFlyPricing = SexyFlyPricing;
}

// Exportar para módulos ES6 (si se usa build system futuro)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SexyFlyPricing;
}
