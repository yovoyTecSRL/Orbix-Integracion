// 🎭 Avatar Configuration - Orbix AI Platform
// Configuración principal del avatar TalkingHead

const ORBIX_AVATAR_CONFIG = {
  // Configuración básica
  enabled: true,
  containerId: 'avatar-container',
  canvasId: 'avatar-canvas',
  
  // Configuración del modelo
  model: {
    url: '/avatar/avatars/brunette.glb',
    name: 'brunette',
    fallback: true
  },
  
  // Configuración de audio
  audio: {
    enabled: true,
    volume: 0.8,
    speed: 1.0,
    voice: 'es-ES'
  },
  
  // Configuración visual
  visual: {
    quality: 'medium',
    width: 280,
    height: 250,
    background: '#0f1419'
  },
  
  // Configuración del chat
  chat: {
    enabled: true,
    position: 'bottom-right',
    maxMessages: 50,
    autoScroll: true
  },
  
  // Animaciones
  animations: {
    idle: true,
    speaking: true,
    transitions: true
  },
  
  // API Configuration
  api: {
    baseUrl: window.location.origin,
    endpoints: {
      chat: '/api/chat',
      voice: '/api/voice',
      status: '/api/status'
    }
  }
};

// Función para inicializar el avatar
function initializeOrbixAvatar() {
  console.log('🎭 Inicializando Avatar Orbix AI...');
  
  // Crear el contenedor del avatar si no existe
  if (!document.getElementById(ORBIX_AVATAR_CONFIG.containerId)) {
    console.log('⚠️ Contenedor del avatar no encontrado, creando...');
    createAvatarContainer();
  }
  
  // Inicializar el canvas del avatar
  initializeAvatarCanvas();
  
  // Configurar eventos
  setupAvatarEvents();
  
  console.log('✅ Avatar Orbix AI inicializado correctamente');
}

// Crear contenedor del avatar
function createAvatarContainer() {
  const container = document.createElement('div');
  container.id = ORBIX_AVATAR_CONFIG.containerId;
  container.className = 'orbix-avatar-container';
  
  container.innerHTML = `
    <div class="avatar-status"></div>
    <canvas id="${ORBIX_AVATAR_CONFIG.canvasId}"></canvas>
    <div class="avatar-controls">
      <div class="avatar-loading">
        <div class="loading-spinner"></div>
        <span>Cargando Avatar...</span>
      </div>
    </div>
  `;
  
  document.body.appendChild(container);
}

// Inicializar canvas del avatar
function initializeAvatarCanvas() {
  const canvas = document.getElementById(ORBIX_AVATAR_CONFIG.canvasId);
  if (!canvas) {
    console.error('❌ Canvas del avatar no encontrado');
    return;
  }
  
  canvas.width = ORBIX_AVATAR_CONFIG.visual.width;
  canvas.height = ORBIX_AVATAR_CONFIG.visual.height;
  
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = ORBIX_AVATAR_CONFIG.visual.background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Mostrar avatar básico o loading
  showAvatarLoading(ctx);
}

// Mostrar estado de carga
function showAvatarLoading(ctx) {
  ctx.fillStyle = '#00f7ff';
  ctx.font = '16px Segoe UI';
  ctx.textAlign = 'center';
  ctx.fillText('🎭 Avatar Orbix', ctx.canvas.width / 2, ctx.canvas.height / 2 - 20);
  ctx.fillText('Inicializando...', ctx.canvas.width / 2, ctx.canvas.height / 2 + 10);
}

// Configurar eventos del avatar
function setupAvatarEvents() {
  // Event listener para el chat bubble
  const chatBubble = document.getElementById('chat-bubble');
  if (chatBubble) {
    chatBubble.addEventListener('click', toggleAvatarChat);
  }
  
  // Event listener para el contenedor del avatar
  const container = document.getElementById(ORBIX_AVATAR_CONFIG.containerId);
  if (container) {
    container.addEventListener('click', showAvatarSettings);
  }
}

// Toggle del chat del avatar
function toggleAvatarChat() {
  console.log('💬 Toggle Avatar Chat');
  const container = document.getElementById(ORBIX_AVATAR_CONFIG.containerId);
  
  if (container.style.display === 'none' || !container.style.display) {
    container.style.display = 'block';
    showChatInterface();
  } else {
    container.style.display = 'none';
  }
}

// Mostrar interfaz de chat
function showChatInterface() {
  const controls = document.querySelector('.avatar-controls');
  if (controls) {
    controls.innerHTML = `
      <input type="text" id="chat-input" placeholder="Escribe tu mensaje..." 
        style="width: 90%; padding: 8px; border: 1px solid #00f7ff; border-radius: 15px; background: #1a202c; color: #fff; margin-bottom: 5px;">
      <button class="avatar-btn" onclick="sendChatMessage()">Enviar</button>
      <button class="avatar-btn" onclick="showAvatarSettings()">⚙️</button>
    `;
    
    // Focus en el input
    document.getElementById('chat-input').focus();
    
    // Enter para enviar
    document.getElementById('chat-input').addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        sendChatMessage();
      }
    });
  }
}

// Enviar mensaje del chat
function sendChatMessage() {
  const input = document.getElementById('chat-input');
  if (!input || !input.value.trim()) return;
  
  const message = input.value.trim();
  console.log('📤 Enviando mensaje:', message);
  
  // Simular respuesta del avatar (aquí conectarías con la API real)
  simulateAvatarResponse(message);
  
  input.value = '';
}

// Simular respuesta del avatar
function simulateAvatarResponse(message) {
  // Aquí conectarías con tu API de IA
  const responses = [
    `¡Hola! Recibí tu mensaje: "${message}"`,
    `Interesante pregunta sobre: ${message}`,
    `🤔 Déjame pensar en eso: ${message}`,
    `¡Excelente! Hablemos de: ${message}`
  ];
  
  const response = responses[Math.floor(Math.random() * responses.length)];
  
  setTimeout(() => {
    console.log('🎭 Avatar responde:', response);
    // Aquí mostrarías la respuesta en la interfaz
  }, 1000);
}

// Mostrar configuraciones del avatar
function showAvatarSettings() {
  console.log('⚙️ Mostrar configuraciones del avatar');
  // Implementar panel de configuraciones
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initializeOrbixAvatar);

// Export para uso global
window.ORBIX_AVATAR_CONFIG = ORBIX_AVATAR_CONFIG;
window.toggleAvatarChat = toggleAvatarChat;
window.sendChatMessage = sendChatMessage;
window.showAvatarSettings = showAvatarSettings;
