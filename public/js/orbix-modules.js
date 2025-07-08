/**
 * 🔧 Ejemplos de Correcciones para Orbix Systems
 * Aplicación de DOM Safety Utils a código específico
 */

// ============================================================================
// 📌 EJEMPLO 1: Corrección de código D3.js de avatar
// ============================================================================

// ❌ CÓDIGO PROBLEMÁTICO (puede causar null querySelector):
/*
d3.select("#avatar").style("filter", filters.join(' '));
d3.select('#stiffnessx').property('value', k[0]).node().nextElementSibling.textContent = k[0];
*/

// ✅ CÓDIGO CORREGIDO:
function safeDynamicBoneUpdate() {
    try {
        // Verificar que D3 esté disponible
        if (typeof d3 === 'undefined') {
            console.warn('⚠️ D3.js no está disponible');
            return;
        }

        // Aplicar filtros de avatar de forma segura
        const avatarElement = d3.select("#avatar");
        if (!avatarElement.empty()) {
            const filters = []; // Tu lógica de filtros aquí
            avatarElement.style("filter", filters.join(' '));
        } else {
            console.warn('⚠️ Elemento #avatar no encontrado');
        }

        // Actualizar valores de stiffness de forma segura
        const stiffnessElement = d3.select('#stiffnessx');
        if (!stiffnessElement.empty()) {
            const node = stiffnessElement.property('value', k[0]).node();
            if (node && node.nextElementSibling) {
                node.nextElementSibling.textContent = k[0];
            }
        }
    } catch (error) {
        console.error('❌ Error en safeDynamicBoneUpdate:', error);
    }
}

// ============================================================================
// 📌 EJEMPLO 2: Corrección para selectores de Odoo
// ============================================================================

// ❌ CÓDIGO PROBLEMÁTICO:
/*
const formView = document.querySelector('.o_form_view');
formView.querySelector('.o_field_widget').value = 'nuevo valor';
*/

// ✅ CÓDIGO CORREGIDO:
function safeOdooFieldUpdate(fieldName, newValue) {
    const { safeQuerySelector, safeSetProperty } = window.orbixSafeDOM;
    
    // Buscar la vista de formulario
    const formView = safeQuerySelector('.o_form_view');
    if (!formView) {
        console.warn('⚠️ Vista de formulario Odoo no encontrada');
        return false;
    }
    
    // Buscar el campo específico
    const fieldWidget = safeQuerySelector(`.o_field_widget[name="${fieldName}"]`, formView);
    if (fieldWidget) {
        const input = safeQuerySelector('input, select, textarea', fieldWidget);
        if (input) {
            input.value = newValue;
            // Disparar evento change para Odoo
            input.dispatchEvent(new Event('change', { bubbles: true }));
            return true;
        }
    }
    
    console.warn(`⚠️ Campo "${fieldName}" no encontrado en Odoo`);
    return false;
}

// ============================================================================
// 📌 EJEMPLO 3: Corrección para Charts.js de Sentinel
// ============================================================================

// ❌ CÓDIGO PROBLEMÁTICO:
/*
const ctx = document.getElementById('geographicChart').getContext('2d');
charts.geographic = new Chart(ctx, { ... });
*/

// ✅ CÓDIGO CORREGIDO:
function initializeSafeChart(chartId, config) {
    const { safeGetElementById } = window.orbixSafeDOM;
    
    try {
        const chartElement = safeGetElementById(chartId);
        if (!chartElement) {
            console.error(`❌ Elemento canvas "${chartId}" no encontrado`);
            return null;
        }
        
        const ctx = chartElement.getContext('2d');
        if (!ctx) {
            console.error(`❌ No se pudo obtener contexto 2D para "${chartId}"`);
            return null;
        }
        
        // Verificar que Chart.js esté disponible
        if (typeof Chart === 'undefined') {
            console.error('❌ Chart.js no está disponible');
            return null;
        }
        
        return new Chart(ctx, config);
    } catch (error) {
        console.error(`❌ Error al inicializar chart "${chartId}":`, error);
        return null;
    }
}

// Uso:
const geographicChart = initializeSafeChart('geographicChart', {
    type: 'bar',
    data: {
        labels: ['México', 'USA', 'España'],
        datasets: [{
            label: 'Amenazas Detectadas',
            data: [12, 19, 8]
        }]
    }
});

// ============================================================================
// 📌 EJEMPLO 4: Corrección para manejo de eventos
// ============================================================================

// ❌ CÓDIGO PROBLEMÁTICO:
/*
document.querySelector('.mi-button').addEventListener('click', handler);
*/

// ✅ CÓDIGO CORREGIDO:
function safeEventBinding() {
    const { safeAddEventListener } = window.orbixSafeDOM;
    
    // Evento con fallback
    const success = safeAddEventListener('.mi-button', 'click', (event) => {
        console.log('✅ Botón clickeado de forma segura');
        // Tu lógica aquí
    });
    
    if (!success) {
        console.warn('⚠️ No se pudo vincular evento al botón');
        // Alternativa: usar delegación de eventos
        document.addEventListener('click', (event) => {
            if (event.target.matches('.mi-button')) {
                console.log('✅ Botón clickeado via delegación');
                // Tu lógica aquí
            }
        });
    }
}

// ============================================================================
// 📌 EJEMPLO 5: Corrección para breadcrumbs de Odoo
// ============================================================================

// ❌ CÓDIGO PROBLEMÁTICO:
/*
const breadcrumb = document.querySelector('.breadcrumb');
breadcrumb.textContent = 'Nueva ruta';
*/

// ✅ CÓDIGO CORREGIDO:
function safeBreadcrumbUpdate(newText) {
    const { safeSetProperty, waitForElement } = window.orbixSafeDOM;
    
    // Intentar actualizar inmediatamente
    if (safeSetProperty('.breadcrumb', 'textContent', newText)) {
        console.log('✅ Breadcrumb actualizado');
        return;
    }
    
    // Si no existe, esperar a que aparezca
    waitForElement('.breadcrumb', 3000)
        .then(element => {
            element.textContent = newText;
            console.log('✅ Breadcrumb actualizado después de esperar');
        })
        .catch(error => {
            console.warn('⚠️ Breadcrumb no apareció:', error.message);
        });
}

// ============================================================================
// 📌 EJEMPLO 6: Corrección para validaciones de campos dinámicos
// ============================================================================

function safeValidateOrbixForm() {
    const { safeQuerySelectorAll } = window.orbixSafeDOM;
    
    const fields = safeQuerySelectorAll('.campo-obligatorio');
    let allValid = true;
    
    fields.forEach((field, index) => {
        try {
            if (!field.value || field.value.trim() === '') {
                field.classList.add('error');
                allValid = false;
            } else {
                field.classList.remove('error');
            }
        } catch (error) {
            console.error(`❌ Error validando campo ${index}:`, error);
            allValid = false;
        }
    });
    
    return allValid;
}

// ============================================================================
// 📌 EJEMPLO 7: Inicialización segura para múltiples módulos
// ============================================================================

function initializeOrbixModules() {
    const { safeDOMReady } = window.orbixSafeDOM;
    
    safeDOMReady(() => {
        console.log('🚀 Inicializando módulos Orbix...');
        
        // Inicializar cada módulo de forma segura
        const modules = [
            { name: 'Charts', init: initializeSafeChart },
            { name: 'Events', init: safeEventBinding },
            { name: 'Avatar', init: safeDynamicBoneUpdate },
            { name: 'Validation', init: safeValidateOrbixForm }
        ];
        
        modules.forEach(module => {
            try {
                if (typeof module.init === 'function') {
                    module.init();
                    console.log(`✅ Módulo ${module.name} inicializado`);
                }
            } catch (error) {
                console.error(`❌ Error inicializando ${module.name}:`, error);
            }
        });
    });
}

// ============================================================================
// 📌 AUTO-INICIALIZACIÓN
// ============================================================================

// Ejecutar cuando el DOM esté listo
if (typeof window !== 'undefined') {
    window.orbixModules = {
        safeDynamicBoneUpdate,
        safeOdooFieldUpdate,
        initializeSafeChart,
        safeEventBinding,
        safeBreadcrumbUpdate,
        safeValidateOrbixForm,
        initializeOrbixModules
    };
    
    // Auto-inicializar si el DOM ya está listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeOrbixModules);
    } else {
        initializeOrbixModules();
    }
}

console.log('🧠 Orbix Modules cargados correctamente');
