// ===== ORBIX AI SYSTEMS - MAIN.JS =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Orbix AI Systems - Inicializando...');

    // ===== LOADING SCREEN =====
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 3000);
    }

    // ===== SMOOTH SCROLLING =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ===== HEADER SCROLL EFFECT =====
    const header = document.querySelector('.main-header');
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                header.style.background = 'rgba(10, 10, 10, 0.98)';
                header.style.backdropFilter = 'blur(20px)';
            } else {
                header.style.background = 'rgba(10, 10, 10, 0.95)';
                header.style.backdropFilter = 'blur(10px)';
            }
        });
    }

    // ===== AVATAR EDITOR MODAL =====
    const avatarEditor = document.getElementById('avatar-editor');
    const editAvatarBtn = document.getElementById('edit-avatar-btn');
    const closeEditorBtn = document.getElementById('close-editor');
    const saveConfigBtn = document.getElementById('save-avatar-config');
    const resetConfigBtn = document.getElementById('reset-avatar-config');

    if (editAvatarBtn && avatarEditor) {
        editAvatarBtn.addEventListener('click', function() {
            avatarEditor.classList.add('active');
        });
    }

    if (closeEditorBtn && avatarEditor) {
        closeEditorBtn.addEventListener('click', function() {
            avatarEditor.classList.remove('active');
        });
    }

    // Cerrar modal al hacer clic fuera del contenido
    if (avatarEditor) {
        avatarEditor.addEventListener('click', function(e) {
            if (e.target === avatarEditor) {
                avatarEditor.classList.remove('active');
            }
        });
    }

    // ===== AVATAR CONFIGURATION =====
    if (saveConfigBtn) {
        saveConfigBtn.addEventListener('click', function() {
            const avatarName = document.getElementById('avatar-name-input')?.value || 'EVA';
            const avatarModel = document.getElementById('avatar-model-select')?.value || 'brunette';
            const avatarVoice = document.getElementById('avatar-voice-select')?.value || 'es-ES-ElviraNeural';
            
            // Actualizar nombre del avatar en la UI
            const avatarNameDisplay = document.getElementById('avatar-name');
            if (avatarNameDisplay) {
                avatarNameDisplay.textContent = avatarName;
            }

            // Guardar configuración en localStorage
            const config = {
                name: avatarName,
                model: avatarModel,
                voice: avatarVoice,
                animations: {
                    blink: document.getElementById('toggle-blink')?.checked || true,
                    breathing: document.getElementById('toggle-breathing')?.checked || true,
                    headMovement: document.getElementById('toggle-head-movement')?.checked || true,
                    lipSync: document.getElementById('toggle-lip-sync')?.checked || true
                }
            };

            localStorage.setItem('orbix-avatar-config', JSON.stringify(config));
            
            // Cerrar modal
            avatarEditor.classList.remove('active');
            
            console.log('✅ Configuración del avatar guardada:', config);
            
            // Mostrar notificación
            showNotification('Configuración del avatar guardada exitosamente', 'success');
        });
    }

    // ===== RESET CONFIGURATION =====
    if (resetConfigBtn) {
        resetConfigBtn.addEventListener('click', function() {
            // Restaurar valores por defecto
            const defaultConfig = {
                name: 'EVA',
                model: 'brunette',
                voice: 'es-ES-ElviraNeural'
            };

            document.getElementById('avatar-name-input').value = defaultConfig.name;
            document.getElementById('avatar-model-select').value = defaultConfig.model;
            document.getElementById('avatar-voice-select').value = defaultConfig.voice;
            
            // Restaurar checkboxes
            document.getElementById('toggle-blink').checked = true;
            document.getElementById('toggle-breathing').checked = true;
            document.getElementById('toggle-head-movement').checked = true;
            document.getElementById('toggle-lip-sync').checked = true;

            showNotification('Configuración restaurada a valores por defecto', 'info');
        });
    }

    // ===== TEST AVATAR VOICE =====
    const testVoiceBtn = document.getElementById('test-avatar-voice');
    if (testVoiceBtn) {
        testVoiceBtn.addEventListener('click', function() {
            const selectedVoice = document.getElementById('avatar-voice-select')?.value;
            const avatarName = document.getElementById('avatar-name-input')?.value || 'EVA';
            
            // Simular test de voz (aquí se integraría con el TTS real)
            showNotification(`Probando voz ${selectedVoice} para ${avatarName}...`, 'info');
            
            // Aquí iría la integración real con el sistema TTS
            console.log('🔊 Testing voice:', selectedVoice, 'for avatar:', avatarName);
        });
    }

    // ===== LOAD SAVED CONFIGURATION =====
    function loadSavedConfig() {
        const saved = localStorage.getItem('orbix-avatar-config');
        if (saved) {
            try {
                const config = JSON.parse(saved);
                
                // Aplicar configuración guardada
                if (document.getElementById('avatar-name-input')) {
                    document.getElementById('avatar-name-input').value = config.name || 'EVA';
                }
                if (document.getElementById('avatar-model-select')) {
                    document.getElementById('avatar-model-select').value = config.model || 'brunette';
                }
                if (document.getElementById('avatar-voice-select')) {
                    document.getElementById('avatar-voice-select').value = config.voice || 'es-ES-ElviraNeural';
                }
                
                // Aplicar configuración de animaciones
                if (config.animations) {
                    if (document.getElementById('toggle-blink')) {
                        document.getElementById('toggle-blink').checked = config.animations.blink;
                    }
                    if (document.getElementById('toggle-breathing')) {
                        document.getElementById('toggle-breathing').checked = config.animations.breathing;
                    }
                    if (document.getElementById('toggle-head-movement')) {
                        document.getElementById('toggle-head-movement').checked = config.animations.headMovement;
                    }
                    if (document.getElementById('toggle-lip-sync')) {
                        document.getElementById('toggle-lip-sync').checked = config.animations.lipSync;
                    }
                }

                // Actualizar nombre en la UI
                const avatarNameDisplay = document.getElementById('avatar-name');
                if (avatarNameDisplay) {
                    avatarNameDisplay.textContent = config.name || 'EVA';
                }
                
                console.log('✅ Configuración cargada desde localStorage:', config);
            } catch (e) {
                console.warn('⚠️ Error al cargar configuración guardada:', e);
            }
        }
    }

    // Cargar configuración al inicializar
    loadSavedConfig();

    // ===== NOTIFICATION SYSTEM =====
    function showNotification(message, type = 'info') {
        // Crear elemento de notificación
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Estilos inline para la notificación
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '1rem 2rem',
            borderRadius: '8px',
            color: 'white',
            fontSize: '0.9rem',
            fontWeight: '500',
            zIndex: '10000',
            opacity: '0',
            transform: 'translateX(400px)',
            transition: 'all 0.3s ease',
            maxWidth: '400px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
        });

        // Colores según el tipo
        const colors = {
            success: '#00ffcc',
            error: '#ff6347',
            warning: '#ffa500',
            info: '#0066ff'
        };
        
        notification.style.background = colors[type] || colors.info;

        document.body.appendChild(notification);

        // Animar entrada
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Animar salida y remover
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // ===== FEATURE CARDS ANIMATION =====
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observar las tarjetas de características
    document.querySelectorAll('.feature-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });

    console.log('✅ Orbix AI Systems - Inicialización completada');
});

// ===== GLOBAL UTILITIES =====
window.OrbixUtils = {
    showNotification: function(message, type = 'info') {
        // Reutilizar la función de notificación definida arriba
        const event = new CustomEvent('orbix-notification', {
            detail: { message, type }
        });
        document.dispatchEvent(event);
    }
};
