/**
 * SexyFly - Sistema de Notificaciones por Email
 * @version 3.0.0
 * @description Envía notificaciones por email usando FormSubmit.co
 * @requires config.js
 */

'use strict';

/**
 * Enviar notificación de resultados de tests
 * @param {Object} testResults - Resultados de los tests
 * @param {number} testResults.total - Total de tests
 * @param {number} testResults.passed - Tests que pasaron
 * @param {number} testResults.failed - Tests que fallaron
 * @param {number} testResults.duration - Duración en segundos
 */
async function enviarNotificacionTests(testResults) {
  if (!SEXYFLY_CONFIG.integrations.email.testNotifications) {
    console.log('📧 Notificaciones de tests desactivadas');
    return;
  }

  const email = SEXYFLY_CONFIG.integrations.email.notificationEmail;
  const status = testResults.failed === 0 ? '✅ OK' : '❌ KO';
  const timestamp = new Date().toLocaleString('es-ES');

  const subject = `SexyFly Tests ${status} - ${testResults.passed}/${testResults.total}`;
  
  const mensaje = `
🧪 RESULTADOS DE TESTS - SexyFly v3.0.0
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ESTADO: ${status}

📊 RESUMEN:
   • Total Tests: ${testResults.total}
   • ✅ Pasados: ${testResults.passed}
   • ❌ Fallados: ${testResults.failed}
   • ⏱️ Duración: ${testResults.duration}s
   • 📅 Fecha: ${timestamp}

${testResults.failed === 0 ? 
  '🎉 TODOS LOS TESTS PASARON CORRECTAMENTE 🎉' : 
  `⚠️ HAY ${testResults.failed} TEST(S) FALLANDO - REQUIERE ATENCIÓN`}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Este es un mensaje automático del sistema de testing de SexyFly.
Para más detalles, ejecuta: ./scripts/run-tests.sh

GitHub: https://github.com/ivantintore/sexyfly-reservas
`;

  try {
    const formData = new FormData();
    formData.append('_subject', subject);
    formData.append('_template', 'box'); // Template bonito
    formData.append('_captcha', 'false');
    formData.append('mensaje', mensaje);
    formData.append('total', testResults.total);
    formData.append('passed', testResults.passed);
    formData.append('failed', testResults.failed);
    formData.append('duration', testResults.duration);
    formData.append('timestamp', timestamp);

    const response = await fetch(`https://formsubmit.co/${email}`, {
      method: 'POST',
      body: formData,
      mode: 'no-cors' // Importante para evitar CORS
    });

    console.log(`📧 Email enviado a ${email}: ${status}`);
    return true;

  } catch (error) {
    console.error('❌ Error enviando email:', error);
    return false;
  }
}

/**
 * Enviar notificación de reserva
 * @param {Object} bookingData - Datos de la reserva
 */
async function enviarNotificacionReserva(bookingData) {
  if (!SEXYFLY_CONFIG.integrations.email.bookingNotifications) {
    console.log('📧 Notificaciones de reservas desactivadas');
    return;
  }

  const email = SEXYFLY_CONFIG.integrations.email.notificationEmail;
  const timestamp = new Date().toLocaleString('es-ES');

  const subject = `Nueva Reserva SexyFly - ${bookingData.client.name}`;
  
  const mensaje = `
🚁 NUEVA RESERVA - SexyFly
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 CLIENTE:
   • Nombre: ${bookingData.client.name}
   • Email: ${bookingData.client.email}
   • Teléfono: ${bookingData.client.phone}

✈️ VUELO:
   • Ruta: ${bookingData.airports.origin} → ${bookingData.airports.destination}
   • 🛫 Salida: ${bookingData.dates.departure.toLocaleDateString('es-ES')} a las ${bookingData.times.departure}
   • 🛬 Regreso: ${bookingData.dates.return.toLocaleDateString('es-ES')} a las ${bookingData.times.return}
   • 🏨 Pernocta: ${bookingData.options.overnight ? 'SÍ' : 'NO'}

💰 PRECIO:
   • Ida: ${bookingData.pricing.departure}€
   • Vuelta: ${bookingData.pricing.return}€
   • TOTAL: ${bookingData.pricing.total}€

📝 INFORMACIÓN ADICIONAL:
${bookingData.options.additionalInfo || '(ninguna)'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📅 Fecha/Hora: ${timestamp}

Este es un mensaje automático del sistema de reservas SexyFly.
GitHub: https://github.com/ivantintore/sexyfly-reservas
`;

  try {
    const formData = new FormData();
    formData.append('_subject', subject);
    formData.append('_template', 'box');
    formData.append('_captcha', 'false');
    formData.append('mensaje', mensaje);
    formData.append('cliente_nombre', bookingData.client.name);
    formData.append('cliente_email', bookingData.client.email);
    formData.append('ruta', `${bookingData.airports.origin} → ${bookingData.airports.destination}`);
    formData.append('precio_total', bookingData.pricing.total);
    formData.append('timestamp', timestamp);

    await fetch(`https://formsubmit.co/${email}`, {
      method: 'POST',
      body: formData,
      mode: 'no-cors'
    });

    console.log(`📧 Email de reserva enviado a ${email}`);
    return true;

  } catch (error) {
    console.error('❌ Error enviando email de reserva:', error);
    return false;
  }
}

// Exportar para uso global
if (typeof window !== 'undefined') {
  window.enviarNotificacionTests = enviarNotificacionTests;
  window.enviarNotificacionReserva = enviarNotificacionReserva;
}

console.log('✅ Sistema de notificaciones por email cargado');

