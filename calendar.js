/**
 * SexyFly Calendar System v2.0
 * Sistema de calendario profesional para reservas de piloto comercial
 * Inspirado en Booking.com y sistemas de aerolíneas
 */

class SexyFlyCalendar {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.options = {
            weeksVisible: 4,
            minDate: new Date(),
            maxDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 año adelante
            language: 'es',
            showPrices: true,
            allowSingleDate: false, // Siempre ida + vuelta
            ...options
        };
        
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
        
        this.init();
    }

    init() {
        this.createCalendarStructure();
        this.render();
        this.setupEventListeners();
    }

    createCalendarStructure() {
        this.container.innerHTML = `
            <div class="sexyfly-calendar">
                <!-- Header con navegación -->
                <div class="calendar-header">
                    <button type="button" class="nav-btn prev-btn" id="prevMonth">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                        </svg>
                    </button>
                    <div class="calendar-title">
                        <h3 id="calendarTitle">Selecciona tus fechas</h3>
                        <p id="calendarSubtitle">Ida y vuelta</p>
                    </div>
                    <button type="button" class="nav-btn next-btn" id="nextMonth">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
                        </svg>
                    </button>
                </div>

                <!-- Leyenda de precios -->
                <div class="price-legend">
                    <div class="legend-item">
                        <span class="legend-color available"></span>
                        <span class="legend-text">500€ - Reserva anticipada (+7 días)</span>
                    </div>
                    <div class="legend-item">
                        <span class="legend-color medium"></span>
                        <span class="legend-text">750€ - Reserva estándar (3-6 días)</span>
                    </div>
                    <div class="legend-item">
                        <span class="legend-color urgent"></span>
                        <span class="legend-text">1000€ - Reserva urgente (<48h)</span>
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
                                <span class="date-label">🛫 Ida</span>
                                <span class="date-value" id="departureDate">-</span>
                                <span class="date-price" id="departurePrice">-</span>
                            </div>
                            <div class="date-item return">
                                <span class="date-label">🛬 Vuelta</span>
                                <span class="date-value" id="returnDate">-</span>
                                <span class="date-price" id="returnPrice">-</span>
                            </div>
                        </div>
                        <div class="total-price">
                            <span class="total-label">Total:</span>
                            <span class="total-value" id="totalPrice">0€</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    render() {
        this.renderCalendarGrid();
        this.updateNavigationButtons();
        this.updateSelectionSummary();
    }

    renderCalendarGrid() {
        const grid = document.getElementById('calendarGrid');
        
        // Empezar desde el lunes de la semana actual
        const startDate = new Date(this.currentDate);
        startDate.setHours(0, 0, 0, 0);
        
        // Encontrar el lunes de esta semana
        const dayOfWeek = startDate.getDay();
        const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Si es domingo, retroceder 6 días
        startDate.setDate(startDate.getDate() + mondayOffset);
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        let html = '';
        
        // Renderizar 4 semanas (28 días) desde el lunes
        for (let week = 0; week < this.options.weeksVisible; week++) {
            for (let day = 0; day < 7; day++) {
                const currentDay = new Date(startDate);
                currentDay.setDate(startDate.getDate() + (week * 7) + day);
                
                const isToday = currentDay.getTime() === today.getTime();
                const isPast = currentDay < today;
                const isWeekend = currentDay.getDay() === 0 || currentDay.getDay() === 6;
                
                // Calcular precio y clase CSS
                const priceInfo = this.calculatePrice(currentDay);
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
                         ${!isPast ? `data-price="${priceInfo.price}"` : ''}>
                        <div class="day-number">${currentDay.getDate()}</div>
                        ${!isPast && this.options.showPrices ? 
                            `<div class="day-price">${priceInfo.price}€</div>` : ''
                        }
                        ${isToday ? '<div class="today-indicator">Hoy</div>' : ''}
                    </div>
                `;
            }
        }
        
        grid.innerHTML = html;
    }

    calculatePrice(date) {
        const now = new Date();
        const diffTime = date - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        // Solo contar días laborables para el cálculo de urgencia
        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
        
        let price = 500;
        let className = 'available';
        
        if (diffDays >= 7) {
            price = 500;
            className = 'available';
        } else if (diffDays >= 3) {
            price = 750;
            className = 'medium';
        } else if (diffDays >= 0) {
            price = 1000;
            className = 'urgent';
        }
        
        // Incremento de fin de semana
        if (isWeekend) {
            price += 100;
        }
        
        return { price, class: className };
    }

    isDateInRange(date) {
        if (!this.selectedDates.departure || !this.isSelectingReturn) return false;
        
        const departure = this.selectedDates.departure;
        const hoveredOrSelected = this.hoveredDate || this.selectedDates.return;
        
        if (!hoveredOrSelected) return false;
        
        const start = departure < hoveredOrSelected ? departure : hoveredOrSelected;
        const end = departure < hoveredOrSelected ? hoveredOrSelected : departure;
        
        return date > start && date < end;
    }

    setupEventListeners() {
        const grid = document.getElementById('calendarGrid');
        const prevBtn = document.getElementById('prevMonth');
        const nextBtn = document.getElementById('nextMonth');
        
        // Navegación
        prevBtn.addEventListener('click', () => this.previousWeeks());
        nextBtn.addEventListener('click', () => this.nextWeeks());
        
        // Selección de fechas
        grid.addEventListener('click', (e) => {
            const dayElement = e.target.closest('.calendar-day');
            if (!dayElement || dayElement.classList.contains('disabled')) return;
            
            const dateStr = dayElement.dataset.date;
            const selectedDate = this.parseDate(dateStr);
            
            this.selectDate(selectedDate);
        });
        
        // Hover para preview de rango
        grid.addEventListener('mouseover', (e) => {
            const dayElement = e.target.closest('.calendar-day');
            if (!dayElement || dayElement.classList.contains('disabled')) return;
            
            if (this.isSelectingReturn && this.selectedDates.departure) {
                const dateStr = dayElement.dataset.date;
                this.hoveredDate = this.parseDate(dateStr);
                this.render();
            }
        });
        
        grid.addEventListener('mouseleave', () => {
            if (this.isSelectingReturn) {
                this.hoveredDate = null;
                this.render();
            }
        });
    }

    selectDate(date) {
        console.log('Fecha seleccionada:', date, 'Estado actual:', this.selectedDates);
        
        // Crear una nueva fecha para evitar problemas de referencia
        const selectedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        
        if (!this.selectedDates.departure) {
            // Primera selección: fecha de ida
            this.selectedDates.departure = selectedDate;
            this.selectedDates.return = null;
            this.isSelectingReturn = true;
            this.updateCalendarTitle('Ahora selecciona fecha de vuelta');
            console.log('Fecha de ida seleccionada:', selectedDate);
        } else if (this.isSelectingReturn) {
            // Segunda selección: fecha de vuelta
            if (selectedDate.getTime() === this.selectedDates.departure.getTime()) {
                // Si hace click en la misma fecha, no hacer nada
                return;
            } else if (selectedDate < this.selectedDates.departure) {
                // Si selecciona una fecha anterior, intercambiar
                this.selectedDates.return = this.selectedDates.departure;
                this.selectedDates.departure = selectedDate;
            } else {
                // Fecha posterior: fecha de vuelta normal
                this.selectedDates.return = selectedDate;
            }
            
            this.isSelectingReturn = false;
            this.updateCalendarTitle('Fechas seleccionadas correctamente');
            
            console.log('Fechas finales:', {
                departure: this.selectedDates.departure,
                return: this.selectedDates.return
            });
            
            // Callback con las fechas seleccionadas
            this.onDateSelect({
                departure: this.selectedDates.departure,
                return: this.selectedDates.return
            });
        } else {
            // Ya hay dos fechas seleccionadas, empezar de nuevo
            this.selectedDates = { 
                departure: selectedDate, 
                return: null 
            };
            this.isSelectingReturn = true;
            this.updateCalendarTitle('Ahora selecciona fecha de vuelta');
            console.log('Reset: Nueva fecha de ida seleccionada:', selectedDate);
        }
        
        this.render();
    }

    updateCalendarTitle(subtitle) {
        document.getElementById('calendarSubtitle').textContent = subtitle;
    }

    updateSelectionSummary() {
        const summary = document.getElementById('selectionSummary');
        
        if (this.selectedDates.departure && this.selectedDates.return) {
            const depPrice = this.calculatePrice(this.selectedDates.departure).price;
            const retPrice = this.calculatePrice(this.selectedDates.return).price;
            const total = depPrice + retPrice;
            
            document.getElementById('departureDate').textContent = 
                this.formatDisplayDate(this.selectedDates.departure);
            document.getElementById('returnDate').textContent = 
                this.formatDisplayDate(this.selectedDates.return);
            document.getElementById('departurePrice').textContent = `${depPrice}€`;
            document.getElementById('returnPrice').textContent = `${retPrice}€`;
            document.getElementById('totalPrice').textContent = `${total}€`;
            
            summary.style.display = 'block';
            
            // Callback para actualizar precios
            this.onPriceUpdate({ departure: depPrice, return: retPrice, total });
        } else {
            summary.style.display = 'none';
        }
    }

    previousWeeks() {
        this.currentDate.setDate(this.currentDate.getDate() - 7);
        this.render();
    }

    nextWeeks() {
        this.currentDate.setDate(this.currentDate.getDate() + 7);
        this.render();
    }

    updateNavigationButtons() {
        const prevBtn = document.getElementById('prevMonth');
        const today = new Date();
        
        // Deshabilitar botón anterior si estamos muy cerca del presente
        const weeksBehind = Math.floor((this.currentDate - today) / (7 * 24 * 60 * 60 * 1000));
        prevBtn.disabled = weeksBehind <= 0;
    }

    // Utilidades de formato
    formatDateString(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    parseDate(dateStr) {
        const [year, month, day] = dateStr.split('-').map(Number);
        return new Date(year, month - 1, day); // month - 1 porque los meses van de 0-11
    }

    formatDisplayDate(date) {
        return date.toLocaleDateString('es-ES', {
            weekday: 'short',
            day: 'numeric',
            month: 'short'
        });
    }

    // API pública
    getSelectedDates() {
        return this.selectedDates;
    }

    clearSelection() {
        this.selectedDates = { departure: null, return: null };
        this.isSelectingReturn = false;
        this.hoveredDate = null;
        this.updateCalendarTitle('Selecciona tus fechas');
        this.render();
    }

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
window.SexyFlyCalendar = SexyFlyCalendar;
