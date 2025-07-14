/**
 * 🎭 TalkingHead Avatar Configuration - Orbix AI Platform
 * Configuración personalizable para el avatar
 */

window.ORBIX_AVATAR_CONFIG = {
    // Configuración de inicialización
    autoStart: true,
    containerId: 'avatar-container',
    chatContainerId: 'chat-container',
    
    // Rutas de recursos
    modelPath: '/avatar/models/',
    texturePath: '/avatar/textures/',
    animationPath: '/avatar/animations/',
    
    // Configuración visual
    avatar: {
        showFromChest: true,
        idleAnimation: true,
        responsive: true,
        quality: 'high',
        scale: 1.0,
        position: { x: 0, y: -0.5, z: 0 }
    },
    
    // Configuración de WebGL
    webgl: {
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        shadows: true,
        pixelRatio: 'auto' // 'auto', 'high', 'medium', 'low' o número
    },
    
    // Configuración del chat
    chat: {
        enabled: true,
        position: 'right', // 'right', 'left', 'bottom'
        autoResponse: true,
        showSubtitles: false,
        language: 'es',
        maxMessages: 50
    },
    
    // Configuración de audio
    audio: {
        enabled: true,
        volume: 0.8,
        speechSpeed: 1.0,
        voiceType: 'female' // 'female', 'male', 'neutral'
    },
    
    // Configuración de la cámara
    camera: {
        position: { x: 0, y: 1.2, z: 2.5 },
        lookAt: { x: 0, y: 1.4, z: 0 },
        fov: 45,
        near: 0.1,
        far: 1000
    },
    
    // Configuración de iluminación
    lighting: {
        ambient: {
            color: 0x404040,
            intensity: 0.6
        },
        directional: {
            color: 0xffffff,
            intensity: 0.8,
            position: { x: 1, y: 2, z: 1 },
            shadows: true
        },
        fill: {
            color: 0x00f7ff,
            intensity: 0.3,
            position: { x: -1, y: 1, z: 1 }
        }
    },
    
    // Configuración de animaciones
    animations: {
        idle: {
            enabled: true,
            intensity: 1.0,
            speed: 1.0
        },
        speaking: {
            enabled: true,
            intensity: 1.2,
            speed: 1.5
        },
        gestures: {
            enabled: false,
            randomGestures: true,
            gestureInterval: 10000 // ms
        }
    },
    
    // Configuración de red/API
    api: {
        baseUrl: '/api/v1',
        endpoints: {
            chat: '/chat',
            tts: '/text-to-speech',
            settings: '/avatar-settings'
        },
        timeout: 10000,
        retries: 3
    },
    
    // Configuración de eventos
    events: {
        onReady: null,           // function() {}
        onError: null,           // function(error) {}
        onSpeakStart: null,      // function() {}
        onSpeakEnd: null,        // function() {}
        onChatMessage: null,     // function(message, isUser) {}
        onSettingsChange: null   // function(settings) {}
    },
    
    // Configuración avanzada
    advanced: {
        debug: false,
        performanceMonitoring: true,
        errorReporting: true,
        analytics: false,
        fallbackMode: 'auto', // 'auto', 'always', 'never'
        preloadAssets: true,
        memoryManagement: true
    },
    
    // Configuración de temas
    theme: {
        primary: '#00f7ff',
        secondary: '#0099cc',
        background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
        text: '#ffffff',
        accent: '#88f9ff',
        success: '#00ff00',
        warning: '#ffa500',
        error: '#ff0000'
    },
    
    // Configuración responsive
    responsive: {
        breakpoints: {
            mobile: 480,
            tablet: 768,
            desktop: 1024
        },
        adaptiveQuality: true,
        mobileOptimizations: true
    }
};

// Configuración específica para desarrollo
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.ORBIX_AVATAR_CONFIG.advanced.debug = true;
    window.ORBIX_AVATAR_CONFIG.webgl.antialias = false; // Mejor rendimiento en desarrollo
}

// Configuración específica para dispositivos móviles
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    window.ORBIX_AVATAR_CONFIG.webgl.pixelRatio = 'medium';
    window.ORBIX_AVATAR_CONFIG.avatar.quality = 'medium';
    window.ORBIX_AVATAR_CONFIG.advanced.memoryManagement = true;
    window.ORBIX_AVATAR_CONFIG.responsive.mobileOptimizations = true;
}

// Función para actualizar configuración
window.updateAvatarConfig = function(newConfig) {
    window.ORBIX_AVATAR_CONFIG = {
        ...window.ORBIX_AVATAR_CONFIG,
        ...newConfig
    };
    
    // Notificar al avatar si está inicializado
    if (window.orbixAvatar) {
        window.orbixAvatar.updateConfig(window.ORBIX_AVATAR_CONFIG);
    }
};

// Función para obtener configuración
window.getAvatarConfig = function(key = null) {
    if (key) {
        return window.ORBIX_AVATAR_CONFIG[key];
    }
    return window.ORBIX_AVATAR_CONFIG;
};

console.log('✅ Orbix Avatar Configuration loaded');

// Exportar configuración para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = window.ORBIX_AVATAR_CONFIG;
}
