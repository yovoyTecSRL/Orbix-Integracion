/**
 * 🎭 TalkingHead Avatar Integration - Orbix AI Platform
 * Módulo principal para el avatar visual con chat integrado
 * 
 * Características:
 * - Avatar responsivo (solo pecho hacia arriba)
 * - Animación idle
 * - Optimizado para WebGL/Three.js
 * - Chat bubble moderno
 * - Interacción del usuario
 */

class TalkingHeadAvatar {
    constructor(options = {}) {
        this.options = {
            containerId: 'avatar-container',
            chatContainerId: 'chat-container',
            modelPath: '/avatar/models/',
            idleAnimation: true,
            autoStart: true,
            responsive: true,
            showFromChest: true,
            webGLOptimized: true,
            ...options
        };
        
        this.isInitialized = false;
        this.isLoading = false;
        this.isSpeaking = false;
        this.currentModel = null;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.mixer = null;
        this.idleAction = null;
        this.speakAction = null;
        
        this.init();
    }

    async init() {
        if (this.isInitialized || this.isLoading) return;
        
        this.isLoading = true;
        
        try {
            await this.loadDependencies();
            this.createAvatarContainer();
            this.createChatInterface();
            this.setupThreeJS();
            await this.loadAvatarModel();
            this.setupEventListeners();
            this.startIdleAnimation();
            
            this.isInitialized = true;
            this.isLoading = false;
            
            console.log('✅ TalkingHead Avatar inicializado correctamente');
            this.dispatchEvent('avatarReady');
        } catch (error) {
            console.error('❌ Error inicializando TalkingHead Avatar:', error);
            this.isLoading = false;
            this.showFallback();
        }
    }

    async loadDependencies() {
        // Cargar Three.js si no está disponible
        if (typeof THREE === 'undefined') {
            await this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js');
        }
        
        // Cargar GLTFLoader
        if (typeof THREE.GLTFLoader === 'undefined') {
            await this.loadScript('https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js');
        }
        
        // Cargar FBXLoader para avatares más complejos
        if (typeof THREE.FBXLoader === 'undefined') {
            await this.loadScript('https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/FBXLoader.js');
        }
    }

    loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    createAvatarContainer() {
        const container = safeGetElementById(this.options.containerId) || 
                         safeQuerySelector(`#${this.options.containerId}`);
        
        if (!container) {
            // Crear contenedor si no existe
            const newContainer = document.createElement('div');
            newContainer.id = this.options.containerId;
            newContainer.className = 'orbix-avatar-container';
            
            // Insertar después del header
            const header = safeQuerySelector('header');
            if (header && header.nextSibling) {
                header.parentNode.insertBefore(newContainer, header.nextSibling);
            } else {
                document.body.appendChild(newContainer);
            }
            
            this.container = newContainer;
        } else {
            this.container = container;
        }

        // Aplicar estilos del contenedor
        this.container.innerHTML = `
            <div class="avatar-viewport">
                <canvas id="avatar-canvas"></canvas>
                <div class="avatar-loading">
                    <div class="loading-spinner"></div>
                    <p>Cargando avatar Orbix...</p>
                </div>
                <div class="avatar-controls">
                    <button id="avatar-mute" class="control-btn" title="Silenciar">🔊</button>
                    <button id="avatar-settings" class="control-btn" title="Configuración">⚙️</button>
                </div>
            </div>
        `;
    }

    createChatInterface() {
        const chatContainer = document.createElement('div');
        chatContainer.id = this.options.chatContainerId;
        chatContainer.className = 'orbix-chat-container';
        
        chatContainer.innerHTML = `
            <div class="chat-header">
                <h3>💬 Chat con Orbix AI</h3>
                <button id="chat-minimize" class="chat-control">−</button>
            </div>
            <div class="chat-messages" id="chat-messages">
                <div class="message bot-message">
                    <div class="avatar-icon">🧠</div>
                    <div class="message-content">
                        ¡Hola! Soy el asistente AI de Orbix. ¿En qué puedo ayudarte hoy?
                    </div>
                </div>
            </div>
            <div class="chat-input-container">
                <input type="text" id="chat-input" placeholder="Escribe tu mensaje..." />
                <button id="chat-send" class="send-btn">📤</button>
            </div>
        `;
        
        // Insertar chat después del avatar
        this.container.parentNode.insertBefore(chatContainer, this.container.nextSibling);
        this.chatContainer = chatContainer;
    }

    setupThreeJS() {
        const canvas = safeGetElementById('avatar-canvas');
        if (!canvas) {
            throw new Error('Canvas del avatar no encontrado');
        }

        // Configurar escena
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x1a1a2e);

        // Configurar cámara (enfoque desde el pecho hacia arriba)
        this.camera = new THREE.PerspectiveCamera(
            45, 
            canvas.clientWidth / canvas.clientHeight, 
            0.1, 
            1000
        );
        this.camera.position.set(0, 1.2, 2.5); // Posición para mostrar desde el pecho
        this.camera.lookAt(0, 1.4, 0);

        // Configurar renderer con optimizaciones WebGL
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: canvas,
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
        });
        
        this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // Iluminación optimizada
        this.setupLighting();

        // Configurar responsividad
        this.setupResponsive();
    }

    setupLighting() {
        // Luz ambiente suave
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);

        // Luz direccional principal
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(1, 2, 1);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 1024;
        directionalLight.shadow.mapSize.height = 1024;
        this.scene.add(directionalLight);

        // Luz de relleno
        const fillLight = new THREE.DirectionalLight(0x00f7ff, 0.3);
        fillLight.position.set(-1, 1, 1);
        this.scene.add(fillLight);
    }

    async loadAvatarModel() {
        const loader = new THREE.GLTFLoader();
        
        try {
            // Intentar cargar modelo personalizado, sino usar modelo por defecto
            const modelPath = this.options.modelPath + 'orbix-avatar.gltf';
            
            const gltf = await new Promise((resolve, reject) => {
                loader.load(
                    modelPath,
                    resolve,
                    (progress) => {
                        const percent = (progress.loaded / progress.total * 100).toFixed(0);
                        this.updateLoadingProgress(percent);
                    },
                    reject
                );
            });

            this.currentModel = gltf.scene;
            this.scene.add(this.currentModel);

            // Configurar animaciones
            if (gltf.animations && gltf.animations.length > 0) {
                this.mixer = new THREE.AnimationMixer(this.currentModel);
                
                // Buscar animaciones idle y speak
                this.idleAction = this.mixer.clipAction(
                    gltf.animations.find(anim => anim.name.includes('idle')) || gltf.animations[0]
                );
                
                this.speakAction = this.mixer.clipAction(
                    gltf.animations.find(anim => anim.name.includes('speak')) || gltf.animations[1]
                );
            }

            // Posicionar modelo para mostrar desde el pecho
            this.currentModel.position.set(0, -0.5, 0);
            this.currentModel.scale.set(1, 1, 1);

            this.hideLoading();
            this.startRenderLoop();

        } catch (error) {
            console.warn('⚠️ No se pudo cargar modelo personalizado, usando modelo por defecto');
            this.loadDefaultAvatar();
        }
    }

    loadDefaultAvatar() {
        // Crear avatar por defecto usando geometrías básicas
        const geometry = new THREE.SphereGeometry(0.3, 32, 32);
        const material = new THREE.MeshLambertMaterial({ color: 0x00f7ff });
        
        this.currentModel = new THREE.Mesh(geometry, material);
        this.currentModel.position.set(0, 1.5, 0);
        this.scene.add(this.currentModel);

        // Agregar ojos
        const eyeGeometry = new THREE.SphereGeometry(0.05, 16, 16);
        const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
        
        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.set(-0.1, 0.1, 0.25);
        this.currentModel.add(leftEye);
        
        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        rightEye.position.set(0.1, 0.1, 0.25);
        this.currentModel.add(rightEye);

        this.hideLoading();
        this.startRenderLoop();
    }

    startIdleAnimation() {
        if (!this.options.idleAnimation) return;

        if (this.idleAction) {
            this.idleAction.setLoop(THREE.LoopRepeat);
            this.idleAction.play();
        } else {
            // Animación idle básica para modelo por defecto
            this.startBasicIdleAnimation();
        }
    }

    startBasicIdleAnimation() {
        if (!this.currentModel) return;

        const idleAnimation = () => {
            if (this.isSpeaking) return;
            
            const time = Date.now() * 0.001;
            this.currentModel.rotation.y = Math.sin(time * 0.5) * 0.05;
            this.currentModel.position.y = 1.5 + Math.sin(time * 2) * 0.02;
        };

        this.idleAnimationLoop = idleAnimation;
    }

    startRenderLoop() {
        const animate = () => {
            requestAnimationFrame(animate);
            
            if (this.mixer) {
                this.mixer.update(0.016); // 60 FPS
            }
            
            if (this.idleAnimationLoop && !this.isSpeaking) {
                this.idleAnimationLoop();
            }
            
            this.renderer.render(this.scene, this.camera);
        };
        
        animate();
    }

    setupEventListeners() {
        // Chat input
        const chatInput = safeGetElementById('chat-input');
        const chatSend = safeGetElementById('chat-send');
        
        if (chatInput && chatSend) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleUserMessage();
                }
            });
            
            chatSend.addEventListener('click', () => {
                this.handleUserMessage();
            });
        }

        // Controles del avatar
        const muteBtn = safeGetElementById('avatar-mute');
        const settingsBtn = safeGetElementById('avatar-settings');
        
        if (muteBtn) {
            muteBtn.addEventListener('click', () => this.toggleMute());
        }
        
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => this.openSettings());
        }

        // Chat minimize
        const minimizeBtn = safeGetElementById('chat-minimize');
        if (minimizeBtn) {
            minimizeBtn.addEventListener('click', () => this.toggleChat());
        }

        // Responsive
        window.addEventListener('resize', () => this.handleResize());
    }

    setupResponsive() {
        this.handleResize();
    }

    handleResize() {
        if (!this.renderer || !this.camera) return;

        const container = this.container.querySelector('.avatar-viewport');
        if (!container) return;

        const width = container.clientWidth;
        const height = container.clientHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    async handleUserMessage() {
        const input = safeGetElementById('chat-input');
        if (!input || !input.value.trim()) return;

        const message = input.value.trim();
        input.value = '';

        // Agregar mensaje del usuario
        this.addChatMessage(message, 'user');

        // Simular respuesta del AI (aquí conectarías con tu API)
        this.isSpeaking = true;
        this.playPeakAnimation();
        
        setTimeout(() => {
            const response = this.generateAIResponse(message);
            this.addChatMessage(response, 'bot');
            this.isSpeaking = false;
        }, 1000);
    }

    addChatMessage(message, type) {
        const messagesContainer = safeGetElementById('chat-messages');
        if (!messagesContainer) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        
        const icon = type === 'user' ? '👤' : '🧠';
        messageDiv.innerHTML = `
            <div class="avatar-icon">${icon}</div>
            <div class="message-content">${message}</div>
        `;

        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    generateAIResponse(userMessage) {
        // Respuestas simples por ahora - aquí conectarías con tu API de IA
        const responses = [
            "Entiendo tu consulta. ¿Podrías darme más detalles?",
            "Esa es una excelente pregunta. En Orbix Systems podemos ayudarte con eso.",
            "Permíteme procesar esa información. ¿Hay algo específico que necesites?",
            "Gracias por tu mensaje. Estoy aquí para asistirte con cualquier duda.",
            "Esa consulta está relacionada con nuestros servicios. Te puedo ayudar con más información."
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }

    playPeakAnimation() {
        if (this.speakAction) {
            this.speakAction.reset();
            this.speakAction.setLoop(THREE.LoopOnce);
            this.speakAction.play();
        } else {
            // Animación básica de habla
            this.playBasicSpeakAnimation();
        }
    }

    playBasicSpeakAnimation() {
        if (!this.currentModel) return;

        let speakFrames = 0;
        const maxFrames = 60;

        const speakLoop = () => {
            if (speakFrames >= maxFrames || !this.isSpeaking) {
                return;
            }

            const intensity = Math.sin(speakFrames * 0.5) * 0.1;
            this.currentModel.scale.set(1 + intensity, 1, 1);
            speakFrames++;

            requestAnimationFrame(speakLoop);
        };

        speakLoop();
    }

    toggleMute() {
        // Implementar lógica de mute
        const muteBtn = safeGetElementById('avatar-mute');
        if (muteBtn) {
            muteBtn.textContent = muteBtn.textContent === '🔊' ? '🔇' : '🔊';
        }
    }

    toggleChat() {
        if (this.chatContainer) {
            this.chatContainer.classList.toggle('minimized');
        }
    }

    openSettings() {
        // Abrir panel de configuraciones avanzadas
        window.dispatchEvent(new CustomEvent('openAvatarSettings'));
    }

    updateLoadingProgress(percent) {
        const loadingElement = this.container.querySelector('.avatar-loading p');
        if (loadingElement) {
            loadingElement.textContent = `Cargando avatar... ${percent}%`;
        }
    }

    hideLoading() {
        const loadingElement = this.container.querySelector('.avatar-loading');
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }
    }

    showFallback() {
        if (this.container) {
            this.container.innerHTML = `
                <div class="avatar-fallback">
                    <div class="fallback-icon">🧠</div>
                    <p>Avatar Orbix no disponible</p>
                    <small>Modo texto activado</small>
                </div>
            `;
        }
    }

    dispatchEvent(eventName, data = {}) {
        window.dispatchEvent(new CustomEvent(eventName, { detail: data }));
    }

    destroy() {
        if (this.renderer) {
            this.renderer.dispose();
        }
        if (this.container) {
            this.container.remove();
        }
        if (this.chatContainer) {
            this.chatContainer.remove();
        }
    }
}

// Exponer clase globalmente
window.TalkingHeadAvatar = TalkingHeadAvatar;

// Auto-inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    if (window.ORBIX_AUTO_INIT_AVATAR !== false) {
        window.orbixAvatar = new TalkingHeadAvatar();
    }
});

console.log('✅ TalkingHead Avatar module loaded');
