/**
 * SexyFly - Aplicación Principal
 * @version 3.0.0
 * @description Lógica principal del sistema de reservas
 * @requires config.js
 * @requires pricing.js
 * @requires calendar.js
 * 
 * @author Ivan Tintore
 */

'use strict';

/**
 * Clase principal de la aplicación SexyFly
 */
class SexyFlyApp {
  constructor() {
    if (SEXYFLY_CONFIG.dev.debug) {
      console.log('🚀 Inicializando SexyFlyApp v' + SEXYFLY_CONFIG.version);
    }
    
    // Verificar dependencias
    this.checkDependencies();
    
    // Inicializar módulos
    this.pricing = null;
    this.calendar = null;
    this.versionManager = null;
    
    // Estado de la aplicación
    this.selectedDates = null;
    this.totalPrice = 0;
    
    // Referencias al DOM
    this.dom = {};
    
    this.init();
  }

  /**
   * Verificar que todas las dependencias están cargadas
   * @private
   */
  checkDependencies() {
    const required = {
      'SEXYFLY_CONFIG': typeof SEXYFLY_CONFIG !== 'undefined',
      'SexyFlyPricing': typeof SexyFlyPricing !== 'undefined',
      'SexyFlyCalendar': typeof SexyFlyCalendar !== 'undefined'
    };

    const missing = Object.keys(required).filter(key => !required[key]);
    
    if (missing.length > 0) {
      const error = `❌ Dependencias faltantes: ${missing.join(', ')}`;
      console.error(error);
      this.showError('Error al cargar la aplicación. Por favor, recarga la página.');
      throw new Error(error);
    }

    if (SEXYFLY_CONFIG.dev.debug) {
      console.log('✅ Todas las dependencias cargadas correctamente');
    }
  }

  /**
   * Inicializar la aplicación
   * @private
   */
  init() {
    try {
      if (SEXYFLY_CONFIG.dev.debug) console.log('🔧 Paso 1: Inicializando DOM...');
      this.initDOM();
      
      if (SEXYFLY_CONFIG.dev.debug) console.log('🔧 Paso 2: Actualizando precios en UI...');
      this.updatePricingInfo();
      
      if (SEXYFLY_CONFIG.dev.debug) console.log('🔧 Paso 3: Inicializando sistema de precios...');
      this.initializePricing();
      
      if (SEXYFLY_CONFIG.dev.debug) console.log('🔧 Paso 4: Inicializando calendario...');
      this.initializeCalendar();
      
      if (SEXYFLY_CONFIG.dev.debug) console.log('🔧 Paso 5: Inicializando gestor de versiones...');
      this.initializeVersionManager();
      
      if (SEXYFLY_CONFIG.dev.debug) console.log('🔧 Paso 6: Configurando validación de formulario...');
      this.setupFormValidation();
      
      if (SEXYFLY_CONFIG.dev.debug) console.log('🔧 Paso 7: Configurando inputs ICAO...');
      this.setupICAOInputs();
      
      if (SEXYFLY_CONFIG.dev.debug) {
        console.log('✅ SexyFlyApp inicializado completamente');
      }
    } catch (error) {
      console.error('❌ ERROR CRÍTICO en inicialización:', error);
      console.error('   Stack trace:', error.stack);
      console.error('   Mensaje:', error.message);
      
      // Mostrar en la UI también
      alert(`❌ ERROR AL INICIALIZAR:\n\n${error.message}\n\nRevisa la consola (F12) para más detalles.`);
      
      // Re-lanzar el error para que se vea en consola
      throw error;
    }
  }

  /**
   * Inicializar referencias al DOM
   * @private
   */
  initDOM() {
    this.dom = {
      form: document.getElementById('bookingForm'),
      submitBtn: document.getElementById('submitBtn'),
      loadingDiv: document.getElementById('loadingDiv'),
      flightDetailsSection: document.getElementById('flightDetailsSection'),
      overnightSection: document.getElementById('overnightSection'),
      totalFlights: document.getElementById('totalFlights'),
      totalFlightsPrice: document.getElementById('totalFlightsPrice'),
      totalBreakdown: document.getElementById('totalBreakdown'),
      
      // Campos del formulario
      originICAO: document.getElementById('originICAO'),
      destinationICAO: document.getElementById('destinationICAO'),
      departureTime: document.getElementById('departureTime'),
      returnTime: document.getElementById('returnTime'),
      clientName: document.getElementById('clientName'),
      clientEmail: document.getElementById('clientEmail'),
      clientPhone: document.getElementById('clientPhone'),
      additionalInfo: document.getElementById('additionalInfo'),
      acceptTerms: document.getElementById('acceptTerms'),
      overnight: document.getElementById('overnight')
    };

    // Verificar elementos críticos
    const critical = ['form', 'submitBtn', 'loadingDiv'];
    const missing = critical.filter(key => !this.dom[key]);
    
    if (missing.length > 0) {
      throw new Error(`Elementos DOM críticos no encontrados: ${missing.join(', ')}`);
    }
  }

  /**
   * Actualizar información de precios en la UI
   * @private
   */
  updatePricingInfo() {
    const priceAnticipada = document.getElementById('priceAnticipada');
    const priceUrgente = document.getElementById('priceUrgente');
    
    if (priceAnticipada) {
      priceAnticipada.textContent = `${SEXYFLY_CONFIG.pricing.basePrice}${SEXYFLY_CONFIG.pricing.currency}`;
    }
    if (priceUrgente) {
      priceUrgente.textContent = `${SEXYFLY_CONFIG.pricing.urgentPrice}${SEXYFLY_CONFIG.pricing.currency}`;
    }
    
    // Cargar festivos nacionales
    this.loadHolidaysList();
  }

  /**
   * Cargar listado de festivos nacionales en la UI
   * @private
   */
  loadHolidaysList() {
    const holidaysList = document.getElementById('holidays-list');
    if (!holidaysList) return;

    const holidays = SEXYFLY_CONFIG.holidaysDetailed || [];
    
    let html = '';
    holidays.forEach(holiday => {
      // Formatear la fecha (MM-DD a "DD MMM")
      const [month, day] = holiday.date.split('-');
      const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 
                          'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      const monthName = monthNames[parseInt(month) - 1];
      
      html += `<div style="padding: 2px 0;">• ${day} ${monthName} - ${holiday.name}</div>`;
    });
    
    holidaysList.innerHTML = html;
  }

  /**
   * Inicializar sistema de precios
   * @private
   */
  initializePricing() {
    try {
      this.pricing = new SexyFlyPricing();
      if (SEXYFLY_CONFIG.dev.debug) {
        console.log('✅ Sistema de precios inicializado');
      }
    } catch (error) {
      console.error('❌ Error inicializando pricing:', error);
      throw error;
    }
  }

  /**
   * Inicializar calendario
   * @private
   */
  initializeCalendar() {
    try {
      this.calendar = new SexyFlyCalendar('flightCalendar', {
        onDateSelect: (dates) => this.handleDateSelection(dates),
        onPriceUpdate: (prices) => this.handlePriceUpdate(prices),
        calculatePrice: (date) => {
          const priceInfo = this.pricing.calculatePrice(date);
          return {
            price: priceInfo.price,
            class: priceInfo.cssClass,
            breakdown: priceInfo.breakdown,  // ← Necesario para tooltips
            basePrice: priceInfo.basePrice,
            modifiers: priceInfo.modifiers,
            isWeekend: priceInfo.isWeekend,
            isHoliday: priceInfo.isHoliday
          };
        }
      });

      if (SEXYFLY_CONFIG.dev.debug) {
        console.log('✅ Calendario inicializado');
      }
    } catch (error) {
      console.error('❌ Error inicializando calendario:', error);
      throw error;
    }
  }

  /**
   * Inicializar sistema de versiones
   * @private
   */
  initializeVersionManager() {
    try {
      this.versionManager = new VersionManager();
      if (SEXYFLY_CONFIG.dev.debug) {
        console.log('✅ Sistema de versiones inicializado');
      }
    } catch (error) {
      console.warn('⚠️ Error inicializando versiones (no crítico):', error);
    }
  }

  /**
   * Manejar selección de fechas
   * @private
   */
  handleDateSelection(dates) {
    this.selectedDates = dates;
    
    // Mostrar sección de detalles de vuelo
    this.dom.flightDetailsSection.style.display = 'block';
    
    // Mostrar sección de pernocta si es necesario
    this.updateOvernightVisibility(dates);
    
    // Scroll suave a detalles
    this.dom.flightDetailsSection.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'nearest' 
    });

    if (SEXYFLY_CONFIG.dev.debug) {
      console.log('📅 Fechas seleccionadas:', dates);
    }
  }

  /**
   * Manejar actualización de precios
   * @private
   */
  handlePriceUpdate(prices) {
    this.totalPrice = prices.total;
    
    // Mostrar sección de total
    this.dom.totalFlights.style.display = 'block';
    
    // Actualizar textos
    this.dom.totalFlightsPrice.textContent = 
      `${SEXYFLY_CONFIG.i18n.es.total}: ${prices.total}${SEXYFLY_CONFIG.pricing.currency}`;
    this.dom.totalBreakdown.innerHTML = `
      🛫 ${SEXYFLY_CONFIG.i18n.es.departure}: ${prices.departure}${SEXYFLY_CONFIG.pricing.currency} • 
      🛬 ${SEXYFLY_CONFIG.i18n.es.return}: ${prices.return}${SEXYFLY_CONFIG.pricing.currency}
    `;

    if (SEXYFLY_CONFIG.dev.debug) {
      console.log('💰 Precios actualizados:', prices);
    }
  }

  /**
   * Actualizar visibilidad de sección de pernocta
   * @private
   */
  updateOvernightVisibility(dates) {
    const departureDate = dates.departure.toISOString().split('T')[0];
    const returnDate = dates.return.toISOString().split('T')[0];
    
    if (departureDate !== returnDate) {
      this.dom.overnightSection.style.display = 'block';
    } else {
      this.dom.overnightSection.style.display = 'none';
      this.dom.overnight.checked = false;
    }
  }

  /**
   * Configurar validación de inputs ICAO
   * @private
   */
  setupICAOInputs() {
    const icaoInputs = document.querySelectorAll('.icao-input');
    const config = SEXYFLY_CONFIG.validation.icao;
    
    icaoInputs.forEach(input => {
      input.addEventListener('input', function() {
        // Convertir a mayúsculas y solo letras
        this.value = this.value.toUpperCase().replace(/[^A-Z]/g, '');
        
        // Validación visual
        if (this.value.length === config.length && config.pattern.test(this.value)) {
          this.style.borderColor = SEXYFLY_CONFIG.ui.colors.success;
          this.setCustomValidity('');
        } else if (this.value.length > 0) {
          this.style.borderColor = SEXYFLY_CONFIG.ui.colors.warning;
        } else {
          this.style.borderColor = '';
        }
      });

      input.addEventListener('blur', function() {
        if (this.value.length > 0 && this.value.length !== config.length) {
          this.setCustomValidity('El código OACI debe tener exactamente 4 letras');
          this.reportValidity();
        }
      });
    });
  }

  /**
   * Configurar validación del formulario
   * @private
   */
  setupFormValidation() {
    // Prevenir submit por defecto y manejar
    this.dom.form.addEventListener('submit', (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();
      
      if (SEXYFLY_CONFIG.dev.debug) {
        console.log('📝 Form submit event detectado');
      }
      
      this.handleFormSubmit();
    }, true);

    // También listener en el botón (backup)
    this.dom.submitBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();
      
      if (SEXYFLY_CONFIG.dev.debug) {
        console.log('🔘 Botón submit clickeado');
      }
      
      // NO usar checkValidity() porque falla con campos ocultos
      // La validación completa se hace en handleFormSubmit()
      this.handleFormSubmit();
    }, true);

    if (SEXYFLY_CONFIG.dev.debug) {
      console.log('✅ Validación de formulario configurada');
    }
  }

  /**
   * Manejar envío del formulario
   * @private
   */
  handleFormSubmit() {
    if (SEXYFLY_CONFIG.dev.debug) {
      console.log('📝 Procesando envío del formulario');
    }

    // Validaciones personalizadas
    if (!this.validateDates()) return;
    if (!this.validateICAO()) return;
    if (!this.validateTimes()) return;
    if (!this.validateClient()) return;
    if (!this.validateTerms()) return;

    // Si todas las validaciones pasan, procesar reserva
    this.processBooking();
  }

  /**
   * Validar fechas seleccionadas
   * @private
   */
  validateDates() {
    if (!this.selectedDates || !this.selectedDates.departure || !this.selectedDates.return) {
      this.showError(SEXYFLY_CONFIG.i18n.es.errors.selectDates);
      return false;
    }
    return true;
  }

  /**
   * Validar códigos ICAO
   * @private
   */
  validateICAO() {
    const config = SEXYFLY_CONFIG.validation.icao;
    const origin = this.dom.originICAO.value.trim();
    const destination = this.dom.destinationICAO.value.trim();
    
    if (!origin || !config.pattern.test(origin)) {
      this.showError(SEXYFLY_CONFIG.i18n.es.errors.invalidICAO + ' (Origen)');
      this.dom.originICAO.focus();
      return false;
    }
    
    if (!destination || !config.pattern.test(destination)) {
      this.showError(SEXYFLY_CONFIG.i18n.es.errors.invalidICAO + ' (Destino)');
      this.dom.destinationICAO.focus();
      return false;
    }

    if (origin === destination) {
      this.showError(SEXYFLY_CONFIG.i18n.es.errors.sameICAO);
      return false;
    }

    return true;
  }

  /**
   * Validar horas
   * @private
   */
  validateTimes() {
    if (!this.dom.departureTime.value || !this.dom.returnTime.value) {
      this.showError(SEXYFLY_CONFIG.i18n.es.errors.missingTime);
      return false;
    }
    return true;
  }

  /**
   * Validar datos del cliente
   * @private
   */
  validateClient() {
    const config = SEXYFLY_CONFIG.validation.client;
    
    // Nombre
    const name = this.dom.clientName.value.trim();
    if (!name || name.length < config.nameMinLength) {
      this.showError(SEXYFLY_CONFIG.i18n.es.errors.missingName);
      this.dom.clientName.focus();
      return false;
    }
    
    // Email
    const email = this.dom.clientEmail.value.trim();
    if (!email || !config.emailPattern.test(email)) {
      this.showError(SEXYFLY_CONFIG.i18n.es.errors.invalidEmail);
      this.dom.clientEmail.focus();
      return false;
    }
    
    // Teléfono
    const phone = this.dom.clientPhone.value.trim();
    if (!phone || !config.phonePattern.test(phone)) {
      this.showError(SEXYFLY_CONFIG.i18n.es.errors.missingPhone);
      this.dom.clientPhone.focus();
      return false;
    }

    return true;
  }

  /**
   * Validar términos aceptados
   * @private
   */
  validateTerms() {
    if (!this.dom.acceptTerms.checked) {
      this.showError(SEXYFLY_CONFIG.i18n.es.errors.acceptTermsRequired);
      this.dom.acceptTerms.focus();
      return false;
    }
    return true;
  }

  /**
   * Procesar reserva
   * @private
   */
  processBooking() {
    if (SEXYFLY_CONFIG.dev.debug) {
      console.log('💾 Procesando reserva...');
    }
    
    // Mostrar loading
    this.showLoading(true);
    
    // Recopilar datos
    const bookingData = this.collectBookingData();
    
    // Simular procesamiento (reemplazar con llamada real a backend)
    setTimeout(() => {
      this.completeBooking(bookingData);
    }, 2000);
  }

  /**
   * Recopilar datos de la reserva
   * @private
   */
  collectBookingData() {
    const formData = new FormData(this.dom.form);
    
    return {
      dates: {
        departure: this.selectedDates.departure,
        return: this.selectedDates.return
      },
      times: {
        departure: formData.get('departureTime'),
        return: formData.get('returnTime')
      },
      airports: {
        origin: formData.get('originICAO'),
        destination: formData.get('destinationICAO')
      },
      client: {
        name: formData.get('clientName'),
        email: formData.get('clientEmail'),
        phone: formData.get('clientPhone')
      },
      options: {
        overnight: formData.get('overnight') === 'on',
        additionalInfo: formData.get('additionalInfo') || ''
      },
      pricing: {
        total: this.totalPrice,
        departure: this.pricing.calculatePrice(this.selectedDates.departure).price,
        return: this.pricing.calculatePrice(this.selectedDates.return).price
      },
      timestamp: new Date().toISOString(),
      version: SEXYFLY_CONFIG.version
    };
  }

  /**
   * Completar reserva
   * @private
   */
  async completeBooking(bookingData) {
    if (SEXYFLY_CONFIG.dev.debug) {
      console.log('✅ Reserva completada:', bookingData);
    }
    
    // Generar resumen
    const summary = this.generateBookingSummary(bookingData);
    
    // Enviar notificación por email
    if (typeof enviarNotificacionReserva === 'function') {
      console.log('📧 Enviando notificación de reserva...');
      try {
        await enviarNotificacionReserva(bookingData);
        console.log('✅ Notificación enviada a ' + SEXYFLY_CONFIG.integrations.email.notificationEmail);
      } catch (error) {
        console.warn('⚠️ No se pudo enviar email:', error);
      }
    }
    
    // Verificar si TPV está habilitado
    if (SEXYFLY_CONFIG.integrations.tpv.enabled && typeof iniciarPagoTPV === 'function') {
      // Iniciar proceso de pago con TPV
      console.log('💳 Redirigiendo a pasarela de pago TPV...');
      
      const pagoIniciado = await iniciarPagoTPV(bookingData);
      
      if (pagoIniciado) {
        // El usuario será redirigido a Redsys automáticamente
        console.log('✅ Redirigiendo a TPV Redsys...');
      } else {
        // Mostrar error
        this.showLoading(false);
        this.showError('No se pudo iniciar el pago. Por favor, inténtalo de nuevo.');
      }
    } else {
      // TPV desactivado - mostrar confirmación simulada
      alert(`${SEXYFLY_CONFIG.i18n.es.success.bookingProcessed}\n\n${summary}\n\n📧 Email enviado a ${SEXYFLY_CONFIG.integrations.email.notificationEmail}\n\n${SEXYFLY_CONFIG.i18n.es.success.redirecting}`);
      
      // Ocultar loading
      this.showLoading(false);
    }
  }

  /**
   * Generar resumen de reserva
   * @private
   */
  generateBookingSummary(data) {
    const depDate = data.dates.departure.toLocaleDateString('es-ES');
    const retDate = data.dates.return.toLocaleDateString('es-ES');
    
    return [
      `🛫 Salida: ${depDate} a las ${data.times.departure}`,
      `🛬 Regreso: ${retDate} a las ${data.times.return}`,
      `✈️ Ruta: ${data.airports.origin} → ${data.airports.destination}`,
      `💰 Total: ${data.pricing.total}${SEXYFLY_CONFIG.pricing.currency}`,
      `👤 Cliente: ${data.client.name}`
    ].join('\n');
  }

  /**
   * Mostrar/ocultar loading
   * @private
   */
  showLoading(show) {
    this.dom.loadingDiv.style.display = show ? 'block' : 'none';
    this.dom.submitBtn.disabled = show;
  }

  /**
   * Mostrar error
   * @private
   */
  showError(message) {
    alert('⚠️ ' + message);
  }

  // ===== API PÚBLICA =====

  /**
   * Obtener fechas seleccionadas
   * @public
   */
  getSelectedDates() {
    return this.selectedDates;
  }

  /**
   * Obtener precio total
   * @public
   */
  getTotalPrice() {
    return this.totalPrice;
  }

  /**
   * Resetear formulario
   * @public
   */
  resetForm() {
    this.calendar.clearSelection();
    this.selectedDates = null;
    this.totalPrice = 0;
    this.dom.flightDetailsSection.style.display = 'none';
    this.dom.totalFlights.style.display = 'none';
    this.dom.form.reset();
  }
}

/**
 * Sistema de gestión de versiones
 */
class VersionManager {
  constructor() {
    this.badge = document.getElementById('version-badge');
    this.versionText = document.getElementById('version-text');
    this.dropdown = document.getElementById('version-dropdown');
    this.versionList = document.getElementById('version-list');
    this.isDropdownVisible = false;
    this.versionsData = null;
    
    this.init();
  }

  async init() {
    try {
      await this.loadVersions();
      this.setupEventListeners();
      this.updateBadge();
    } catch (error) {
      console.warn('⚠️ Error inicializando versiones:', error);
      this.showFallback();
    }
  }

  async loadVersions() {
    try {
      const response = await fetch('./versions.json');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      this.versionsData = await response.json();
    } catch (error) {
      console.warn('⚠️ Error cargando versions.json:', error);
      throw error;
    }
  }

  showFallback() {
    this.versionText.textContent = SEXYFLY_CONFIG.version;
    this.versionList.innerHTML = `
      <div class="version-error">
        ⚠️ Error cargando historial. 
        <br><small>Versión actual: v${SEXYFLY_CONFIG.version}</small>
      </div>
    `;
  }

  updateBadge() {
    if (this.versionsData) {
      this.versionText.textContent = this.versionsData.currentVersion;
      this.renderVersionList();
    }
  }

  renderVersionList() {
    if (!this.versionsData || !this.versionsData.versions) {
      this.showFallback();
      return;
    }

    const recentVersions = this.versionsData.versions.slice(0, 3);
    
    const versionsHTML = recentVersions.map(version => {
      const date = new Date(version.date).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });

      const featuresHTML = version.features && version.features.length > 0 
        ? `<div class="version-features">
             <ul>${version.features.map(f => `<li>${f}</li>`).join('')}</ul>
           </div>`
        : '';

      return `
        <div class="version-item">
          <div class="version-item-header">
            <span class="version-number">v${version.version}</span>
            <span class="version-date">${date}</span>
          </div>
          <div class="version-type ${version.changeType}">${version.changeType}</div>
          <div class="version-description">${version.description}</div>
          ${featuresHTML}
        </div>
      `;
    }).join('');

    this.versionList.innerHTML = versionsHTML;
  }

  setupEventListeners() {
    this.badge.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleDropdown();
    });

    this.badge.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.toggleDropdown();
      }
    });

    document.addEventListener('click', (e) => {
      if (!this.badge.contains(e.target)) {
        this.hideDropdown();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isDropdownVisible) {
        this.hideDropdown();
        this.badge.focus();
      }
    });

    this.dropdown.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  toggleDropdown() {
    this.isDropdownVisible ? this.hideDropdown() : this.showDropdown();
  }

  showDropdown() {
    this.dropdown.classList.add('show');
    this.isDropdownVisible = true;
    this.badge.setAttribute('aria-expanded', 'true');
  }

  hideDropdown() {
    this.dropdown.classList.remove('show');
    this.isDropdownVisible = false;
    this.badge.setAttribute('aria-expanded', 'false');
  }
}

/**
 * Función global para scroll a términos
 */
function scrollToTerms() {
  document.getElementById('terms').scrollIntoView({ 
    behavior: 'smooth',
    block: 'start'
  });
}

/**
 * Inicializar aplicación cuando el DOM esté listo
 */
function initializeApp() {
  try {
    window.sexyFlyApp = new SexyFlyApp();
    
    if (SEXYFLY_CONFIG.dev.debug) {
      console.log('🚁 SexyFly v' + SEXYFLY_CONFIG.version + ' listo');
      console.log('App disponible en: window.sexyFlyApp');
    }
  } catch (error) {
    console.error('❌ Error fatal inicializando app:', error);
    alert('Error al cargar la aplicación. Por favor, recarga la página.');
  }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

// Exponer funciones globales necesarias
window.scrollToTerms = scrollToTerms;

