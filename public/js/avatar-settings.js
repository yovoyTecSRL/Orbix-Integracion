/**
 * ⚙️ Avatar Settings Panel - Orbix AI Platform
 * Panel de configuración visual para el sistema de avatares
 */

class AvatarSettings {
    constructor() {
        this.isOpen = false;
        this.panel = null;
        this.availableAvatars = [
            { name: 'Zoile (Brunette)', file: '/avatars/brunette.glb', preview: '/avatars/previews/brunette.jpg' },
            { name: 'Emma (Blonde)', file: '/avatars/emma.glb', preview: '/avatars/previews/emma.jpg' },
            { name: 'Alex (Corporate)', file: '/avatars/alex.glb', preview: '/avatars/previews/alex.jpg' }
        ];
        this.init();
    }

    init() {
        this.createPanel();
        this.setupEventListeners();
        this.loadCurrentSettings();
        console.log('⚙️ Avatar Settings Panel inicializado');
    }

    createPanel() {
        // Crear botón de configuración
        const settingsBtn = document.createElement('button');
        settingsBtn.id = 'avatar-settings-btn';
        settingsBtn.className = 'settings-toggle-btn';
        settingsBtn.innerHTML = '⚙️';
        settingsBtn.title = 'Configurar Avatar (Ctrl + /)';
        document.body.appendChild(settingsBtn);

        // Crear panel principal
        this.panel = document.createElement('div');
        this.panel.id = 'avatar-settings-panel';
        this.panel.className = 'avatar-settings-panel';
        this.panel.innerHTML = this.createPanelHTML();
        document.body.appendChild(this.panel);

        // Crear overlay
        const overlay = document.createElement('div');
        overlay.id = 'settings-overlay';
        overlay.className = 'settings-overlay';
        document.body.appendChild(overlay);
    }

    createPanelHTML() {
        return `
            <div class="settings-header">
                <h3>🎭 Configuración del Avatar</h3>
                <button class="close-btn" id="close-settings">✕</button>
            </div>
            
            <div class="settings-content">
                <!-- Información del Avatar -->
                <div class="settings-section">
                    <h4>📋 Información</h4>
                    <div class="input-group">
                        <label for="avatar-name">Nombre del Avatar:</label>
                        <input type="text" id="avatar-name" value="Zoile" maxlength="20">
                    </div>
                </div>

                <!-- Selección de Modelo -->
                <div class="settings-section">
                    <h4>🎨 Modelo 3D</h4>
                    <div class="avatar-gallery">
                        ${this.availableAvatars.map(avatar => `
                            <div class="avatar-option" data-file="${avatar.file}">
                                <div class="avatar-preview" style="background-image: url('${avatar.preview}')"></div>
                                <span class="avatar-label">${avatar.name}</span>
                                <div class="avatar-radio">
                                    <input type="radio" name="avatar-model" value="${avatar.file}" id="model-${avatar.file.split('/').pop()}">
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Configuración de Animaciones -->
                <div class="settings-section">
                    <h4>🎬 Animaciones</h4>
                    <div class="toggle-group">
                        <div class="toggle-item">
                            <label class="toggle-switch">
                                <input type="checkbox" id="enable-movement" checked>
                                <span class="slider"></span>
                            </label>
                            <span class="toggle-label">Movimiento Natural</span>
                        </div>
                        
                        <div class="toggle-item">
                            <label class="toggle-switch">
                                <input type="checkbox" id="enable-blinking" checked>
                                <span class="slider"></span>
                            </label>
                            <span class="toggle-label">Parpadeo Automático</span>
                        </div>
                        
                        <div class="toggle-item">
                            <label class="toggle-switch">
                                <input type="checkbox" id="enable-breathing" checked>
                                <span class="slider"></span>
                            </label>
                            <span class="toggle-label">Respiración Sutil</span>
                        </div>
                        
                        <div class="toggle-item">
                            <label class="toggle-switch">
                                <input type="checkbox" id="enable-lipsync" checked>
                                <span class="slider"></span>
                            </label>
                            <span class="toggle-label">Sincronización Labial</span>
                        </div>
                    </div>
                </div>

                <!-- Configuración Avanzada -->
                <div class="settings-section">
                    <h4>🔧 Avanzado</h4>
                    <div class="input-group">
                        <label for="animation-speed">Velocidad de Animación:</label>
                        <div class="range-container">
                            <input type="range" id="animation-speed" min="0.1" max="2" step="0.1" value="1">
                            <span class="range-value">1.0x</span>
                        </div>
                    </div>
                </div>

                <!-- Vista Previa -->
                <div class="settings-section">
                    <h4>👁️ Pruebas</h4>
                    <div class="test-buttons">
                        <button class="test-btn" id="test-blink">💫 Parpadear</button>
                        <button class="test-btn" id="test-talk">🗣️ Hablar</button>
                        <button class="test-btn" id="test-reset">🔄 Reset</button>
                    </div>
                </div>
            </div>

            <div class="settings-footer">
                <button class="btn-secondary" id="restore-defaults">Restaurar</button>
                <button class="btn-primary" id="save-settings">💾 Guardar Cambios</button>
            </div>
        `;
    }

    setupEventListeners() {
        // Botón de abrir/cerrar
        document.getElementById('avatar-settings-btn').addEventListener('click', () => {
            this.toggle();
        });

        // Cerrar panel
        document.getElementById('close-settings').addEventListener('click', () => {
            this.close();
        });

        // Overlay para cerrar
        document.getElementById('settings-overlay').addEventListener('click', () => {
            this.close();
        });

        // Teclas de acceso rápido
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === '/') {
                e.preventDefault();
                this.toggle();
            }
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });

        // Configuración en tiempo real
        this.setupRealtimeControls();

        // Botones de acción
        document.getElementById('save-settings').addEventListener('click', () => {
            this.saveSettings();
        });

        document.getElementById('restore-defaults').addEventListener('click', () => {
            this.restoreDefaults();
        });

        // Botones de prueba
        document.getElementById('test-blink').addEventListener('click', () => {
            if (window.avatarManager) {
                window.avatarManager.blink();
            }
        });

        document.getElementById('test-talk').addEventListener('click', () => {
            if (window.avatarManager) {
                window.avatarManager.startTalking();
                setTimeout(() => window.avatarManager.stopTalking(), 3000);
            }
        });

        document.getElementById('test-reset').addEventListener('click', () => {
            if (window.avatarManager) {
                window.avatarManager.stopTalking();
            }
        });
    }

    setupRealtimeControls() {
        // Nombre del avatar
        document.getElementById('avatar-name').addEventListener('input', (e) => {
            if (window.avatarManager) {
                window.avatarManager.updateConfig('name', e.target.value);
            }
        });

        // Selección de modelo
        document.querySelectorAll('input[name="avatar-model"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                if (e.target.checked && window.avatarManager) {
                    window.avatarManager.updateConfig('model', e.target.value);
                }
            });
        });

        // Toggles de animación
        document.getElementById('enable-movement').addEventListener('change', (e) => {
            if (window.avatarManager) {
                window.avatarManager.updateConfig('enableMovement', e.target.checked);
            }
        });

        document.getElementById('enable-blinking').addEventListener('change', (e) => {
            if (window.avatarManager) {
                window.avatarManager.updateConfig('enableBlinking', e.target.checked);
            }
        });

        document.getElementById('enable-breathing').addEventListener('change', (e) => {
            if (window.avatarManager) {
                window.avatarManager.updateConfig('enableBreathing', e.target.checked);
            }
        });

        document.getElementById('enable-lipsync').addEventListener('change', (e) => {
            if (window.avatarManager) {
                window.avatarManager.updateConfig('enableLipSync', e.target.checked);
            }
        });

        // Velocidad de animación
        const speedSlider = document.getElementById('animation-speed');
        const speedValue = document.querySelector('.range-value');
        
        speedSlider.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            speedValue.textContent = `${value.toFixed(1)}x`;
            
            if (window.avatarManager) {
                window.avatarManager.updateConfig('animationSpeed', value);
            }
        });
    }

    loadCurrentSettings() {
        if (!window.avatarManager) return;

        const config = window.avatarManager.config;

        // Cargar valores actuales
        document.getElementById('avatar-name').value = config.name || 'Zoile';
        document.getElementById('enable-movement').checked = config.enableMovement;
        document.getElementById('enable-blinking').checked = config.enableBlinking;
        document.getElementById('enable-breathing').checked = config.enableBreathing;
        document.getElementById('enable-lipsync').checked = config.enableLipSync;
        document.getElementById('animation-speed').value = config.animationSpeed;
        document.querySelector('.range-value').textContent = `${config.animationSpeed.toFixed(1)}x`;

        // Marcar modelo seleccionado
        const modelRadio = document.querySelector(`input[value="${config.model}"]`);
        if (modelRadio) {
            modelRadio.checked = true;
        }
    }

    saveSettings() {
        const settings = this.getCurrentSettings();
        
        // Guardar en el avatar manager
        Object.entries(settings).forEach(([key, value]) => {
            if (window.avatarManager) {
                window.avatarManager.updateConfig(key, value);
            }
        });

        // Mostrar confirmación
        this.showNotification('✅ Configuración guardada correctamente', 'success');
        
        // Cerrar panel después de guardar
        setTimeout(() => this.close(), 1000);
    }

    getCurrentSettings() {
        return {
            name: document.getElementById('avatar-name').value,
            model: document.querySelector('input[name="avatar-model"]:checked')?.value || '/avatars/brunette.glb',
            enableMovement: document.getElementById('enable-movement').checked,
            enableBlinking: document.getElementById('enable-blinking').checked,
            enableBreathing: document.getElementById('enable-breathing').checked,
            enableLipSync: document.getElementById('enable-lipsync').checked,
            animationSpeed: parseFloat(document.getElementById('animation-speed').value)
        };
    }

    restoreDefaults() {
        const defaults = {
            name: 'Zoile',
            model: '/avatars/brunette.glb',
            enableMovement: true,
            enableBlinking: true,
            enableBreathing: true,
            enableLipSync: true,
            animationSpeed: 1.0
        };

        // Aplicar valores por defecto a la UI
        document.getElementById('avatar-name').value = defaults.name;
        document.getElementById('enable-movement').checked = defaults.enableMovement;
        document.getElementById('enable-blinking').checked = defaults.enableBlinking;
        document.getElementById('enable-breathing').checked = defaults.enableBreathing;
        document.getElementById('enable-lipsync').checked = defaults.enableLipSync;
        document.getElementById('animation-speed').value = defaults.animationSpeed;
        document.querySelector('.range-value').textContent = `${defaults.animationSpeed.toFixed(1)}x`;

        const defaultModelRadio = document.querySelector(`input[value="${defaults.model}"]`);
        if (defaultModelRadio) {
            defaultModelRadio.checked = true;
        }

        this.showNotification('🔄 Configuración restaurada por defecto', 'info');
    }

    open() {
        if (this.isOpen) return;
        
        this.isOpen = true;
        this.panel.classList.add('active');
        document.getElementById('settings-overlay').classList.add('active');
        document.body.classList.add('settings-open');
        
        // Cargar configuración actual
        this.loadCurrentSettings();
        
        // Focus en el primer input
        setTimeout(() => {
            document.getElementById('avatar-name').focus();
        }, 300);
    }

    close() {
        if (!this.isOpen) return;
        
        this.isOpen = false;
        this.panel.classList.remove('active');
        document.getElementById('settings-overlay').classList.remove('active');
        document.body.classList.remove('settings-open');
    }

    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `settings-notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animar entrada
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Auto-remover
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.avatarSettings = new AvatarSettings();
});

export default AvatarSettings;

class AvatarSettingsPanel {
    constructor() {
        this.settings = {};
        this.panel = null;
        this.overlay = null;
    }

    applyGlobalSettings() {
        // Modo oscuro
        document.body.classList.toggle('dark-mode', this.settings.darkMode);
        
        // Posición del chat
        this.updateChatPosition(this.settings.chatPosition);
        
        // Calidad de render
        this.updateRenderQuality(this.settings.quality);
    }

    loadSettings() {
        const saved = localStorage.getItem('orbix-avatar-settings');
        if (saved) {
            try {
                this.settings = { ...this.settings, ...JSON.parse(saved) };
            } catch (e) {
                console.warn('⚠️ Error cargando configuraciones guardadas');
            }
        }
    }

    resetAvatar() {
        if (confirm('¿Estás seguro de que quieres reiniciar el avatar? Esto puede tomar unos segundos.')) {
            if (window.orbixAvatar) {
                window.orbixAvatar.destroy();
                setTimeout(() => {
                    window.orbixAvatar = new TalkingHeadAvatar();
                }, 1000);
            }
            this.showNotification('🔄 Avatar reiniciado', 'info');
        }
    }

    exportSettings() {
        const dataStr = JSON.stringify(this.settings, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `orbix-avatar-settings-${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        this.showNotification('📤 Configuración exportada', 'success');
    }

    triggerImport() {
        this.panel.querySelector('#import-settings').click();
    }

    importSettings(file) {
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedSettings = JSON.parse(e.target.result);
                this.settings = { ...this.settings, ...importedSettings };
                this.updatePanelValues();
                this.showNotification('📥 Configuración importada', 'success');
            } catch (error) {
                this.showNotification('❌ Error al importar configuración', 'error');
            }
        };
        reader.readAsText(file);
    }

    updatePanelValues() {
        // Actualizar todos los valores en el panel
        Object.keys(this.settings).forEach(key => {
            const element = this.findElementForSetting(key);
            if (element) {
                if (element.type === 'checkbox') {
                    element.checked = this.settings[key];
                } else {
                    element.value = this.settings[key];
                }
                
                if (element.type === 'range') {
                    this.updateValueDisplay(element);
                }
            }
        });
    }

    clearChat() {
        if (confirm('¿Estás seguro de que quieres limpiar todo el historial del chat?')) {
            const chatMessages = document.querySelector('.chat-messages');
            if (chatMessages) {
                chatMessages.innerHTML = `
                    <div class="message bot-message">
                        <div class="avatar-icon">🧠</div>
                        <div class="message-content">
                            ¡Hola! Soy el asistente AI de Orbix. ¿En qué puedo ayudarte hoy?
                        </div>
                    </div>
                `;
            }
            this.showNotification('🗑️ Chat limpiado', 'info');
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `settings-notification ${type}`;
        notification.textContent = message;
        
        this.panel.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    destroy() {
        if (this.overlay) {
            this.overlay.remove();
        }
    }
}

// Inicializar panel de configuraciones
document.addEventListener('DOMContentLoaded', () => {
    window.avatarSettings = new AvatarSettingsPanel();
});

console.log('✅ Avatar Settings Panel loaded');
