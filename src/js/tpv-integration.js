/**
 * SexyFly - Integración TPV Redsys/MAITSA
 * @version 3.1.0
 * @description Maneja la integración con la pasarela de pagos TPV
 * @requires config.js
 */

'use strict';

/**
 * Iniciar proceso de pago con TPV
 * @param {Object} bookingData - Datos completos de la reserva
 * @returns {Promise<boolean>} True si el proceso se inició correctamente
 */
async function iniciarPagoTPV(bookingData) {
  if (!SEXYFLY_CONFIG.integrations.tpv.enabled) {
    console.warn('⚠️ TPV desactivado en configuración');
    return false;
  }

  console.log('💳 Iniciando pago con TPV MAITSA/Redsys...');
  console.log('   Modo:', SEXYFLY_CONFIG.integrations.tpv.testMode ? 'TEST' : 'PRODUCCIÓN');
  console.log('   Importe:', bookingData.pricing.total + '€');

  try {
    // Llamar al backend para generar parámetros TPV
    const response = await fetch(SEXYFLY_CONFIG.integrations.tpv.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bookingData)
    });

    if (!response.ok) {
      throw new Error(`Error del servidor: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Error generando parámetros TPV');
    }

    console.log('✅ Parámetros TPV recibidos del backend');
    console.log('   Número pedido:', data.numero_pedido);

    // Crear y enviar formulario a Redsys
    enviarFormularioRedsys(data.parametros_tpv);

    return true;

  } catch (error) {
    console.error('❌ Error iniciando pago TPV:', error);
    alert(`Error al iniciar el pago: ${error.message}\n\nPor favor, inténtalo de nuevo.`);
    return false;
  }
}

/**
 * Crear y enviar formulario a Redsys
 * @param {Object} params - Parámetros TPV del backend
 */
function enviarFormularioRedsys(params) {
  console.log('📤 Enviando a pasarela Redsys...');

  // Crear formulario oculto
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = params.url_tpv;
  form.style.display = 'none';

  // Añadir campos ocultos
  const campos = {
    'Ds_SignatureVersion': params.Ds_SignatureVersion,
    'Ds_MerchantParameters': params.Ds_MerchantParameters,
    'Ds_Signature': params.Ds_Signature
  };

  for (const [name, value] of Object.entries(campos)) {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = name;
    input.value = value;
    form.appendChild(input);
  }

  // Añadir al DOM y enviar
  document.body.appendChild(form);
  
  console.log('✅ Formulario creado, redirigiendo a Redsys...');
  
  // Pequeña pausa para que el usuario vea el mensaje
  setTimeout(() => {
    form.submit();
  }, 500);
}

/**
 * Mostrar información de tarjetas de prueba (solo en modo test)
 */
function mostrarTarjetasDePrueba() {
  if (!SEXYFLY_CONFIG.integrations.tpv.testMode) {
    return;
  }

  const testCards = SEXYFLY_CONFIG.integrations.tpv.testCards;

  console.log('\n🧪 MODO TEST - Tarjetas de Prueba:');
  console.log('━'.repeat(50));
  console.log('✅ Para pago AUTORIZADO:');
  console.log(`   Número: ${testCards.ok.number}`);
  console.log(`   CVV: ${testCards.ok.cvv}`);
  console.log(`   Caducidad: ${testCards.ok.expiry}`);
  console.log(`   CIP: ${testCards.ok.cip}`);
  console.log('');
  console.log('❌ Para pago DENEGADO:');
  console.log(`   Número: ${testCards.ko.number}`);
  console.log(`   Caducidad: ${testCards.ko.expiry}`);
  console.log('━'.repeat(50));
}

/**
 * Verificar estado del backend TPV
 * @returns {Promise<Object>} Estado del backend
 */
async function verificarBackendTPV() {
  try {
    const response = await fetch('/api/health');
    
    if (!response.ok) {
      throw new Error('Backend no disponible');
    }

    const data = await response.json();
    
    console.log('✅ Backend TPV operativo:');
    console.log('   Estado:', data.status);
    console.log('   Modo:', data.tpv_mode);
    console.log('   Merchant:', data.merchant_code);
    
    return data;

  } catch (error) {
    console.error('❌ Backend TPV no disponible:', error.message);
    console.error('   Asegúrate de ejecutar: python backend/app.py');
    return null;
  }
}

// Exportar para uso global
if (typeof window !== 'undefined') {
  window.iniciarPagoTPV = iniciarPagoTPV;
  window.mostrarTarjetasDePrueba = mostrarTarjetasDePrueba;
  window.verificarBackendTPV = verificarBackendTPV;
}

// Mostrar tarjetas de prueba al cargar (si está en modo test)
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    if (SEXYFLY_CONFIG.integrations.tpv.enabled && 
        SEXYFLY_CONFIG.integrations.tpv.testMode) {
      setTimeout(mostrarTarjetasDePrueba, 1000);
    }
  });
}

console.log('✅ Módulo TPV Redsys/MAITSA cargado');

