/**
 * 🛡️ DOM Safety Utils - Orbix Systems
 * Funciones para evitar errores de querySelector nulo en Odoo y aplicaciones web
 * 
 * SOLUCIÓN PARA: "Cannot read properties of null (reading 'querySelector')"
 */

// 🔧 Utilidad principal para querySelector seguro
function safeQuerySelector(selector, context = document, throwError = false) {
    try {
        const element = context.querySelector(selector);
        if (!element && throwError) {
            console.warn(`⚠️ Elemento no encontrado: ${selector}`);
        }
        return element;
    } catch (error) {
        console.error(`❌ Error en querySelector para "${selector}":`, error);
        return null;
    }
}

// 🔧 Utilidad para querySelectorAll seguro
function safeQuerySelectorAll(selector, context = document) {
    try {
        const elements = context.querySelectorAll(selector);
        return elements || [];
    } catch (error) {
        console.error(`❌ Error en querySelectorAll para "${selector}":`, error);
        return [];
    }
}

// 🔧 Utilidad para getElementById seguro
function safeGetElementById(id, context = document) {
    try {
        const element = context.getElementById ? context.getElementById(id) : document.getElementById(id);
        if (!element) {
            console.warn(`⚠️ Elemento con ID "${id}" no encontrado`);
        }
        return element;
    } catch (error) {
        console.error(`❌ Error en getElementById para "${id}":`, error);
        return null;
    }
}

// 🔧 Utilidad para esperar a que aparezca un elemento
function waitForElement(selector, timeout = 5000, context = document) {
    return new Promise((resolve, reject) => {
        const element = safeQuerySelector(selector, context);
        if (element) {
            resolve(element);
            return;
        }

        const observer = new MutationObserver(() => {
            const element = safeQuerySelector(selector, context);
            if (element) {
                observer.disconnect();
                resolve(element);
            }
        });

        observer.observe(context, {
            childList: true,
            subtree: true
        });

        setTimeout(() => {
            observer.disconnect();
            reject(new Error(`⏰ Timeout: Elemento "${selector}" no encontrado en ${timeout}ms`));
        }, timeout);
    });
}

// 🔧 Manejo seguro de eventos DOM
function safeAddEventListener(selector, event, handler, context = document) {
    const element = safeQuerySelector(selector, context);
    if (element) {
        element.addEventListener(event, handler);
        return true;
    }
    console.warn(`⚠️ No se pudo agregar event listener a "${selector}"`);
    return false;
}

// 🔧 Manejo seguro de propiedades/valores
function safeSetProperty(selector, property, value, context = document) {
    const element = safeQuerySelector(selector, context);
    if (element) {
        try {
            if (property === 'innerHTML') {
                element.innerHTML = value;
            } else if (property === 'textContent') {
                element.textContent = value;
            } else if (property === 'value') {
                element.value = value;
            } else {
                element[property] = value;
            }
            return true;
        } catch (error) {
            console.error(`❌ Error al establecer propiedad "${property}":`, error);
        }
    }
    return false;
}

// 🔧 Obtener valor de forma segura
function safeGetProperty(selector, property, defaultValue = null, context = document) {
    const element = safeQuerySelector(selector, context);
    if (element) {
        try {
            return element[property] !== undefined ? element[property] : defaultValue;
        } catch (error) {
            console.error(`❌ Error al obtener propiedad "${property}":`, error);
        }
    }
    return defaultValue;
}

// 🔧 Manejo seguro de clases CSS
const safeCSSClass = {
    add: (selector, className, context = document) => {
        const element = safeQuerySelector(selector, context);
        if (element && element.classList) {
            element.classList.add(className);
            return true;
        }
        return false;
    },
    
    remove: (selector, className, context = document) => {
        const element = safeQuerySelector(selector, context);
        if (element && element.classList) {
            element.classList.remove(className);
            return true;
        }
        return false;
    },
    
    toggle: (selector, className, context = document) => {
        const element = safeQuerySelector(selector, context);
        if (element && element.classList) {
            element.classList.toggle(className);
            return true;
        }
        return false;
    },
    
    contains: (selector, className, context = document) => {
        const element = safeQuerySelector(selector, context);
        if (element && element.classList) {
            return element.classList.contains(className);
        }
        return false;
    }
};

// 🔧 Manejo seguro para formularios Odoo
function safeOdooFormField(fieldName, value = null, action = 'get') {
    const selectors = [
        `input[name="${fieldName}"]`,
        `select[name="${fieldName}"]`,
        `textarea[name="${fieldName}"]`,
        `.o_field_widget[name="${fieldName}"] input`,
        `.o_field_widget[name="${fieldName}"] select`,
        `.o_field_widget[name="${fieldName}"] textarea`,
        `[data-field-name="${fieldName}"]`
    ];
    
    for (const selector of selectors) {
        const element = safeQuerySelector(selector);
        if (element) {
            if (action === 'get') {
                return element.value || element.textContent || null;
            } else if (action === 'set' && value !== null) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.value = value;
                } else {
                    element.textContent = value;
                }
                
                // Disparar evento change para Odoo
                const event = new Event('change', { bubbles: true });
                element.dispatchEvent(event);
                return true;
            }
        }
    }
    
    console.warn(`⚠️ Campo Odoo "${fieldName}" no encontrado`);
    return action === 'get' ? null : false;
}

// 🔧 Manejo específico para menús y vistas Odoo
function safeOdooView(viewSelector, action = 'check') {
    const commonSelectors = [
        '.o_form_view',
        '.o_list_view', 
        '.o_kanban_view',
        '.o_pivot_view',
        '.o_graph_view',
        '.breadcrumb',
        '.o_control_panel',
        '.o_main_content',
        viewSelector
    ];
    
    for (const selector of commonSelectors) {
        const element = safeQuerySelector(selector);
        if (element) {
            if (action === 'check') {
                return true;
            } else if (action === 'click') {
                element.click();
                return true;
            }
        }
    }
    
    return false;
}

// 🔧 Wrapper seguro para D3.js (usado en tu código avatar)
function safeD3Select(selector) {
    if (typeof d3 !== 'undefined') {
        try {
            const selection = d3.select(selector);
            return !selection.empty() ? selection : null;
        } catch (error) {
            console.error(`❌ Error en d3.select para "${selector}":`, error);
            return null;
        }
    }
    return null;
}

// 🔧 DOM Ready mejorado
function safeDOMReady(callback) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', callback);
    } else {
        // DOM ya está listo
        callback();
    }
}

// 🔧 Debugging helper
function debugDOMState() {
    console.log('🔍 Estado del DOM:', {
        readyState: document.readyState,
        hasBody: !!document.body,
        bodyChildren: document.body?.children?.length || 0,
        timestamp: new Date().toISOString()
    });
}

// 🚀 Auto-aplicar en elementos comunes problemáticos
safeDOMReady(() => {
    console.log('✅ DOM Safety Utils cargado correctamente');
    
    // Verificar elementos comunes que fallan
    const problematicSelectors = [
        '.o_form_view',
        '.breadcrumb', 
        '#input',
        '.chart-container',
        '.mi-clase-dinámica'
    ];
    
    problematicSelectors.forEach(selector => {
        const element = safeQuerySelector(selector);
        if (!element) {
            console.info(`ℹ️ Elemento "${selector}" no presente actualmente`);
        }
    });
});

// 🌐 Exportar para uso global
if (typeof window !== 'undefined') {
    window.orbixSafeDOM = {
        safeQuerySelector,
        safeQuerySelectorAll,
        safeGetElementById,
        waitForElement,
        safeAddEventListener,
        safeSetProperty,
        safeGetProperty,
        safeCSSClass,
        safeOdooFormField,
        safeOdooView,
        safeD3Select,
        safeDOMReady,
        debugDOMState
    };
    
    console.log('🧠 Orbix DOM Safety Utils disponibles en window.orbixSafeDOM');
}

// 📦 Export para módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        safeQuerySelector,
        safeQuerySelectorAll,
        safeGetElementById,
        waitForElement,
        safeAddEventListener,
        safeSetProperty,
        safeGetProperty,
        safeCSSClass,
        safeOdooFormField,
        safeOdooView,
        safeD3Select,
        safeDOMReady,
        debugDOMState
    };
}
