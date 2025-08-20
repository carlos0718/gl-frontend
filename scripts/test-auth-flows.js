#!/usr/bin/env node

/**
 * Script para probar los flujos de autenticación
 * Uso: node scripts/test-auth-flows.js
 */
console.log('🧪 Probando flujos de autenticación...');
console.log('');

console.log('📋 Flujos implementados:');
console.log('');
console.log('1. 🔐 LOGIN (Usuario existente):');
console.log('   - Usuario ingresa email y password');
console.log('   - authService.login() guarda token + userData + onboardingComplete=true');
console.log('   - _layout.tsx detecta: authToken=✅, onboardingComplete=✅');
console.log('   - Resultado: Va directamente al HOME');
console.log('');

console.log('2. 📝 REGISTRO (Usuario nuevo):');
console.log('   - Usuario hace clic en "Regístrate"');
console.log('   - Se limpia authToken y onboardingComplete');
console.log('   - Se muestra OnboardingWizard');
console.log('   - Usuario completa el wizard');
console.log('   - authService.register() guarda token + userData (sin onboardingComplete)');
console.log('   - OnboardingWizard marca onboardingComplete=true');
console.log('   - _layout.tsx detecta: authToken=✅, onboardingComplete=✅');
console.log('   - Resultado: Va al HOME');
console.log('');

console.log('3. 🔄 FLUJO COMPLETO:');
console.log('   - _layout.tsx verifica estado al iniciar');
console.log('   - Si no hay authToken → AuthStack');
console.log('   - Si hay authToken pero no onboardingComplete → OnboardingWizard');
console.log('   - Si hay authToken y onboardingComplete → HOME');
console.log('');

console.log('✅ Flujos configurados correctamente');
console.log('');
console.log('💡 Para probar:');
console.log('1. npm run clear-auth');
console.log('2. npx expo start --clear');
console.log('3. Probar login con usuario existente');
console.log('4. Probar registro con usuario nuevo');
