/**
 * SexyFly Pricing System v2.0
 * Sistema avanzado de precios dinámicos para servicios de piloto comercial
 * Incluye políticas de temporada, días laborables, y descuentos por volumen
 */

class SexyFlyPricing {
    constructor(options = {}) {
        this.config = {
            // Precios base
            basePrice: 500,
            urgentPrice: 1000,
            
            // Factores de precio
            weekendSurcharge: 100,      // Recargo fin de semana
            holidaySurcharge: 200,      // Recargo días festivos
            seasonMultipliers: {
                low: 0.9,               // Temporada baja (Nov-Feb)
                medium: 1.0,            // Temporada media (Mar-May, Sep-Oct)
                high: 1.2               // Temporada alta (Jun-Ago)
            },
            
            // Umbrales de tiempo
            anticipationThresholds: {
                urgent: 2,              // <2 días = urgente
                standard: 7,            // 2-6 días = estándar
                advance: 30             // >7 días = anticipada
            },
            
            // Descuentos por volumen (días múltiples)
            volumeDiscounts: {
                3: 0.05,                // 5% descuento para 3+ días
                7: 0.10,                // 10% descuento para 7+ días
                14: 0.15                // 15% descuento para 14+ días
            },
            
            // Días festivos españoles (formato MM-DD)
            holidays: [
                '01-01', '01-06',       // Año Nuevo, Reyes
                '05-01',                // Día del Trabajo
                '08-15',                // Asunción
                '10-12',                // Día de la Hispanidad
                '11-01',                // Todos los Santos
                '12-06', '12-08', '12-25' // Constitución, Inmaculada, Navidad
            ],
            
            ...options
        };
        
        // Cache para optimizar cálculos
        this.priceCache = new Map();
        this.seasonCache = new Map();
    }

    /**
     * Calcular precio para una fecha específica
     * @param {Date} date - Fecha para calcular precio
     * @param {Object} options - Opciones adicionales
     * @returns {Object} Información completa del precio
     */
    calculatePrice(date, options = {}) {
        const dateKey = this.getDateKey(date);
        
        // Verificar cache
        if (this.priceCache.has(dateKey)) {
            return this.priceCache.get(dateKey);
        }
        
        const now = new Date();
        const diffTime = date - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        // Calcular precio base según antelación
        let basePrice = this.getBasePriceByAnticipation(diffDays);
        
        // Aplicar modificadores
        const modifiers = this.calculateModifiers(date, diffDays, options);
        
        // Precio final
        const finalPrice = Math.round(basePrice * modifiers.multiplier + modifiers.surcharge);
        
        const result = {
            date: new Date(date),
            price: finalPrice,
            basePrice,
            daysInAdvance: diffDays,
            category: this.getPriceCategory(diffDays),
            modifiers,
            breakdown: this.generatePriceBreakdown(basePrice, modifiers, finalPrice),
            cssClass: this.getCSSClass(diffDays, finalPrice),
            isWeekend: this.isWeekend(date),
            isHoliday: this.isHoliday(date),
            season: this.getSeason(date)
        };
        
        // Guardar en cache
        this.priceCache.set(dateKey, result);
        
        return result;
    }

    /**
     * Calcular precio base según días de antelación
     */
    getBasePriceByAnticipation(diffDays) {
        if (diffDays < this.config.anticipationThresholds.urgent) {
            return this.config.urgentPrice;
        } else if (diffDays < this.config.anticipationThresholds.standard) {
            // Precio gradual entre urgente y estándar
            const factor = (this.config.anticipationThresholds.standard - diffDays) / 
                          (this.config.anticipationThresholds.standard - this.config.anticipationThresholds.urgent);
            return this.config.basePrice + ((this.config.urgentPrice - this.config.basePrice) * factor);
        } else {
            return this.config.basePrice;
        }
    }

    /**
     * Calcular todos los modificadores de precio
     */
    calculateModifiers(date, diffDays, options = {}) {
        let multiplier = 1.0;
        let surcharge = 0;
        const appliedModifiers = [];
        
        // Temporada
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
        
        // Fin de semana
        if (this.isWeekend(date)) {
            surcharge += this.config.weekendSurcharge;
            appliedModifiers.push({
                type: 'weekend',
                name: 'Recargo fin de semana',
                amount: this.config.weekendSurcharge,
                description: `+${this.config.weekendSurcharge}€`
            });
        }
        
        // Días festivos
        if (this.isHoliday(date)) {
            surcharge += this.config.holidaySurcharge;
            appliedModifiers.push({
                type: 'holiday',
                name: 'Recargo día festivo',
                amount: this.config.holidaySurcharge,
                description: `+${this.config.holidaySurcharge}€`
            });
        }
        
        // Descuento por volumen (si aplica)
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
     */
    isWeekend(date) {
        const day = date.getDay();
        return day === 0 || day === 6; // Domingo o Sábado
    }

    /**
     * Verificar si es día festivo
     */
    isHoliday(date) {
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const dateString = `${month}-${day}`;
        
        return this.config.holidays.includes(dateString);
    }

    /**
     * Obtener categoría de precio para UI
     */
    getPriceCategory(diffDays) {
        if (diffDays < this.config.anticipationThresholds.urgent) {
            return 'urgent';
        } else if (diffDays < this.config.anticipationThresholds.standard) {
            return 'standard';
        } else {
            return 'advance';
        }
    }

    /**
     * Obtener clase CSS según precio
     */
    getCSSClass(diffDays, finalPrice) {
        if (diffDays < this.config.anticipationThresholds.urgent) {
            return 'urgent';
        } else if (diffDays < this.config.anticipationThresholds.standard) {
            return 'medium';
        } else {
            return 'available';
        }
    }

    /**
     * Generar desglose detallado del precio
     */
    generatePriceBreakdown(basePrice, modifiers, finalPrice) {
        const breakdown = [
            {
                concept: 'Precio base',
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
     * Utilidades
     */
    getDateKey(date) {
        return date.toISOString().split('T')[0];
    }

    /**
     * Limpiar cache (útil para actualizaciones)
     */
    clearCache() {
        this.priceCache.clear();
        this.seasonCache.clear();
    }

    /**
     * Actualizar configuración
     */
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        this.clearCache(); // Limpiar cache al cambiar configuración
    }

    /**
     * Obtener estadísticas de precios
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

    getAverage(priceArray) {
        if (priceArray.length === 0) return 0;
        return Math.round(priceArray.reduce((sum, p) => sum + p.price, 0) / priceArray.length);
    }
}

// Exportar para uso global
window.SexyFlyPricing = SexyFlyPricing;
