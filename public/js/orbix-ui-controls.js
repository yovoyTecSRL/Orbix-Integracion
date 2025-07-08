/**
 * Orbix UI Controls - Manejo de overlays y controles principales
 * Implementa la funcionalidad de Avatar AI, Editor y Dashboard
 */

class OrbixUIControls {
    constructor() {
        this.isAvatarActive = false;
        this.isDashboardOpen = false;
        this.isEditorOpen = false;
        
        // Referencias a elementos del DOM
        this.avatarToggle = null;
        this.editorToggle = null;
        this.dashboardToggle = null;
        
        this.avatarOverlay = null;
        this.editorOverlay = null;
        this.dashboardOverlay = null;
        
        this.init();
    }

    async init() {
        // Esperar a que el DOM esté completamente cargado
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupUI());
        } else {
            this.setupUI();
        }
    }

    setupUI() {
        try {
            this.createOverlays();
            this.bindEvents();
            this.setupKeyboardShortcuts();
            console.log('✅ Orbix UI Controls inicializados correctamente');
        } catch (error) {
            console.error('❌ Error al inicializar Orbix UI Controls:', error);
        }
    }

    createOverlays() {
        // Crear overlay del avatar si no existe
        if (!document.getElementById('avatar-overlay')) {
            this.avatarOverlay = this.createElement('div', {
                id: 'avatar-overlay',
                className: 'avatar-overlay',
                innerHTML: `
                    <div class="avatar-overlay-content">
                        <button class="overlay-close" id="avatar-close" title="Cerrar Avatar">×</button>
                        <div class="avatar-wrapper">
                            <div id="avatar-canvas-container">
                                <!-- Aquí se renderizará el avatar 3D -->
                                <canvas id="avatar-canvas"></canvas>
                            </div>
                            <div class="avatar-controls">
                                <div class="chat-container">
                                    <div class="chat-messages" id="avatar-chat-messages">
                                        <div class="message bot-message">
                                            <div class="message-content">
                                                ¡Hola! Soy tu asistente virtual de Orbix. ¿En qué puedo ayudarte hoy?
                                            </div>
                                        </div>
                                    </div>
                                    <div class="chat-input-container">
                                        <input type="text" id="avatar-chat-input" placeholder="Escribe tu mensaje aquí..." />
                                        <button id="avatar-chat-send" title="Enviar mensaje">📤</button>
                                        <button id="avatar-voice-toggle" title="Activar/Desactivar voz">🎤</button>
                                        <button id="avatar-settings-btn" title="Configuraciones">⚙️</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `
            });
            document.body.appendChild(this.avatarOverlay);
        }

        // Crear overlay del dashboard si no existe
        if (!document.getElementById('dashboard-overlay')) {
            this.dashboardOverlay = this.createElement('div', {
                id: 'dashboard-overlay',
                className: 'dashboard-overlay',
                innerHTML: `
                    <div class="dashboard-header">
                        <h3>📊 Dashboard Orbix</h3>
                        <button class="overlay-close" id="dashboard-close" title="Cerrar Dashboard">×</button>
                    </div>
                    <div class="dashboard-content">
                        <div class="dashboard-section">
                            <h4>📈 Métricas en Tiempo Real</h4>
                            <div class="metrics-grid">
                                <div class="metric-card">
                                    <div class="metric-value">1,247</div>
                                    <div class="metric-label">Usuarios Activos</div>
                                </div>
                                <div class="metric-card">
                                    <div class="metric-value">98.5%</div>
                                    <div class="metric-label">Disponibilidad</div>
                                </div>
                                <div class="metric-card">
                                    <div class="metric-value">156</div>
                                    <div class="metric-label">Validaciones/hr</div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="dashboard-section">
                            <h4>🔐 Estado de Seguridad</h4>
                            <div class="security-status">
                                <div class="status-item safe">
                                    <span class="status-icon">🛡️</span>
                                    <span class="status-text">Todos los sistemas seguros</span>
                                </div>
                                <div class="status-item">
                                    <span class="status-icon">🔍</span>
                                    <span class="status-text">Monitoreo activo</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="dashboard-section">
                            <h4>📋 Accesos Rápidos</h4>
                            <div class="quick-actions">
                                <button class="action-btn" onclick="window.open('/validaciones', '_blank')">
                                    <span class="action-icon">✅</span>
                                    <span class="action-text">Validaciones</span>
                                </button>
                                <button class="action-btn" onclick="window.open('/calculadora', '_blank')">
                                    <span class="action-icon">🧮</span>
                                    <span class="action-text">Calculadora</span>
                                </button>
                                <button class="action-btn" onclick="window.open('/sentinel', '_blank')">
                                    <span class="action-icon">🛡️</span>
                                    <span class="action-text">Sentinel</span>
                                </button>
                                <button class="action-btn" onclick="window.open('https://erp.sistemasorbix.com', '_blank')">
                                    <span class="action-icon">🚀</span>
                                    <span class="action-text">ERP</span>
                                </button>
                            </div>
                        </div>
                    </div>
                `
            });
            document.body.appendChild(this.dashboardOverlay);
        }

        // Crear overlay del editor si no existe
        if (!document.getElementById('editor-overlay')) {
            this.editorOverlay = this.createElement('div', {
                id: 'editor-overlay',
                className: 'editor-overlay',
                innerHTML: `
                    <div class="editor-header">
                        <h3>✏️ Editor de Avatar</h3>
                        <button class="overlay-close" id="editor-close" title="Cerrar Editor">×</button>
                    </div>
                    <div class="editor-content">
                        <div class="editor-tabs">
                            <button class="editor-tab active" data-tab="appearance">👤 Apariencia</button>
                            <button class="editor-tab" data-tab="voice">🔊 Voz</button>
                            <button class="editor-tab" data-tab="behavior">🎭 Comportamiento</button>
                            <button class="editor-tab" data-tab="advanced">⚙️ Avanzado</button>
                        </div>
                        
                        <div class="editor-panels">
                            <div class="editor-panel active" id="appearance-panel">
                                <div class="editor-section">
                                    <h4>Modelo 3D</h4>
                                    <div class="model-selector">
                                        <div class="model-option active" data-model="default">
                                            <img src="/avatar/models/preview/default.png" alt="Modelo por defecto" onerror="this.style.display='none'" />
                                            <span>Por Defecto</span>
                                        </div>
                                        <div class="model-option" data-model="business">
                                            <img src="/avatar/models/preview/business.png" alt="Modelo ejecutivo" onerror="this.style.display='none'" />
                                            <span>Ejecutivo</span>
                                        </div>
                                        <div class="model-option" data-model="casual">
                                            <img src="/avatar/models/preview/casual.png" alt="Modelo casual" onerror="this.style.display='none'" />
                                            <span>Casual</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="editor-section">
                                    <h4>Posición y Tamaño</h4>
                                    <div class="control-group">
                                        <label>Posición X: <span id="pos-x-value">50</span>%</label>
                                        <input type="range" id="pos-x" min="0" max="100" value="50" />
                                    </div>
                                    <div class="control-group">
                                        <label>Posición Y: <span id="pos-y-value">50</span>%</label>
                                        <input type="range" id="pos-y" min="0" max="100" value="50" />
                                    </div>
                                    <div class="control-group">
                                        <label>Tamaño: <span id="scale-value">100</span>%</label>
                                        <input type="range" id="scale" min="50" max="200" value="100" />
                                    </div>
                                </div>
                            </div>
                            
                            <div class="editor-panel" id="voice-panel">
                                <div class="editor-section">
                                    <h4>Configuración de Voz</h4>
                                    <div class="control-group">
                                        <label for="voice-select">Seleccionar Voz:</label>
                                        <select id="voice-select">
                                            <option value="default">Voz por defecto</option>
                                            <option value="female1">Mujer joven</option>
                                            <option value="male1">Hombre joven</option>
                                            <option value="female2">Mujer madura</option>
                                            <option value="male2">Hombre maduro</option>
                                        </select>
                                    </div>
                                    <div class="control-group">
                                        <label>Velocidad: <span id="speech-rate-value">1.0</span>x</label>
                                        <input type="range" id="speech-rate" min="0.5" max="2.0" step="0.1" value="1.0" />
                                    </div>
                                    <div class="control-group">
                                        <label>Tono: <span id="speech-pitch-value">1.0</span></label>
                                        <input type="range" id="speech-pitch" min="0.5" max="2.0" step="0.1" value="1.0" />
                                    </div>
                                    <div class="control-group">
                                        <button id="test-voice" class="test-btn">🔊 Probar Voz</button>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="editor-panel" id="behavior-panel">
                                <div class="editor-section">
                                    <h4>Personalidad</h4>
                                    <div class="control-group">
                                        <label for="personality-select">Tipo de Personalidad:</label>
                                        <select id="personality-select">
                                            <option value="professional">Profesional</option>
                                            <option value="friendly">Amigable</option>
                                            <option value="casual">Casual</option>
                                            <option value="expert">Experto Técnico</option>
                                        </select>
                                    </div>
                                    <div class="control-group">
                                        <label>
                                            <input type="checkbox" id="auto-expressions" checked />
                                            Expresiones automáticas
                                        </label>
                                    </div>
                                    <div class="control-group">
                                        <label>
                                            <input type="checkbox" id="idle-animations" checked />
                                            Animaciones en reposo
                                        </label>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="editor-panel" id="advanced-panel">
                                <div class="editor-section">
                                    <h4>Configuración Avanzada</h4>
                                    <div class="control-group">
                                        <label>
                                            <input type="checkbox" id="enable-lip-sync" checked />
                                            Sincronización labial
                                        </label>
                                    </div>
                                    <div class="control-group">
                                        <label>
                                            <input type="checkbox" id="enable-gestures" checked />
                                            Gestos automáticos
                                        </label>
                                    </div>
                                    <div class="control-group">
                                        <label>Calidad de renderizado:</label>
                                        <select id="render-quality">
                                            <option value="low">Baja (mejor rendimiento)</option>
                                            <option value="medium" selected>Media</option>
                                            <option value="high">Alta (mejor calidad)</option>
                                        </select>
                                    </div>
                                    <div class="control-group">
                                        <button id="reset-settings" class="reset-btn">🔄 Restablecer a valores por defecto</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="editor-actions">
                            <button id="save-avatar-settings" class="save-btn">💾 Guardar Configuración</button>
                            <button id="export-avatar-config" class="export-btn">📤 Exportar</button>
                            <button id="import-avatar-config" class="import-btn">📥 Importar</button>
                        </div>
                    </div>
                `
            });
            document.body.appendChild(this.editorOverlay);
        }

        // Actualizar referencias
        this.avatarOverlay = document.getElementById('avatar-overlay');
        this.dashboardOverlay = document.getElementById('dashboard-overlay');
        this.editorOverlay = document.getElementById('editor-overlay');
    }

    bindEvents() {
        // Obtener referencias a los botones principales
        this.avatarToggle = document.getElementById('avatar-toggle');
        this.editorToggle = document.getElementById('avatar-editor-toggle');
        this.dashboardToggle = document.getElementById('dashboard-toggle');

        // Eventos de los botones principales
        if (this.avatarToggle) {
            this.avatarToggle.addEventListener('click', () => this.toggleAvatar());
        }

        if (this.editorToggle) {
            this.editorToggle.addEventListener('click', () => this.toggleEditor());
        }

        if (this.dashboardToggle) {
            this.dashboardToggle.addEventListener('click', () => this.toggleDashboard());
        }

        // Eventos de cierre de overlays
        document.addEventListener('click', (event) => {
            if (event.target.classList.contains('overlay-close')) {
                this.closeAllOverlays();
            }
        });

        // Cerrar overlays con Escape
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                this.closeAllOverlays();
            }
        });

        // Eventos del editor
        this.bindEditorEvents();

        // Eventos del chat del avatar
        this.bindChatEvents();
    }

    bindEditorEvents() {
        // Tabs del editor
        document.addEventListener('click', (event) => {
            if (event.target.classList.contains('editor-tab')) {
                this.switchEditorTab(event.target.dataset.tab);
            }
        });

        // Controles deslizantes del editor
        const sliders = ['pos-x', 'pos-y', 'scale', 'speech-rate', 'speech-pitch'];
        sliders.forEach(sliderId => {
            const slider = document.getElementById(sliderId);
            if (slider) {
                slider.addEventListener('input', (event) => {
                    this.updateSliderValue(sliderId, event.target.value);
                });
            }
        });

        // Botones del editor
        const testVoiceBtn = document.getElementById('test-voice');
        if (testVoiceBtn) {
            testVoiceBtn.addEventListener('click', () => this.testVoice());
        }

        const resetBtn = document.getElementById('reset-settings');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetAvatarSettings());
        }

        const saveBtn = document.getElementById('save-avatar-settings');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveAvatarSettings());
        }
    }

    bindChatEvents() {
        const chatInput = document.getElementById('avatar-chat-input');
        const chatSend = document.getElementById('avatar-chat-send');
        const voiceToggle = document.getElementById('avatar-voice-toggle');
        const settingsBtn = document.getElementById('avatar-settings-btn');

        if (chatInput) {
            chatInput.addEventListener('keypress', (event) => {
                if (event.key === 'Enter') {
                    this.sendChatMessage();
                }
            });
        }

        if (chatSend) {
            chatSend.addEventListener('click', () => this.sendChatMessage());
        }

        if (voiceToggle) {
            voiceToggle.addEventListener('click', () => this.toggleVoiceInput());
        }

        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => {
                this.closeAllOverlays();
                setTimeout(() => this.toggleEditor(), 100);
            });
        }
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (event) => {
            // Ctrl/Cmd + Shift + A para toggle avatar
            if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'A') {
                event.preventDefault();
                this.toggleAvatar();
            }
            
            // Ctrl/Cmd + Shift + D para toggle dashboard
            if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'D') {
                event.preventDefault();
                this.toggleDashboard();
            }
            
            // Ctrl/Cmd + Shift + E para toggle editor
            if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'E') {
                event.preventDefault();
                this.toggleEditor();
            }
        });
    }

    toggleAvatar() {
        this.isAvatarActive = !this.isAvatarActive;
        
        if (this.isAvatarActive) {
            this.showAvatarOverlay();
            this.avatarToggle?.classList.add('active');
        } else {
            this.hideAvatarOverlay();
            this.avatarToggle?.classList.remove('active');
        }
    }

    toggleDashboard() {
        this.isDashboardOpen = !this.isDashboardOpen;
        
        if (this.isDashboardOpen) {
            this.showDashboardOverlay();
        } else {
            this.hideDashboardOverlay();
        }
    }

    toggleEditor() {
        this.isEditorOpen = !this.isEditorOpen;
        
        if (this.isEditorOpen) {
            this.showEditorOverlay();
        } else {
            this.hideEditorOverlay();
        }
    }

    showAvatarOverlay() {
        if (this.avatarOverlay) {
            this.avatarOverlay.classList.add('show');
            // Inicializar avatar si está disponible
            if (window.TalkingHeadAvatar && window.TalkingHeadAvatar.instance) {
                window.TalkingHeadAvatar.instance.setVisible(true);
            }
        }
    }

    hideAvatarOverlay() {
        if (this.avatarOverlay) {
            this.avatarOverlay.classList.remove('show');
            // Ocultar avatar si está disponible
            if (window.TalkingHeadAvatar && window.TalkingHeadAvatar.instance) {
                window.TalkingHeadAvatar.instance.setVisible(false);
            }
        }
    }

    showDashboardOverlay() {
        if (this.dashboardOverlay) {
            this.dashboardOverlay.classList.add('show');
        }
    }

    hideDashboardOverlay() {
        if (this.dashboardOverlay) {
            this.dashboardOverlay.classList.remove('show');
        }
    }

    showEditorOverlay() {
        if (this.editorOverlay) {
            this.editorOverlay.classList.add('show');
        }
    }

    hideEditorOverlay() {
        if (this.editorOverlay) {
            this.editorOverlay.classList.remove('show');
        }
    }

    closeAllOverlays() {
        this.isAvatarActive = false;
        this.isDashboardOpen = false;
        this.isEditorOpen = false;
        
        this.hideAvatarOverlay();
        this.hideDashboardOverlay();
        this.hideEditorOverlay();
        
        this.avatarToggle?.classList.remove('active');
    }

    switchEditorTab(tabName) {
        // Actualizar tabs activos
        document.querySelectorAll('.editor-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`)?.classList.add('active');

        // Actualizar paneles activos
        document.querySelectorAll('.editor-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        document.getElementById(`${tabName}-panel`)?.classList.add('active');
    }

    updateSliderValue(sliderId, value) {
        const valueElement = document.getElementById(`${sliderId}-value`);
        if (valueElement) {
            if (sliderId.includes('speech')) {
                valueElement.textContent = parseFloat(value).toFixed(1);
            } else {
                valueElement.textContent = Math.round(value);
            }
        }

        // Aplicar cambios en tiempo real al avatar si está disponible
        this.applyAvatarSetting(sliderId, value);
    }

    applyAvatarSetting(settingName, value) {
        if (window.TalkingHeadAvatar && window.TalkingHeadAvatar.instance) {
            const avatar = window.TalkingHeadAvatar.instance;
            
            switch (settingName) {
                case 'pos-x':
                    avatar.setPosition(parseFloat(value), null);
                    break;
                case 'pos-y':
                    avatar.setPosition(null, parseFloat(value));
                    break;
                case 'scale':
                    avatar.setScale(parseFloat(value) / 100);
                    break;
                case 'speech-rate':
                    avatar.setSpeechRate(parseFloat(value));
                    break;
                case 'speech-pitch':
                    avatar.setSpeechPitch(parseFloat(value));
                    break;
            }
        }
    }

    sendChatMessage() {
        const chatInput = document.getElementById('avatar-chat-input');
        const chatMessages = document.getElementById('avatar-chat-messages');
        
        if (!chatInput || !chatMessages) return;
        
        const message = chatInput.value.trim();
        if (!message) return;
        
        // Agregar mensaje del usuario
        this.addChatMessage(message, 'user');
        
        // Limpiar input
        chatInput.value = '';
        
        // Simular respuesta del avatar (aquí se integraría con la IA real)
        setTimeout(() => {
            const responses = [
                "Entiendo tu consulta. ¿Puedes ser más específico?",
                "Estoy aquí para ayudarte con cualquier duda sobre Orbix Systems.",
                "Esa es una excelente pregunta. Déjame buscar la información más actualizada.",
                "¿Te gustaría que te explique más detalles sobre nuestros servicios?",
                "Puedo ayudarte con validaciones, cálculos financieros o monitoreo de seguridad."
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            this.addChatMessage(randomResponse, 'bot');
            
            // Hacer que el avatar hable si está disponible
            if (window.TalkingHeadAvatar && window.TalkingHeadAvatar.instance) {
                window.TalkingHeadAvatar.instance.speak(randomResponse);
            }
        }, 1000);
    }

    addChatMessage(message, sender) {
        const chatMessages = document.getElementById('avatar-chat-messages');
        if (!chatMessages) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        messageDiv.innerHTML = `
            <div class="message-content">${this.escapeHtml(message)}</div>
            <div class="message-time">${new Date().toLocaleTimeString()}</div>
        `;
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    testVoice() {
        const testText = "Hola, soy tu asistente virtual de Orbix Systems. ¿En qué puedo ayudarte hoy?";
        
        if (window.TalkingHeadAvatar && window.TalkingHeadAvatar.instance) {
            window.TalkingHeadAvatar.instance.speak(testText);
        } else {
            // Fallback a Web Speech API
            if ('speechSynthesis' in window) {
                const utterance = new SpeechSynthesisUtterance(testText);
                utterance.lang = 'es-ES';
                speechSynthesis.speak(utterance);
            }
        }
    }

    toggleVoiceInput() {
        // Implementar reconocimiento de voz
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
            recognition.lang = 'es-ES';
            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                const chatInput = document.getElementById('avatar-chat-input');
                if (chatInput) {
                    chatInput.value = transcript;
                }
            };
            recognition.start();
        } else {
            alert('Tu navegador no soporta reconocimiento de voz.');
        }
    }

    saveAvatarSettings() {
        const settings = {
            posX: document.getElementById('pos-x')?.value || 50,
            posY: document.getElementById('pos-y')?.value || 50,
            scale: document.getElementById('scale')?.value || 100,
            speechRate: document.getElementById('speech-rate')?.value || 1.0,
            speechPitch: document.getElementById('speech-pitch')?.value || 1.0,
            voice: document.getElementById('voice-select')?.value || 'default',
            personality: document.getElementById('personality-select')?.value || 'professional',
            autoExpressions: document.getElementById('auto-expressions')?.checked || true,
            idleAnimations: document.getElementById('idle-animations')?.checked || true,
            enableLipSync: document.getElementById('enable-lip-sync')?.checked || true,
            enableGestures: document.getElementById('enable-gestures')?.checked || true,
            renderQuality: document.getElementById('render-quality')?.value || 'medium'
        };
        
        localStorage.setItem('orbix-avatar-settings', JSON.stringify(settings));
        
        // Mostrar confirmación
        this.showNotification('Configuración guardada correctamente', 'success');
    }

    resetAvatarSettings() {
        if (confirm('¿Estás seguro de que quieres restablecer toda la configuración?')) {
            localStorage.removeItem('orbix-avatar-settings');
            location.reload(); // Recargar para aplicar configuración por defecto
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `orbix-notification ${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
            color: white;
            border-radius: 8px;
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    createElement(tag, options = {}) {
        const element = document.createElement(tag);
        
        Object.keys(options).forEach(key => {
            if (key === 'innerHTML') {
                element.innerHTML = options[key];
            } else {
                element[key] = options[key];
            }
        });
        
        return element;
    }
}

// Inicializar cuando el DOM esté listo
if (typeof window !== 'undefined') {
    window.OrbixUIControls = new OrbixUIControls();
}
