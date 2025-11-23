/**
 * SexyFly Calendar System v3.0
 * Sistema de calendario profesional para reservas de piloto comercial
 * Inspirado en Booking.com y sistemas de aerolíneas
 * 
 * @requires config.js - Configuración centralizada
 * @requires pricing.js - Sistema de precios (opcional si se pasa calculatePrice)
 * 
 * @author Ivan Tintore
 * @version 3.0.0
 */

class SexyFlyCalendar {
  /**
   * Inicializar el calendario
   * @param {string} containerId - ID del contenedor HTML
   * @param {Object} options - Opciones de configuración
   * @param {Function} options.onDateSelect - Callback al seleccionar fechas
   * @param {Function} options.onPriceUpdate - Callback al actualizar precios
   * @param {Function} options.calculatePrice - Función de cálculo de precios (opcional)
   */
  constructor(containerId, options = {}) {
    console.log('📅 SexyFlyCalendar v3.0 constructor llamado');
    
    // Verificar que la configuración global existe
    if (typeof SEXYFLY_CONFIG === 'undefined') {
      console.error('❌ SEXYFLY_CONFIG no está definido. Asegúrate de cargar config.js');
      throw new Error('Configuración requerida no encontrada');
    }

    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.error('❌ No se encontró el contenedor:', containerId);
      throw new Error(`Contenedor ${containerId} no encontrado`);
    }
    
    console.log('✅ Contenedor encontrado:', this.container);
    
    // Configuración del calendario (usando config centralizado)
    this.options = {
      ...SEXYFLY_CONFIG.calendar,
      ...options
    };

    // Establecer fechas min/max dinámicamente si no están definidas
    if (!this.options.minDate) {
      this.options.minDate = new Date();
    }
    if (!this.options.maxDate) {
      this.options.maxDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
    }
    
    // Estado del calendario
    this.currentDate = new Date();
    this.selectedDates = {
      departure: null,
      return: null
    };
    this.isSelectingReturn = false;
    this.hoveredDate = null;
    
    // Callbacks
    this.onDateSelect = options.onDateSelect || (() => {});
    this.onPriceUpdate = options.onPriceUpdate || (() => {});
    
    // Función de cálculo de precios (se inyecta externamente)
    // Esto permite desacoplar el calendario del sistema de precios
    this.calculatePrice = options.calculatePrice || null;
    
    console.log('🔧 Inicializando calendario...');
    this.init();
  }

  /**
   * Inicializar el calendario
   * @private
   */
  init() {
    console.log('📅 Iniciando calendario...');
    try {
      console.log('1️⃣ Creando estructura...');
      this.createCalendarStructure();
      
      console.log('2️⃣ Renderizando...');
      this.render();
      
      console.log('3️⃣ Configurando eventos...');
      this.setupEventListeners();
      
      console.log('✅ Calendario inicializado completamente');
    } catch (error) {
      console.error('❌ Error en init():', error);
      throw error;
    }
  }

  /**
   * Crear estructura HTML del calendario
   * @private
   */
  createCalendarStructure() {
    const config = SEXYFLY_CONFIG.pricing;
    
    this.container.innerHTML = `
      <div class="sexyfly-calendar">
        <!-- Header con navegación -->
        <div class="calendar-header">
          <button type="button" class="nav-btn prev-btn" id="prevMonth" aria-label="Semana anterior">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
            </svg>
          </button>
          <div class="calendar-title">
            <h3 id="calendarTitle">${SEXYFLY_CONFIG.i18n.es.selectDates}</h3>
            <p id="calendarSubtitle">${SEXYFLY_CONFIG.i18n.es.departure} y ${SEXYFLY_CONFIG.i18n.es.return}</p>
          </div>
          <button type="button" class="nav-btn next-btn" id="nextMonth" aria-label="Semana siguiente">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
            </svg>
          </button>
        </div>

        <!-- Leyenda de precios -->
        <div class="price-legend">
          <div class="legend-item">
            <span class="legend-color available"></span>
            <span class="legend-text">${config.basePrice}${config.currency} - Reserva anticipada (+7 días)</span>
          </div>
          <div class="legend-item">
            <span class="legend-color medium"></span>
            <span class="legend-text">~${Math.round((config.basePrice + config.urgentPrice) / 2)}${config.currency} - Reserva estándar (3-6 días)</span>
          </div>
          <div class="legend-item">
            <span class="legend-color urgent"></span>
            <span class="legend-text">${config.urgentPrice}${config.currency} - Reserva urgente (<48h)</span>
          </div>
        </div>

        <!-- Días de la semana -->
        <div class="calendar-weekdays">
          <div class="weekday">Lun</div>
          <div class="weekday">Mar</div>
          <div class="weekday">Mié</div>
          <div class="weekday">Jue</div>
          <div class="weekday">Vie</div>
          <div class="weekday">Sáb</div>
          <div class="weekday">Dom</div>
        </div>

        <!-- Grid de días -->
        <div class="calendar-grid" id="calendarGrid">
          <!-- Los días se generan dinámicamente -->
        </div>

        <!-- Resumen de selección -->
        <div class="selection-summary" id="selectionSummary" style="display: none;">
          <div class="summary-content">
            <div class="selected-dates">
              <div class="date-item departure">
                <span class="date-label">🛫 ${SEXYFLY_CONFIG.i18n.es.departure}</span>
                <span class="date-value" id="departureDate">-</span>
                <span class="date-price" id="departurePrice">-</span>
              </div>
              <div class="date-item return">
                <span class="date-label">🛬 ${SEXYFLY_CONFIG.i18n.es.return}</span>
                <span class="date-value" id="returnDate">-</span>
                <span class="date-price" id="returnPrice">-</span>
              </div>
            </div>
            <div class="total-price">
              <span class="total-label">${SEXYFLY_CONFIG.i18n.es.total}:</span>
              <span class="total-value" id="totalPrice">0${SEXYFLY_CONFIG.pricing.currency}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Renderizar todo el calendario
   * @private
   */
  render() {
    // Prevenir loops infinitos
    if (this._rendering) {
      console.warn('⚠️ Render ya en progreso, ignorando...');
      return;
    }
    
    this._rendering = true;
    
    try {
      this.renderCalendarGrid();
      this.updateNavigationButtons();
      this.updateSelectionSummary();
    } finally {
      this._rendering = false;
    }
  }

  /**
   * Renderizar grid de días del calendario
   * @private
   */
  renderCalendarGrid() {
    const grid = document.getElementById('calendarGrid');
    
    // Empezar desde el lunes de la semana actual
    const startDate = new Date(this.currentDate);
    startDate.setHours(0, 0, 0, 0);
    
    // Encontrar el lunes de esta semana
    const dayOfWeek = startDate.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    startDate.setDate(startDate.getDate() + mondayOffset);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let html = '';
    
    // Renderizar semanas configuradas
    for (let week = 0; week < this.options.weeksVisible; week++) {
      for (let day = 0; day < 7; day++) {
        const currentDay = new Date(startDate);
        currentDay.setDate(startDate.getDate() + (week * 7) + day);
        
        const isToday = currentDay.getTime() === today.getTime();
        const isPast = currentDay < today;
        const isWeekend = currentDay.getDay() === 0 || currentDay.getDay() === 6;
        
        // Calcular precio usando la función inyectada o predeterminada
        const priceInfo = this.getPriceInfo(currentDay);
        const dateStr = this.formatDateString(currentDay);
        
        // Estados de selección
        const isDeparture = this.selectedDates.departure && 
          this.formatDateString(this.selectedDates.departure) === dateStr;
        const isReturn = this.selectedDates.return && 
          this.formatDateString(this.selectedDates.return) === dateStr;
        const isInRange = this.isDateInRange(currentDay);
        const isHovered = this.hoveredDate && 
          this.formatDateString(this.hoveredDate) === dateStr;
        
        // Clases CSS
        const classes = [
          'calendar-day',
          isPast ? 'disabled' : 'available',
          priceInfo.class,
          isToday ? 'today' : '',
          isWeekend ? 'weekend' : '',
          isDeparture ? 'selected departure' : '',
          isReturn ? 'selected return' : '',
          isInRange ? 'in-range' : '',
          isHovered ? 'hovered' : ''
        ].filter(Boolean).join(' ');
        
        html += `
          <div class="${classes}" 
               data-date="${dateStr}"
               ${!isPast ? `data-price="${priceInfo.price}"` : ''}
               role="button"
               tabindex="${isPast ? '-1' : '0'}"
               aria-label="${this.formatAccessibleDate(currentDay)}, ${priceInfo.price} euros">
            <div class="day-number">${currentDay.getDate()}</div>
            ${!isPast && this.options.showPrices ? 
              `<div class="day-price">${priceInfo.price}${SEXYFLY_CONFIG.pricing.currency}</div>` : ''
            }
            ${isToday ? `<div class="today-indicator">${SEXYFLY_CONFIG.i18n.es.today}</div>` : ''}
          </div>
        `;
      }
    }
    
    grid.innerHTML = html;
  }

  /**
   * Obtener información de precio para una fecha
   * Usa calculatePrice inyectado o fallback simple
   * @private
   */
  getPriceInfo(date) {
    if (this.calculatePrice && typeof this.calculatePrice === 'function') {
      // Usar función de pricing inyectada
      return this.calculatePrice(date);
    }
    
    // Fallback simple (no debería usarse si pricing.js está disponible)
    console.warn('⚠️ Usando cálculo de precio fallback. Considera inyectar calculatePrice desde SexyFlyPricing');
    
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const config = SEXYFLY_CONFIG.pricing;
    let price = config.basePrice;
    let className = 'available';
    
    if (diffDays >= config.thresholds.standard) {
      price = config.basePrice;
      className = 'available';
    } else if (diffDays >= config.thresholds.urgent) {
      price = Math.round((config.basePrice + config.urgentPrice) / 2);
      className = 'medium';
    } else if (diffDays >= 0) {
      price = config.urgentPrice;
      className = 'urgent';
    }
    
    // Incremento de fin de semana
    if (date.getDay() === 0 || date.getDay() === 6) {
      price += config.surcharges.weekend;
    }
    
    return { price, class: className };
  }

  /**
   * Verificar si una fecha está en el rango de selección
   * @private
   */
  isDateInRange(date) {
    if (!this.selectedDates.departure || !this.isSelectingReturn) return false;
    
    const departure = this.selectedDates.departure;
    const hoveredOrSelected = this.hoveredDate || this.selectedDates.return;
    
    if (!hoveredOrSelected) return false;
    
    const start = departure < hoveredOrSelected ? departure : hoveredOrSelected;
    const end = departure < hoveredOrSelected ? hoveredOrSelected : departure;
    
    return date > start && date < end;
  }

  /**
   * Configurar event listeners usando Event Delegation
   * Event Delegation evita perder listeners después de render()
   * @private
   */
  setupEventListeners() {
    const prevBtn = document.getElementById('prevMonth');
    const nextBtn = document.getElementById('nextMonth');
    
    // Navegación
    prevBtn.addEventListener('click', () => this.previousWeeks());
    nextBtn.addEventListener('click', () => this.nextWeeks());
    
    // EVENT DELEGATION: Adjuntar listener al contenedor padre (NO al grid)
    // El contenedor NO se re-renderiza, solo el grid interno
    // Esto evita perder listeners después de cada render()
    const container = this.container;
    
    // Selección de fechas (click) - EVENT DELEGATION
    container.addEventListener('click', (e) => {
      // Buscar si el click fue en un calendar-day
      const dayElement = e.target.closest('.calendar-day');
      if (!dayElement || dayElement.classList.contains('disabled')) return;
      
      const dateStr = dayElement.dataset.date;
      console.log('👆 Click detectado en:', dateStr, 'Elemento:', dayElement);
      
      const selectedDate = this.parseDate(dateStr);
      console.log('📅 Fecha parseada:', selectedDate);
      
      this.selectDate(selectedDate);
    });

    // Selección de fechas (teclado - accesibilidad)
    container.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        const dayElement = e.target.closest('.calendar-day');
        if (!dayElement || dayElement.classList.contains('disabled')) return;
        
        e.preventDefault();
        const dateStr = dayElement.dataset.date;
        const selectedDate = this.parseDate(dateStr);
        
        this.selectDate(selectedDate);
      }
    });
    
    // NOTA: Hover preview deshabilitado temporalmente para evitar loops
    // Se puede re-habilitar después de optimizar el render
  }

  /**
   * Manejar selección de fecha
   * @private
   */
  selectDate(date) {
    console.log('╔═══════════════════════════════════════════════════');
    console.log('║ 📅 CLICK EN FECHA DETECTADO');
    console.log('╠═══════════════════════════════════════════════════');
    console.log('║ Fecha clickeada:', date);
    console.log('║ Departure actual:', this.selectedDates.departure);
    console.log('║ Return actual:', this.selectedDates.return);
    console.log('║ ¿Seleccionando vuelta?:', this.isSelectingReturn);
    console.log('╚═══════════════════════════════════════════════════');
    
    // Crear una nueva fecha para evitar problemas de referencia
    const selectedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    if (!this.selectedDates.departure) {
      // CASO 1: Primera selección - fecha de ida
      console.log('➡️ CASO 1: Estableciendo fecha de IDA');
      this.selectedDates.departure = selectedDate;
      this.selectedDates.return = null;
      this.isSelectingReturn = true;
      this.updateCalendarTitle(SEXYFLY_CONFIG.i18n.es.selectReturn);
      console.log('✅ Fecha de IDA establecida:', selectedDate);
      console.log('✅ isSelectingReturn:', this.isSelectingReturn);
      
    } else if (this.isSelectingReturn) {
      // CASO 2: Segunda selección - fecha de vuelta
      console.log('➡️ CASO 2: Estableciendo fecha de VUELTA');
      
      if (selectedDate.getTime() === this.selectedDates.departure.getTime()) {
        console.log('⚠️ Misma fecha clickeada, ignorando');
        return;
      }
      
      if (selectedDate < this.selectedDates.departure) {
        // Intercambiar fechas si selecciona una anterior
        console.log('🔄 Intercambiando fechas (seleccionaste fecha anterior)');
        this.selectedDates.return = this.selectedDates.departure;
        this.selectedDates.departure = selectedDate;
      } else {
        // Fecha posterior normal
        console.log('✅ Fecha de VUELTA posterior a IDA');
        this.selectedDates.return = selectedDate;
      }
      
      this.isSelectingReturn = false;
      this.updateCalendarTitle(SEXYFLY_CONFIG.i18n.es.datesSelected);
      
      console.log('✅ AMBAS FECHAS SELECCIONADAS:');
      console.log('   - IDA:', this.selectedDates.departure);
      console.log('   - VUELTA:', this.selectedDates.return);
      console.log('🔔 Llamando callback onDateSelect...');
      
      // Llamar callback
      setTimeout(() => {
        this.onDateSelect({
          departure: this.selectedDates.departure,
          return: this.selectedDates.return
        });
        console.log('✅ Callback ejecutado');
      }, 100);
      
    } else {
      // CASO 3: Reset - empezar de nuevo
      console.log('➡️ CASO 3: RESET - Empezando de nuevo');
      this.selectedDates = { 
        departure: selectedDate, 
        return: null 
      };
      this.isSelectingReturn = true;
      this.updateCalendarTitle(SEXYFLY_CONFIG.i18n.es.selectReturn);
      console.log('✅ Nueva selección iniciada');
    }
    
    console.log('🔄 Renderizando calendario...');
    this.render();
    console.log('✅ Render completado\n');
  }

  /**
   * Actualizar título del calendario
   * @private
   */
  updateCalendarTitle(subtitle) {
    const subtitleElement = document.getElementById('calendarSubtitle');
    if (subtitleElement) {
      subtitleElement.textContent = subtitle;
    }
  }

  /**
   * Actualizar resumen de selección
   * @private
   */
  updateSelectionSummary() {
    const summary = document.getElementById('selectionSummary');
    
    if (this.selectedDates.departure && this.selectedDates.return) {
      const depPriceInfo = this.getPriceInfo(this.selectedDates.departure);
      const retPriceInfo = this.getPriceInfo(this.selectedDates.return);
      const total = depPriceInfo.price + retPriceInfo.price;
      
      document.getElementById('departureDate').textContent = 
        this.formatDisplayDate(this.selectedDates.departure);
      document.getElementById('returnDate').textContent = 
        this.formatDisplayDate(this.selectedDates.return);
      document.getElementById('departurePrice').textContent = 
        `${depPriceInfo.price}${SEXYFLY_CONFIG.pricing.currency}`;
      document.getElementById('returnPrice').textContent = 
        `${retPriceInfo.price}${SEXYFLY_CONFIG.pricing.currency}`;
      document.getElementById('totalPrice').textContent = 
        `${total}${SEXYFLY_CONFIG.pricing.currency}`;
      
      summary.style.display = 'block';
      
      // Callback para actualizar precios
      this.onPriceUpdate({ 
        departure: depPriceInfo.price, 
        return: retPriceInfo.price, 
        total 
      });
    } else {
      summary.style.display = 'none';
    }
  }

  /**
   * Navegar a semanas anteriores
   * @private
   */
  previousWeeks() {
    this.currentDate.setDate(this.currentDate.getDate() - 7);
    this.render();
  }

  /**
   * Navegar a semanas siguientes
   * @private
   */
  nextWeeks() {
    this.currentDate.setDate(this.currentDate.getDate() + 7);
    this.render();
  }

  /**
   * Actualizar estado de botones de navegación
   * @private
   */
  updateNavigationButtons() {
    const prevBtn = document.getElementById('prevMonth');
    const today = new Date();
    
    // Deshabilitar botón anterior si estamos muy cerca del presente
    const weeksBehind = Math.floor((this.currentDate - today) / (7 * 24 * 60 * 60 * 1000));
    prevBtn.disabled = weeksBehind <= 0;
  }

  // ===== UTILIDADES DE FORMATO =====

  /**
   * Formatear fecha como string YYYY-MM-DD
   * @private
   */
  formatDateString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Parsear string YYYY-MM-DD a Date
   * @private
   */
  parseDate(dateStr) {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  /**
   * Formatear fecha para mostrar
   * @private
   */
  formatDisplayDate(date) {
    return date.toLocaleDateString('es-ES', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  }

  /**
   * Formatear fecha accesible para screen readers
   * @private
   */
  formatAccessibleDate(date) {
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  // ===== API PÚBLICA =====

  /**
   * Obtener fechas seleccionadas
   * @public
   * @returns {Object} Objeto con departure y return
   */
  getSelectedDates() {
    return this.selectedDates;
  }

  /**
   * Limpiar selección
   * @public
   */
  clearSelection() {
    this.selectedDates = { departure: null, return: null };
    this.isSelectingReturn = false;
    this.hoveredDate = null;
    this.updateCalendarTitle(SEXYFLY_CONFIG.i18n.es.selectDates);
    this.render();
  }

  /**
   * Establecer fechas programáticamente
   * @public
   * @param {Date} departure - Fecha de ida
   * @param {Date} returnDate - Fecha de vuelta (opcional)
   */
  setDates(departure, returnDate) {
    this.selectedDates = {
      departure: new Date(departure),
      return: returnDate ? new Date(returnDate) : null
    };
    this.isSelectingReturn = !returnDate;
    this.render();
  }
}

// Exportar para uso global
if (typeof window !== 'undefined') {
  window.SexyFlyCalendar = SexyFlyCalendar;
}

// Exportar para módulos ES6
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SexyFlyCalendar;
}
