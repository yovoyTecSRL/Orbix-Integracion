# 🎭 TalkingHead Avatar Integration - Orbix AI Platform

## 📋 Descripción General

Este módulo integra un avatar visual TalkingHead avanzado en la plataforma Orbix AI, ofreciendo una experiencia de usuario inmersiva con chat en tiempo real, animaciones fluidas y configuraciones personalizables.

## ✨ Características Principales

### 🎨 Avatar Visual
- **Vista optimizada**: Solo muestra desde el pecho hacia arriba
- **Animaciones suaves**: Idle animation y animaciones de habla
- **Responsive**: Se adapta a diferentes tamaños de pantalla
- **WebGL optimizado**: Rendimiento optimizado para navegadores web
- **Fallback inteligente**: Avatar básico si no se pueden cargar modelos 3D

### 💬 Sistema de Chat
- **Chat bubble moderno**: Interfaz atractiva y funcional
- **Interacción en tiempo real**: Respuestas inmediatas del AI
- **Múltiples posiciones**: Derecha, izquierda o abajo
- **Historial persistente**: Mantiene conversaciones
- **Notificaciones visuales**: Indicadores de estado

### ⚙️ Panel de Configuraciones
- **Configuraciones avanzadas**: Panel separado para ajustes detallados
- **Audio personalizable**: Volumen, velocidad, tipo de voz
- **Calidad visual**: Múltiples niveles de calidad
- **Exportar/Importar**: Configuraciones guardables
- **Responsive**: Adaptado para móviles

## 📁 Estructura de Archivos

```
public/
├── css/
│   ├── talkinghead-avatar.css     # Estilos principales del avatar
│   └── avatar-settings.css        # Estilos del panel de configuración
├── js/
│   ├── talkinghead-avatar.js      # Módulo principal del avatar
│   ├── avatar-settings.js         # Panel de configuraciones avanzadas
│   ├── avatar-config.js           # Configuración personalizable
│   ├── dom-safety.js             # Utilidades de seguridad DOM
│   ├── orbix-patches.js          # Parches específicos de Orbix
│   └── orbix-modules.js          # Módulos adicionales
└── avatar/
    └── models/
        └── README.md             # Documentación de modelos 3D
```

## 🚀 Instalación e Integración

### 1. Archivos Necesarios

Asegúrate de que todos estos archivos estén incluidos en tu HTML:

```html
<!-- CSS -->
<link rel="stylesheet" href="/css/talkinghead-avatar.css" />
<link rel="stylesheet" href="/css/avatar-settings.css" />

<!-- JavaScript -->
<script src="/js/dom-safety.js"></script>
<script src="/js/orbix-patches.js"></script>
<script src="/js/orbix-modules.js"></script>
<script src="/js/avatar-config.js"></script>
<script src="/js/talkinghead-avatar.js"></script>
<script src="/js/avatar-settings.js"></script>
```

### 2. Contenedor HTML

Agrega el contenedor del avatar a tu HTML:

```html
<!-- Avatar se inicializa automáticamente aquí -->
<div id="avatar-container" class="orbix-avatar-container">
</div>
```

### 3. Inicialización Automática

El avatar se inicializa automáticamente cuando el DOM está listo. Para control manual:

```javascript
// Desactivar inicialización automática
window.ORBIX_AUTO_INIT_AVATAR = false;

// Inicializar manualmente
window.orbixAvatar = new TalkingHeadAvatar({
    containerId: 'mi-avatar-container',
    chatContainerId: 'mi-chat-container',
    // ... más opciones
});
```

## 🎛️ Configuración

### Configuración Básica

```javascript
window.updateAvatarConfig({
    avatar: {
        quality: 'high',           // 'low', 'medium', 'high', 'ultra'
        idleAnimation: true,       // Animación en reposo
        showFromChest: true        // Vista desde el pecho
    },
    chat: {
        position: 'right',         // 'right', 'left', 'bottom'
        language: 'es',           // 'es', 'en', 'fr', 'pt'
        autoResponse: true        // Respuestas automáticas
    }
});
```

### Configuración Avanzada

```javascript
window.updateAvatarConfig({
    webgl: {
        antialias: true,
        shadows: true,
        pixelRatio: 'auto'
    },
    api: {
        baseUrl: '/api/v1',
        endpoints: {
            chat: '/chat',
            tts: '/text-to-speech'
        }
    }
});
```

## 🎨 Personalización Visual

### Temas Personalizados

```javascript
window.updateAvatarConfig({
    theme: {
        primary: '#00f7ff',       // Color principal
        secondary: '#0099cc',     // Color secundario
        background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
        text: '#ffffff'
    }
});
```

### Responsive Design

El avatar incluye breakpoints automáticos:
- **Mobile**: < 480px
- **Tablet**: 480px - 768px
- **Desktop**: > 768px

## 🔧 API y Eventos

### Eventos Disponibles

```javascript
window.updateAvatarConfig({
    events: {
        onReady: function() {
            console.log('Avatar listo');
        },
        onSpeakStart: function() {
            console.log('Avatar comenzó a hablar');
        },
        onChatMessage: function(message, isUser) {
            console.log('Mensaje:', message, 'Usuario:', isUser);
        }
    }
});
```

### Métodos Públicos

```javascript
// Acceder al avatar
const avatar = window.orbixAvatar;

// Enviar mensaje programáticamente
avatar.addChatMessage('Hola desde código', 'bot');

// Controlar animaciones
avatar.playPeakAnimation();
avatar.startIdleAnimation();

// Abrir configuraciones
avatar.openSettings();

// Destruir avatar
avatar.destroy();
```

## 📱 Optimización Móvil

### Características Móviles
- **Calidad adaptativa**: Reduce automáticamente la calidad en dispositivos móviles
- **Gestión de memoria**: Optimización automática de recursos
- **Touch-friendly**: Controles optimizados para pantallas táctiles
- **Performance**: Ajustes automáticos para mejor rendimiento

### Configuración Móvil Manual

```javascript
if (window.innerWidth < 768) {
    window.updateAvatarConfig({
        webgl: {
            pixelRatio: 'medium',
            antialias: false
        },
        avatar: {
            quality: 'medium'
        }
    });
}
```

## 🎭 Modelos 3D

### Agregar Modelos Personalizados

1. **Coloca tu modelo** en `/public/avatar/models/orbix-avatar.gltf`
2. **Incluye texturas** en la misma carpeta
3. **Asegúrate** de que tenga animaciones `idle` y `speaking`

### Especificaciones Recomendadas

- **Formato**: GLTF/GLB preferido
- **Polígonos**: < 10,000 para web
- **Texturas**: 512x512 o 1024x1024 máximo
- **Tamaño**: < 2MB total
- **Animaciones**: Idle, Speaking, Gestures (opcional)

## 🔍 Debugging y Desarrollo

### Modo Debug

```javascript
window.updateAvatarConfig({
    advanced: {
        debug: true,
        performanceMonitoring: true
    }
});
```

### Logs Útiles

- `✅ TalkingHead Avatar inicializado correctamente`
- `⚠️ No se pudo cargar modelo personalizado`
- `❌ Error inicializando TalkingHead Avatar`

## 🚨 Solución de Problemas

### Problemas Comunes

1. **Avatar no aparece**
   - Verificar que Three.js se carga correctamente
   - Revisar consola para errores de WebGL
   - Comprobar que el contenedor existe

2. **Modelo 3D no carga**
   - Verificar ruta del modelo
   - Comprobar formato GLTF
   - Revisar tamaño del archivo

3. **Chat no responde**
   - Verificar configuración de API
   - Comprobar conectividad
   - Revisar configuración de autoResponse

### Fallbacks Automáticos

- **Modelo 3D fallido**: Se genera avatar básico con Three.js
- **WebGL no disponible**: Se muestra avatar estático
- **Error de inicialización**: Se muestra interfaz de solo texto

## 📊 Performance

### Optimizaciones Incluidas

- **Lazy loading**: Carga de recursos bajo demanda
- **Memory management**: Limpieza automática de memoria
- **Adaptive quality**: Calidad basada en rendimiento del dispositivo
- **Resource pooling**: Reutilización de recursos

### Métricas Recomendadas

- **FPS**: > 30 para experiencia fluida
- **Memory**: < 100MB para móviles, < 200MB para desktop
- **Load time**: < 3 segundos para inicialización completa

## 🔒 Seguridad

### Características de Seguridad

- **DOM Safety**: Protección contra errores de querySelector
- **Input validation**: Validación de mensajes de chat
- **XSS Protection**: Sanitización de contenido
- **CORS Policy**: Configuración segura de recursos

## 📈 Analytics y Monitoreo

### Eventos Trackeables

```javascript
// Configurar analytics
window.updateAvatarConfig({
    events: {
        onReady: () => analytics.track('avatar_loaded'),
        onChatMessage: (msg, isUser) => {
            if (!isUser) analytics.track('bot_response');
        }
    }
});
```

## 🔄 Actualizaciones y Mantenimiento

### Versioning

- **Major**: Cambios de API incompatibles
- **Minor**: Nuevas características compatibles
- **Patch**: Correcciones de bugs

### Migración

Las configuraciones se mantienen automáticamente en localStorage y se migran entre versiones cuando es posible.

## 📞 Soporte

Para soporte técnico:
- **Email**: info@sistemasorbix.com
- **Documentación**: Este archivo README
- **Logs**: Revisar consola del navegador con debug activado

---

## 🏁 Conclusión

La integración TalkingHead Avatar está completa y lista para producción. Incluye todas las características solicitadas:

✅ **Avatar visual responsivo** (solo pecho hacia arriba)  
✅ **Animación idle** y animaciones de habla  
✅ **Optimización WebGL/Three.js**  
✅ **Chat bubble moderno** con interacción  
✅ **Panel de configuraciones avanzadas** separado  
✅ **Responsive design** completo  
✅ **Fallbacks inteligentes** para compatibilidad  
✅ **Documentación completa** y ejemplos  

El sistema está optimizado para rendimiento, incluye manejo de errores robusto y es completamente personalizable.

---
*© 2025 Orbix Systems S.A. - TalkingHead Avatar Integration Module*
