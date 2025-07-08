// Avatar Manager - Maneja la configuración y comunicación con el avatar
class AvatarManager {
    constructor() {
        this.config = this.loadConfig();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadAvatar();
        this.updateAvatarName();
    }

    setupEventListeners() {
        // Botón para abrir el editor
        const editBtn = document.getElementById('edit-avatar-btn');
        if (editBtn) {
            editBtn.addEventListener('click', () => this.openEditor());
        }

        // Botón para cerrar el editor
        const closeBtn = document.getElementById('close-editor');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeEditor());
        }

        // Botón para guardar configuración
        const saveBtn = document.getElementById('save-avatar-config');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveConfig());
        }

        // Botón para resetear configuración
        const resetBtn = document.getElementById('reset-avatar-config');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetConfig());
        }

        // Botón para probar voz
        const testVoiceBtn = document.getElementById('test-avatar-voice');
        if (testVoiceBtn) {
            testVoiceBtn.addEventListener('click', () => this.testVoice());
        }

        // Cambio de modelo de avatar
        const modelSelect = document.getElementById('avatar-model-select');
        if (modelSelect) {
            modelSelect.addEventListener('change', (e) => this.handleModelChange(e));
        }

        // Cerrar modal al hacer click fuera
        const modal = document.getElementById('avatar-editor');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeEditor();
                }
            });
        }

        // Subida de imagen de fondo
        const backgroundInput = document.getElementById('avatar-background');
        if (backgroundInput) {
            backgroundInput.addEventListener('change', (e) => this.handleBackgroundChange(e));
        }
    }

    loadConfig() {
        const defaultConfig = {
            name: 'EVA',
            model: 'brunette',
            customUrl: '',
            voice: 'es-ES-ElviraNeural',
            animations: {
                blink: true,
                breathing: true,
                headMovement: true,
                lipSync: true
            },
            background: null
        };

        const saved = localStorage.getItem('orbix-avatar-config');
        return saved ? { ...defaultConfig, ...JSON.parse(saved) } : defaultConfig;
    }

    saveConfigToStorage() {
        localStorage.setItem('orbix-avatar-config', JSON.stringify(this.config));
    }

    loadAvatar() {
        const iframe = document.getElementById('avatar-frame');
        if (!iframe) return;

        // Configurar el iframe del avatar
        iframe.onload = () => {
            this.sendConfigToAvatar();
        };

        // Aplicar configuraciones personalizadas
        this.applyCustomizations();
    }

    sendConfigToAvatar() {
        const iframe = document.getElementById('avatar-frame');
        if (!iframe || !iframe.contentWindow) return;

        try {
            // Enviar configuración al iframe del avatar
            iframe.contentWindow.postMessage({
                type: 'avatarConfig',
                config: this.config
            }, '*');
        } catch (error) {
            console.log('No se pudo comunicar con el avatar:', error);
        }
    }

    applyCustomizations() {
        // Aplicar imagen de fondo personalizada si existe
        if (this.config.background) {
            const iframe = document.getElementById('avatar-frame');
            if (iframe) {
                iframe.style.backgroundImage = `url(${this.config.background})`;
                iframe.style.backgroundSize = 'cover';
                iframe.style.backgroundPosition = 'center';
            }
        }
    }

    updateAvatarName() {
        const nameElement = document.getElementById('avatar-name');
        if (nameElement) {
            nameElement.textContent = this.config.name;
        }
    }

    openEditor() {
        const modal = document.getElementById('avatar-editor');
        if (!modal) return;

        // Cargar valores actuales en el formulario
        this.populateEditor();
        
        // Mostrar modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeEditor() {
        const modal = document.getElementById('avatar-editor');
        if (!modal) return;

        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    populateEditor() {
        // Nombre del avatar
        const nameInput = document.getElementById('avatar-name-input');
        if (nameInput) {
            nameInput.value = this.config.name;
        }

        // Modelo del avatar
        const modelSelect = document.getElementById('avatar-model-select');
        if (modelSelect) {
            modelSelect.value = this.config.model;
        }

        // URL personalizada
        const customUrlInput = document.getElementById('avatar-custom-url');
        if (customUrlInput) {
            customUrlInput.value = this.config.customUrl;
            customUrlInput.style.display = this.config.model === 'custom' ? 'block' : 'none';
        }

        // Voz
        const voiceSelect = document.getElementById('avatar-voice-select');
        if (voiceSelect) {
            voiceSelect.value = this.config.voice;
        }

        // Animaciones
        const animationCheckboxes = {
            'toggle-blink': 'blink',
            'toggle-breathing': 'breathing',
            'toggle-head-movement': 'headMovement',
            'toggle-lip-sync': 'lipSync'
        };

        Object.entries(animationCheckboxes).forEach(([id, key]) => {
            const checkbox = document.getElementById(id);
            if (checkbox) {
                checkbox.checked = this.config.animations[key];
            }
        });
    }

    handleModelChange(event) {
        const customUrlInput = document.getElementById('avatar-custom-url');
        if (customUrlInput) {
            customUrlInput.style.display = event.target.value === 'custom' ? 'block' : 'none';
        }
    }

    handleBackgroundChange(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            this.config.background = e.target.result;
            this.applyCustomizations();
        };
        reader.readAsDataURL(file);
    }

    saveConfig() {
        // Recopilar datos del formulario
        const nameInput = document.getElementById('avatar-name-input');
        const modelSelect = document.getElementById('avatar-model-select');
        const customUrlInput = document.getElementById('avatar-custom-url');
        const voiceSelect = document.getElementById('avatar-voice-select');

        if (nameInput) this.config.name = nameInput.value;
        if (modelSelect) this.config.model = modelSelect.value;
        if (customUrlInput) this.config.customUrl = customUrlInput.value;
        if (voiceSelect) this.config.voice = voiceSelect.value;

        // Recopilar configuración de animaciones
        const animationCheckboxes = {
            'toggle-blink': 'blink',
            'toggle-breathing': 'breathing',
            'toggle-head-movement': 'headMovement',
            'toggle-lip-sync': 'lipSync'
        };

        Object.entries(animationCheckboxes).forEach(([id, key]) => {
            const checkbox = document.getElementById(id);
            if (checkbox) {
                this.config.animations[key] = checkbox.checked;
            }
        });

        // Guardar en localStorage
        this.saveConfigToStorage();

        // Aplicar cambios
        this.updateAvatarName();
        this.sendConfigToAvatar();
        this.applyCustomizations();

        // Cerrar editor
        this.closeEditor();

        // Mostrar confirmación
        this.showNotification('Configuración guardada correctamente', 'success');
    }

    resetConfig() {
        if (confirm('¿Estás seguro de que quieres restaurar la configuración por defecto?')) {
            localStorage.removeItem('orbix-avatar-config');
            this.config = this.loadConfig();
            this.populateEditor();
            this.updateAvatarName();
            this.sendConfigToAvatar();
            this.applyCustomizations();
            this.showNotification('Configuración restaurada', 'info');
        }
    }

    testVoice() {
        const text = `Hola, soy ${this.config.name}, tu asistente de Orbix AI Systems. ¿En qué puedo ayudarte hoy?`;
        
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            
            // Configurar la voz si está disponible
            const voices = speechSynthesis.getVoices();
            const selectedVoice = voices.find(voice => voice.name.includes(this.config.voice.split('-')[2]));
            
            if (selectedVoice) {
                utterance.voice = selectedVoice;
            }
            
            utterance.rate = 0.9;
            utterance.pitch = 1;
            utterance.volume = 0.8;
            
            speechSynthesis.speak(utterance);
        } else {
            this.showNotification('Text-to-Speech no está disponible en este navegador', 'error');
        }
    }

    showNotification(message, type = 'info') {
        // Crear elemento de notificación
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Estilos inline para la notificación
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: type === 'success' ? '#00ffcc' : type === 'error' ? '#ff6347' : '#0066ff',
            color: '#000',
            padding: '1rem 2rem',
            borderRadius: '10px',
            zIndex: '10000',
            fontWeight: '600',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease'
        });
        
        document.body.appendChild(notification);
        
        // Mostrar notificación
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Ocultar notificación después de 3 segundos
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Método para que el avatar pueda comunicarse de vuelta
    receiveMessage(event) {
        if (event.data.type === 'avatarReady') {
            this.sendConfigToAvatar();
        }
    }
}

// Inicializar el Avatar Manager cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.avatarManager = new AvatarManager();
    
    // Escuchar mensajes del iframe del avatar
    window.addEventListener('message', (event) => {
        if (window.avatarManager) {
            window.avatarManager.receiveMessage(event);
        }
    });
});
