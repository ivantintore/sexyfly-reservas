// Script de diagnóstico - Pega esto en la consola del navegador (F12)

console.log('=== DIAGNÓSTICO SEXYFLY ===');

// 1. Verificar SexyFlyApp
console.log('\n1. SexyFlyApp:');
console.log('   Existe:', !!window.sexyFlyApp);
if (window.sexyFlyApp) {
    console.log('   Selected dates:', window.sexyFlyApp.selectedDates);
    console.log('   Total price:', window.sexyFlyApp.totalPrice);
    console.log('   Has submit handler:', !!window.sexyFlyApp._submitHandler);
    console.log('   Has button handler:', !!window.sexyFlyApp._buttonHandler);
}

// 2. Verificar formulario
console.log('\n2. Formulario:');
const form = document.getElementById('bookingForm');
console.log('   Existe:', !!form);
if (form) {
    console.log('   Es válido:', form.checkValidity());
    console.log('   Action:', form.action);
    console.log('   Method:', form.method);
}

// 3. Verificar botón
console.log('\n3. Botón de submit:');
const submitBtn = document.getElementById('submitBtn');
console.log('   Existe:', !!submitBtn);
if (submitBtn) {
    console.log('   Type:', submitBtn.type);
    console.log('   Disabled:', submitBtn.disabled);
    console.log('   onclick:', typeof submitBtn.onclick);
}

// 4. Verificar campos requeridos
console.log('\n4. Campos del formulario:');
const fields = {
    'originICAO': document.getElementById('originICAO'),
    'destinationICAO': document.getElementById('destinationICAO'),
    'departureTime': document.getElementById('departureTime'),
    'returnTime': document.getElementById('returnTime'),
    'clientName': document.getElementById('clientName'),
    'clientEmail': document.getElementById('clientEmail'),
    'clientPhone': document.getElementById('clientPhone'),
    'acceptTerms': document.getElementById('acceptTerms')
};

Object.keys(fields).forEach(key => {
    const field = fields[key];
    if (field) {
        console.log(`   ${key}:`, {
            existe: true,
            valor: field.value,
            requerido: field.required,
            válido: field.checkValidity ? field.checkValidity() : 'N/A'
        });
    } else {
        console.log(`   ${key}: NO EXISTE`);
    }
});

// 5. Test manual del submit
console.log('\n5. Para probar manualmente, ejecuta:');
console.log('   window.sexyFlyApp.handleFormSubmit()');

// 6. Test del botón
console.log('\n6. Para probar el botón manualmente, ejecuta:');
console.log('   document.getElementById("submitBtn").click()');

console.log('\n=== FIN DIAGNÓSTICO ===');

