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

    console.log(`📤 Enviando email a ${email}...`);
    
    const response = await fetch(`https://formsubmit.co/${email}`, {
      method: 'POST',
      body: formData,
      mode: 'no-cors' // Importante para evitar CORS
    });

    // Mostrar acknowledgement visual
    console.log(`✅ Email entregado al servidor FormSubmit.co`);
    console.log(`📧 Destino: ${email}`);
    console.log(`📊 Estado: ${status}`);
    console.log(`⏱️  Tiempo estimado de entrega: 1-2 minutos`);
    
    // Mostrar notificación visual en la página
    mostrarNotificacionEmail(status, email);
    
    return true;

  } catch (error) {
    console.error('❌ Error enviando email:', error);
    mostrarErrorEmail(error.message);
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

/**
 * Mostrar notificación visual de email enviado
 * @param {string} status - Estado del test (✅ OK o ❌ KO)
 * @param {string} email - Email destino
 */
function mostrarNotificacionEmail(status, email) {
  // Crear elemento de notificación
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(45deg, #10b981, #34d399);
    color: white;
    padding: 20px 30px;
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    z-index: 10000;
    font-family: 'Segoe UI', sans-serif;
    max-width: 400px;
    animation: slideIn 0.5s ease;
  `;
  
  notification.innerHTML = `
    <div style="font-size: 24px; margin-bottom: 10px;">✅</div>
    <div style="font-weight: bold; margin-bottom: 5px;">Email Entregado al Servidor</div>
    <div style="font-size: 14px; opacity: 0.9;">
      📧 Para: ${email}<br>
      📊 Estado tests: ${status}<br>
      ⏱️ Llegará en 1-2 minutos
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Remover después de 5 segundos
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.5s ease';
    setTimeout(() => notification.remove(), 500);
  }, 5000);
}

/**
 * Mostrar error al enviar email
 * @param {string} errorMsg - Mensaje de error
 */
function mostrarErrorEmail(errorMsg) {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(45deg, #ef4444, #f87171);
    color: white;
    padding: 20px 30px;
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    z-index: 10000;
    font-family: 'Segoe UI', sans-serif;
    max-width: 400px;
  `;
  
  notification.innerHTML = `
    <div style="font-size: 24px; margin-bottom: 10px;">❌</div>
    <div style="font-weight: bold; margin-bottom: 5px;">Error al Enviar Email</div>
    <div style="font-size: 14px; opacity: 0.9;">${errorMsg}</div>
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => notification.remove(), 5000);
}

// Añadir estilos de animación
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Exportar para uso global
if (typeof window !== 'undefined') {
  window.enviarNotificacionTests = enviarNotificacionTests;
  window.enviarNotificacionReserva = enviarNotificacionReserva;
  window.mostrarNotificacionEmail = mostrarNotificacionEmail;
  window.mostrarErrorEmail = mostrarErrorEmail;
}

console.log('✅ Sistema de notificaciones por email cargado');

