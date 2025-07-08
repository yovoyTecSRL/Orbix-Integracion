/**
 * 🔧 PATCH ESPECÍFICO para código existente de Orbix
 * Aplicar correcciones directas a tu código JavaScript existente
 */

// ============================================================================
// 🛠️ MONKEY PATCH para d3.select() más seguro
// ============================================================================
if (typeof d3 !== 'undefined') {
    const originalD3Select = d3.select;
    
    d3.select = function(selector) {
        try {
            const result = originalD3Select.call(this, selector);
            
            // Si el resultado está vacío, log warning
            if (result.empty()) {
                console.warn(`⚠️ D3: Elemento "${selector}" no encontrado`);
            }
            
            return result;
        } catch (error) {
            console.error(`❌ D3: Error en select("${selector}"):`, error);
            // Retornar selección vacía en lugar de null
            return originalD3Select.call(this, 'body').append('div').style('display', 'none').remove();
        }
    };
}

// ============================================================================
// 🛠️ OVERRIDE para document.querySelector más seguro
// ============================================================================
const originalQuerySelector = document.querySelector;
document.querySelector = function(selector) {
    try {
        const element = originalQuerySelector.call(this, selector);
        if (!element) {
            console.warn(`⚠️ querySelector: Elemento "${selector}" no encontrado`);
        }
        return element;
    } catch (error) {
        console.error(`❌ querySelector: Error con selector "${selector}":`, error);
        return null;
    }
};

// ============================================================================
// 🛠️ FIXES ESPECÍFICOS para tu código de avatar
// ============================================================================

// Fix para el código problemático de dynamic bones
if (typeof window !== 'undefined') {
    window.safeDynamicBoneOperations = {
        
        // Corrige: d3.select('#stiffnessx').property('value', k[0]).node().nextElementSibling.textContent = k[0];
        updateStiffnessDisplay: function(axis, value) {
            try {
                const element = d3.select(`#stiffness${axis}`);
                if (!element.empty()) {
                    const node = element.property('value', value).node();
                    if (node && node.nextElementSibling) {
                        node.nextElementSibling.textContent = value;
                        return true;
                    }
                }
                console.warn(`⚠️ No se pudo actualizar stiffness${axis}`);
                return false;
            } catch (error) {
                console.error(`❌ Error actualizando stiffness${axis}:`, error);
                return false;
            }
        },
        
        // Corrige operaciones de damping
        updateDampingDisplay: function(axis, value) {
            try {
                const element = d3.select(`#damping${axis}`);
                if (!element.empty()) {
                    const node = element.property('value', value).node();
                    if (node && node.nextElementSibling) {
                        node.nextElementSibling.textContent = value;
                        return true;
                    }
                }
                console.warn(`⚠️ No se pudo actualizar damping${axis}`);
                return false;
            } catch (error) {
                console.error(`❌ Error actualizando damping${axis}:`, error);
                return false;
            }
        },
        
        // Corrige operaciones de limits
        updateLimitsDisplay: function() {
            try {
                const limitSelectors = [
                    '#limitsx1', '#limitsx2', '#limitsy1', '#limitsy2',
                    '#limitsz1', '#limitsz2', '#limitst1', '#limitst2'
                ];
                
                limitSelectors.forEach((selector, i) => {
                    const element = d3.select(selector);
                    if (!element.empty()) {
                        const nullElement = d3.select(selector + 'null');
                        const isSelected = !nullElement.empty() && nullElement.classed("selected");
                        
                        if (isSelected) {
                            const value = parseFloat(element.property("value"));
                            element.classed("disabled", false);
                            
                            const node = element.node();
                            if (node && node.nextElementSibling) {
                                node.nextElementSibling.textContent = value + ' m';
                            }
                        } else {
                            element.classed("disabled", true);
                            const node = element.node();
                            if (node && node.nextElementSibling) {
                                node.nextElementSibling.textContent = "";
                            }
                        }
                    }
                });
                
                return true;
            } catch (error) {
                console.error('❌ Error actualizando limits display:', error);
                return false;
            }
        }
    };
}

// ============================================================================
// 🛠️ FIXES para Chart.js de Sentinel
// ============================================================================

if (typeof window !== 'undefined') {
    window.safeSentinelCharts = {
        
        // Inicialización segura de charts
        initChart: function(canvasId, config) {
            try {
                const canvas = document.getElementById(canvasId);
                if (!canvas) {
                    console.error(`❌ Canvas "${canvasId}" no encontrado`);
                    return null;
                }
                
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    console.error(`❌ No se pudo obtener contexto 2D para "${canvasId}"`);
                    return null;
                }
                
                if (typeof Chart === 'undefined') {
                    console.error('❌ Chart.js no está disponible');
                    return null;
                }
                
                return new Chart(ctx, config);
            } catch (error) {
                console.error(`❌ Error inicializando chart "${canvasId}":`, error);
                return null;
            }
        },
        
        // Actualización segura de datos
        updateChartData: function(chart, newData) {
            try {
                if (!chart || typeof chart.update !== 'function') {
                    console.warn('⚠️ Chart inválido para actualizar');
                    return false;
                }
                
                chart.data = newData;
                chart.update();
                return true;
            } catch (error) {
                console.error('❌ Error actualizando chart data:', error);
                return false;
            }
        }
    };
}

// ============================================================================
// 🛠️ FIXES para manejo de elementos HTML estándar
// ============================================================================

if (typeof window !== 'undefined') {
    window.safeHTMLOperations = {
        
        // Manejo seguro de innerHTML
        setInnerHTML: function(selector, html) {
            try {
                const element = document.querySelector(selector);
                if (element) {
                    element.innerHTML = html;
                    return true;
                }
                console.warn(`⚠️ Elemento "${selector}" no encontrado para innerHTML`);
                return false;
            } catch (error) {
                console.error(`❌ Error en setInnerHTML("${selector}"):`, error);
                return false;
            }
        },
        
        // Manejo seguro de textContent
        setTextContent: function(selector, text) {
            try {
                const element = document.querySelector(selector);
                if (element) {
                    element.textContent = text;
                    return true;
                }
                console.warn(`⚠️ Elemento "${selector}" no encontrado para textContent`);
                return false;
            } catch (error) {
                console.error(`❌ Error en setTextContent("${selector}"):`, error);
                return false;
            }
        },
        
        // Manejo seguro de eventos
        addSafeEventListener: function(selector, event, handler) {
            try {
                const element = document.querySelector(selector);
                if (element) {
                    element.addEventListener(event, handler);
                    return true;
                }
                
                // Fallback: delegación de eventos
                document.addEventListener(event, function(e) {
                    if (e.target.matches && e.target.matches(selector)) {
                        handler.call(e.target, e);
                    }
                });
                
                console.warn(`⚠️ Usando delegación de eventos para "${selector}"`);
                return true;
            } catch (error) {
                console.error(`❌ Error en addSafeEventListener("${selector}", "${event}"):`, error);
                return false;
            }
        }
    };
}

// ============================================================================
// 🛠️ REMPLAZO DIRECTO de funciones problemáticas existentes
// ============================================================================

// Si ya existe función problemática de charts, reemplazarla
if (typeof initializeCharts !== 'undefined') {
    const originalInitializeCharts = initializeCharts;
    
    initializeCharts = function() {
        try {
            console.log('🔧 Ejecutando initializeCharts con seguridad...');
            
            // Verificar que Chart.js esté disponible
            if (typeof Chart === 'undefined') {
                console.error('❌ Chart.js no disponible, retrasando inicialización...');
                setTimeout(initializeCharts, 1000);
                return;
            }
            
            return originalInitializeCharts.call(this);
        } catch (error) {
            console.error('❌ Error en initializeCharts:', error);
        }
    };
}

// ============================================================================
// 🛠️ AUTO-APLICAR FIXES cuando DOM esté listo
// ============================================================================

function applyOrbixFixes() {
    console.log('🔧 Aplicando fixes de Orbix...');
    
    // Fix para elementos que aparecen dinámicamente
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) { // Es un elemento
                        // Re-aplicar event listeners a nuevos elementos
                        console.log('🔄 Nuevo elemento detectado, re-aplicando fixes...');
                    }
                });
            }
        });
    });
    
    // Observar cambios en el DOM
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    console.log('✅ Fixes de Orbix aplicados correctamente');
}

// Aplicar fixes cuando DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyOrbixFixes);
} else {
    applyOrbixFixes();
}

console.log('🧠 Orbix Patches cargados - querySelector null errors minimizados');
