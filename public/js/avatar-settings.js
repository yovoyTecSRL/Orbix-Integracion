/**
 * 🎛️ Avatar Settings Panel - Orbix AI Platform
 * Panel de configuraciones avanzadas para el TalkingHead Avatar
 */

class AvatarSettingsPanel {
    constructor() {
        this.isOpen = false;
        this.settings = {
            volume: 0.8,
            speechSpeed: 1.0,
            idleAnimation: true,
            autoResponse: true,
            language: 'es',
            voiceType: 'female',
            quality: 'high',
            showSubtitles: false,
            darkMode: true,
            chatPosition: 'right'
        };
        
        this.init();
    }

    init() {
        this.loadSettings();
        this.createPanel();
        this.bindEvents();
    }

    createPanel() {
        // Crear overlay
        this.overlay = document.createElement('div');
        this.overlay.className = 'settings-overlay';
        this.overlay.style.display = 'none';

        // Crear panel
        this.panel = document.createElement('div');
        this.panel.className = 'settings-panel';
        this.panel.innerHTML = this.generatePanelHTML();

        this.overlay.appendChild(this.panel);
        document.body.appendChild(this.overlay);
    }

    generatePanelHTML() {
        return `
            <div class="settings-header">
                <h2>⚙️ Configuración del Avatar</h2>
                <button class="close-btn" id="close-settings">✕</button>
            </div>
            
            <div class="settings-content">
                <div class="settings-section">
                    <h3>🔊 Audio</h3>
                    <div class="setting-item">
                        <label for="volume-slider">Volumen:</label>
                        <input type="range" id="volume-slider" min="0" max="1" step="0.1" value="${this.settings.volume}">
                        <span class="value-display">${Math.round(this.settings.volume * 100)}%</span>
                    </div>
                    
                    <div class="setting-item">
                        <label for="speech-speed">Velocidad de voz:</label>
                        <input type="range" id="speech-speed" min="0.5" max="2" step="0.1" value="${this.settings.speechSpeed}">
                        <span class="value-display">${this.settings.speechSpeed}x</span>
                    </div>
                    
                    <div class="setting-item">
                        <label for="voice-type">Tipo de voz:</label>
                        <select id="voice-type">
                            <option value="female" ${this.settings.voiceType === 'female' ? 'selected' : ''}>Femenina</option>
                            <option value="male" ${this.settings.voiceType === 'male' ? 'selected' : ''}>Masculina</option>
                            <option value="neutral" ${this.settings.voiceType === 'neutral' ? 'selected' : ''}>Neutral</option>
                        </select>
                    </div>
                </div>

                <div class="settings-section">
                    <h3>🎭 Apariencia</h3>
                    <div class="setting-item">
                        <label class="checkbox-label">
                            <input type="checkbox" id="idle-animation" ${this.settings.idleAnimation ? 'checked' : ''}>
                            <span class="checkmark"></span>
                            Animación en reposo
                        </label>
                    </div>
                    
                    <div class="setting-item">
                        <label for="quality-select">Calidad visual:</label>
                        <select id="quality-select">
                            <option value="low" ${this.settings.quality === 'low' ? 'selected' : ''}>Baja (mejor rendimiento)</option>
                            <option value="medium" ${this.settings.quality === 'medium' ? 'selected' : ''}>Media</option>
                            <option value="high" ${this.settings.quality === 'high' ? 'selected' : ''}>Alta</option>
                            <option value="ultra" ${this.settings.quality === 'ultra' ? 'selected' : ''}>Ultra (mejor calidad)</option>
                        </select>
                    </div>
                    
                    <div class="setting-item">
                        <label class="checkbox-label">
                            <input type="checkbox" id="dark-mode" ${this.settings.darkMode ? 'checked' : ''}>
                            <span class="checkmark"></span>
                            Modo oscuro
                        </label>
                    </div>
                </div>

                <div class="settings-section">
                    <h3>💬 Chat</h3>
                    <div class="setting-item">
                        <label class="checkbox-label">
                            <input type="checkbox" id="auto-response" ${this.settings.autoResponse ? 'checked' : ''}>
                            <span class="checkmark"></span>
                            Respuestas automáticas
                        </label>
                    </div>
                    
                    <div class="setting-item">
                        <label class="checkbox-label">
                            <input type="checkbox" id="show-subtitles" ${this.settings.showSubtitles ? 'checked' : ''}>
                            <span class="checkmark"></span>
                            Mostrar subtítulos
                        </label>
                    </div>
                    
                    <div class="setting-item">
                        <label for="chat-position">Posición del chat:</label>
                        <select id="chat-position">
                            <option value="right" ${this.settings.chatPosition === 'right' ? 'selected' : ''}>Derecha</option>
                            <option value="left" ${this.settings.chatPosition === 'left' ? 'selected' : ''}>Izquierda</option>
                            <option value="bottom" ${this.settings.chatPosition === 'bottom' ? 'selected' : ''}>Abajo</option>
                        </select>
                    </div>
                    
                    <div class="setting-item">
                        <label for="language-select">Idioma:</label>
                        <select id="language-select">
                            <option value="es" ${this.settings.language === 'es' ? 'selected' : ''}>Español</option>
                            <option value="en" ${this.settings.language === 'en' ? 'selected' : ''}>English</option>
                            <option value="fr" ${this.settings.language === 'fr' ? 'selected' : ''}>Français</option>
                            <option value="pt" ${this.settings.language === 'pt' ? 'selected' : ''}>Português</option>
                        </select>
                    </div>
                </div>

                <div class="settings-section">
                    <h3>🔧 Avanzado</h3>
                    <div class="setting-item">
                        <button id="reset-avatar" class="action-btn secondary">🔄 Reiniciar Avatar</button>
                    </div>
                    
                    <div class="setting-item">
                        <button id="export-settings" class="action-btn secondary">📤 Exportar Configuración</button>
                    </div>
                    
                    <div class="setting-item">
                        <input type="file" id="import-settings" accept=".json" style="display: none;">
                        <button id="import-settings-btn" class="action-btn secondary">📥 Importar Configuración</button>
                    </div>
                    
                    <div class="setting-item">
                        <button id="clear-chat" class="action-btn danger">🗑️ Limpiar Chat</button>
                    </div>
                </div>
            </div>

            <div class="settings-footer">
                <button id="save-settings" class="action-btn primary">💾 Guardar Cambios</button>
                <button id="cancel-settings" class="action-btn secondary">❌ Cancelar</button>
            </div>
        `;
    }

    bindEvents() {
        // Evento global para abrir el panel
        window.addEventListener('openAvatarSettings', () => this.open());

        // Overlay click para cerrar
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) {
                this.close();
            }
        });

        // Botón cerrar
        this.panel.addEventListener('click', (e) => {
            if (e.target.id === 'close-settings' || e.target.id === 'cancel-settings') {
                this.close();
            }
        });

        // Botón guardar
        this.panel.addEventListener('click', (e) => {
            if (e.target.id === 'save-settings') {
                this.saveSettings();
            }
        });

        // Sliders con actualización en tiempo real
        this.panel.addEventListener('input', (e) => {
            if (e.target.type === 'range') {
                this.updateValueDisplay(e.target);
                this.previewSetting(e.target);
            }
        });

        // Checkboxes y selects
        this.panel.addEventListener('change', (e) => {
            if (e.target.type === 'checkbox' || e.target.tagName === 'SELECT') {
                this.previewSetting(e.target);
            }
        });

        // Botones de acción
        this.panel.addEventListener('click', (e) => {
            switch (e.target.id) {
                case 'reset-avatar':
                    this.resetAvatar();
                    break;
                case 'export-settings':
                    this.exportSettings();
                    break;
                case 'import-settings-btn':
                    this.triggerImport();
                    break;
                case 'clear-chat':
                    this.clearChat();
                    break;
            }
        });

        // Import de configuración
        this.panel.addEventListener('change', (e) => {
            if (e.target.id === 'import-settings') {
                this.importSettings(e.target.files[0]);
            }
        });

        // Tecla ESC para cerrar
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    }

    open() {
        this.isOpen = true;
        this.overlay.style.display = 'flex';
        this.panel.classList.add('slide-in');
        document.body.style.overflow = 'hidden';
        
        // Focus en el primer elemento
        const firstInput = this.panel.querySelector('input, select, button');
        if (firstInput) {
            firstInput.focus();
        }
    }

    close() {
        this.isOpen = false;
        this.panel.classList.remove('slide-in');
        
        setTimeout(() => {
            this.overlay.style.display = 'none';
            document.body.style.overflow = '';
        }, 300);
    }

    updateValueDisplay(slider) {
        const valueDisplay = slider.parentElement.querySelector('.value-display');
        if (valueDisplay) {
            if (slider.id === 'volume-slider') {
                valueDisplay.textContent = Math.round(slider.value * 100) + '%';
            } else if (slider.id === 'speech-speed') {
                valueDisplay.textContent = slider.value + 'x';
            }
        }
    }

    previewSetting(element) {
        // Aplicar configuración en tiempo real para preview
        const settingName = this.getSettingName(element.id);
        const value = this.getElementValue(element);
        
        // Aplicar cambio temporalmente
        this.applySettingPreview(settingName, value);
    }

    getSettingName(elementId) {
        const mapping = {
            'volume-slider': 'volume',
            'speech-speed': 'speechSpeed',
            'voice-type': 'voiceType',
            'idle-animation': 'idleAnimation',
            'quality-select': 'quality',
            'dark-mode': 'darkMode',
            'auto-response': 'autoResponse',
            'show-subtitles': 'showSubtitles',
            'chat-position': 'chatPosition',
            'language-select': 'language'
        };
        return mapping[elementId];
    }

    getElementValue(element) {
        if (element.type === 'checkbox') {
            return element.checked;
        } else if (element.type === 'range') {
            return parseFloat(element.value);
        } else {
            return element.value;
        }
    }

    applySettingPreview(settingName, value) {
        switch (settingName) {
            case 'darkMode':
                document.body.classList.toggle('dark-mode', value);
                break;
            case 'chatPosition':
                this.updateChatPosition(value);
                break;
            case 'quality':
                this.updateRenderQuality(value);
                break;
            // Agregar más previews según sea necesario
        }
    }

    updateChatPosition(position) {
        const chatContainer = document.querySelector('.orbix-chat-container');
        if (chatContainer) {
            chatContainer.className = `orbix-chat-container position-${position}`;
        }
    }

    updateRenderQuality(quality) {
        if (window.orbixAvatar && window.orbixAvatar.renderer) {
            const pixelRatio = {
                'low': 0.5,
                'medium': 1,
                'high': Math.min(window.devicePixelRatio, 2),
                'ultra': window.devicePixelRatio
            }[quality] || 1;
            
            window.orbixAvatar.renderer.setPixelRatio(pixelRatio);
        }
    }

    saveSettings() {
        // Recopilar todos los valores
        const newSettings = {};
        
        Object.keys(this.settings).forEach(key => {
            const element = this.findElementForSetting(key);
            if (element) {
                newSettings[key] = this.getElementValue(element);
            }
        });

        // Guardar en localStorage
        this.settings = { ...this.settings, ...newSettings };
        localStorage.setItem('orbix-avatar-settings', JSON.stringify(this.settings));

        // Aplicar configuraciones al avatar
        this.applySettings();

        // Mostrar confirmación
        this.showNotification('✅ Configuración guardada correctamente', 'success');
        
        // Cerrar panel
        setTimeout(() => this.close(), 1000);
    }

    findElementForSetting(settingKey) {
        const elementMapping = {
            'volume': 'volume-slider',
            'speechSpeed': 'speech-speed',
            'voiceType': 'voice-type',
            'idleAnimation': 'idle-animation',
            'quality': 'quality-select',
            'darkMode': 'dark-mode',
            'autoResponse': 'auto-response',
            'showSubtitles': 'show-subtitles',
            'chatPosition': 'chat-position',
            'language': 'language-select'
        };
        
        const elementId = elementMapping[settingKey];
        return elementId ? this.panel.querySelector(`#${elementId}`) : null;
    }

    applySettings() {
        if (window.orbixAvatar) {
            // Aplicar configuraciones al avatar
            window.orbixAvatar.updateSettings(this.settings);
        }

        // Aplicar configuraciones globales
        this.applyGlobalSettings();
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
