/**
 * Script de Debugging del Formulario
 * Ejecutar en la consola del navegador para diagnosticar problemas
 */

console.log('🔍 INICIANDO DIAGNÓSTICO DEL FORMULARIO\n');
console.log('='.repeat(70));

// 1. Verificar que todo está cargado
console.log('\n1️⃣ VERIFICANDO DEPENDENCIAS');
console.log('-'.repeat(70));

const checks = {
  'SEXYFLY_CONFIG': typeof SEXYFLY_CONFIG !== 'undefined',
  'SexyFlyPricing': typeof SexyFlyPricing !== 'undefined',
  'SexyFlyCalendar': typeof SexyFlyCalendar !== 'undefined',
  'SexyFlyApp': typeof SexyFlyApp !== 'undefined',
  'window.sexyFlyApp': typeof window.sexyFlyApp !== 'undefined',
  'VersionManager': typeof VersionManager !== 'undefined'
};

Object.entries(checks).forEach(([name, exists]) => {
  console.log(`${exists ? '✅' : '❌'} ${name}: ${exists ? 'OK' : 'FALTA'}`);
});

// 2. Verificar elementos del DOM
console.log('\n2️⃣ VERIFICANDO ELEMENTOS DEL DOM');
console.log('-'.repeat(70));

const elements = {
  'form': document.getElementById('bookingForm'),
  'submitBtn': document.getElementById('submitBtn'),
  'flightCalendar': document.getElementById('flightCalendar'),
  'loadingDiv': document.getElementById('loadingDiv'),
  'originICAO': document.getElementById('originICAO'),
  'destinationICAO': document.getElementById('destinationICAO'),
  'clientName': document.getElementById('clientName'),
  'clientEmail': document.getElementById('clientEmail'),
  'acceptTerms': document.getElementById('acceptTerms')
};

Object.entries(elements).forEach(([name, element]) => {
  console.log(`${element ? '✅' : '❌'} ${name}: ${element ? 'Encontrado' : 'NO ENCONTRADO'}`);
});

// 3. Verificar event listeners
console.log('\n3️⃣ VERIFICANDO EVENT LISTENERS');
console.log('-'.repeat(70));

const form = document.getElementById('bookingForm');
const submitBtn = document.getElementById('submitBtn');

if (form) {
  console.log('Form encontrado');
  console.log('Form.onsubmit:', typeof form.onsubmit);
  console.log('Form tiene listeners:', 'No podemos ver todos los listeners, pero verificaremos manualmente');
}

if (submitBtn) {
  console.log('SubmitBtn encontrado');
  console.log('SubmitBtn.onclick:', typeof submitBtn.onclick);
  console.log('SubmitBtn.type:', submitBtn.type);
  console.log('SubmitBtn.disabled:', submitBtn.disabled);
}

// 4. Verificar estado de sexyFlyApp
console.log('\n4️⃣ VERIFICANDO ESTADO DE SEXYFLY APP');
console.log('-'.repeat(70));

if (window.sexyFlyApp) {
  const app = window.sexyFlyApp;
  console.log('✅ SexyFlyApp existe');
  console.log('   - pricing:', app.pricing ? '✅ OK' : '❌ FALTA');
  console.log('   - calendar:', app.calendar ? '✅ OK' : '❌ FALTA');
  console.log('   - selectedDates:', app.selectedDates);
  console.log('   - totalPrice:', app.totalPrice);
  console.log('   - dom.form:', app.dom ? (app.dom.form ? '✅ OK' : '❌ FALTA') : '❌ FALTA');
  console.log('   - dom.submitBtn:', app.dom ? (app.dom.submitBtn ? '✅ OK' : '❌ FALTA') : '❌ FALTA');
} else {
  console.log('❌ SexyFlyApp NO existe - PROBLEMA CRÍTICO');
}

// 5. Test manual del submit
console.log('\n5️⃣ TEST MANUAL');
console.log('-'.repeat(70));
console.log('Para testear manualmente, ejecuta en consola:');
console.log('');
console.log('// Simular click en botón');
console.log('document.getElementById("submitBtn").click()');
console.log('');
console.log('// O llamar directamente al handler');
console.log('if (window.sexyFlyApp) {');
console.log('  window.sexyFlyApp.handleFormSubmit()');
console.log('}');

// 6. Verificar errores en consola
console.log('\n6️⃣ VERIFICAR ERRORES');
console.log('-'.repeat(70));
console.log('Revisa si hay errores en rojo arriba ☝️');
console.log('Si hay errores de carga de archivos, verifica que todos los .js existen');

console.log('\n' + '='.repeat(70));
console.log('🔍 DIAGNÓSTICO COMPLETADO');
console.log('='.repeat(70) + '\n');

// Resumen
const allDepsOK = Object.values(checks).every(v => v);
const allElementsOK = Object.values(elements).every(v => v);
const appExists = typeof window.sexyFlyApp !== 'undefined';

console.log('📊 RESUMEN:');
console.log(`Dependencias: ${allDepsOK ? '✅ OK' : '❌ PROBLEMAS'}`);
console.log(`Elementos DOM: ${allElementsOK ? '✅ OK' : '❌ PROBLEMAS'}`);
console.log(`SexyFlyApp: ${appExists ? '✅ OK' : '❌ NO INICIALIZADO'}`);
console.log('');

if (!allDepsOK) {
  console.error('⚠️ PROBLEMA: Faltan dependencias. Verifica que todos los archivos .js se cargan correctamente.');
}

if (!allElementsOK) {
  console.error('⚠️ PROBLEMA: Faltan elementos del DOM. Verifica index.html.');
}

if (!appExists) {
  console.error('⚠️ PROBLEMA CRÍTICO: SexyFlyApp no se inicializó. Revisa app.js y errores en consola.');
} else {
  console.log('✅ Todo parece estar bien. Si el botón no funciona:');
  console.log('   1. Selecciona fechas en el calendario');
  console.log('   2. Completa todos los campos requeridos');
  console.log('   3. Acepta términos y condiciones');
  console.log('   4. Intenta hacer click en el botón');
}

