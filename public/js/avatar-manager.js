/**
 * 🎭 Avatar Manager - Orbix AI Platform
 * Sistema completo de gestión de avatares con Three.js
 */

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

class AvatarManager {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.avatar = null;
        this.mixer = null;
        this.clock = new THREE.Clock();
        this.animations = {
            idle: null,
            blink: null,
            talking: null,
            breathing: null
        };
        this.config = {
            name: "Zoile",
            model: "/avatars/brunette.glb",
            enableMovement: true,
            enableBlinking: true,
            enableLipSync: true,
            enableBreathing: true,
            animationSpeed: 1.0
        };
        this.isInitialized = false;
        this.isTalking = false;
        this.blinkTimer = 0;
        this.breathTimer = 0;
    }

    async init() {
        try {
            await this.loadConfig();
            this.setupScene();
            this.setupCamera();
            this.setupRenderer();
            this.setupControls();
            this.setupLighting();
            await this.loadAvatar();
            this.startAnimationLoop();
            this.isInitialized = true;
            console.log('✅ Avatar Manager inicializado correctamente');
        } catch (error) {
            console.error('❌ Error inicializando Avatar Manager:', error);
            this.showFallback();
        }
    }

    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x1a1a2e);
        
        // Fog para profundidad
        this.scene.fog = new THREE.Fog(0x1a1a2e, 1, 10);
    }

    setupCamera() {
        const container = document.getElementById('avatar-container');
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        this.camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
        this.camera.position.set(0, 1.6, 2);
        this.camera.lookAt(0, 1.6, 0);
    }

    setupRenderer() {
        const container = document.getElementById('avatar-container');
        
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: true,
            canvas: document.getElementById('avatar-canvas')
        });
        
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;
    }

    setupControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.enableZoom = true;
        this.controls.enablePan = false;
        this.controls.maxPolarAngle = Math.PI / 2;
        this.controls.minDistance = 1;
        this.controls.maxDistance = 5;
        this.controls.target.set(0, 1.6, 0);
    }

    setupLighting() {
        // Luz ambiente suave
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);

        // Luz principal (key light)
        const keyLight = new THREE.DirectionalLight(0x00f7ff, 1.2);
        keyLight.position.set(2, 4, 3);
        keyLight.castShadow = true;
        keyLight.shadow.mapSize.setScalar(2048);
        keyLight.shadow.camera.near = 0.1;
        keyLight.shadow.camera.far = 10;
        keyLight.shadow.camera.left = -2;
        keyLight.shadow.camera.right = 2;
        keyLight.shadow.camera.top = 2;
        keyLight.shadow.camera.bottom = -2;
        this.scene.add(keyLight);

        // Luz de relleno
        const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
        fillLight.position.set(-2, 2, 1);
        this.scene.add(fillLight);

        // Luz de borde
        const rimLight = new THREE.DirectionalLight(0x88f9ff, 0.8);
        rimLight.position.set(0, 2, -3);
        this.scene.add(rimLight);
    }

    async loadAvatar() {
        const loader = new GLTFLoader();
        
        try {
            this.showLoading('Cargando avatar...');
            
            const gltf = await new Promise((resolve, reject) => {
                loader.load(
                    this.config.model,
                    resolve,
                    (progress) => {
                        const percent = Math.round((progress.loaded / progress.total) * 100);
                        this.showLoading(`Cargando avatar... ${percent}%`);
                    },
                    reject
                );
            });

            this.avatar = gltf.scene;
            this.scene.add(this.avatar);

            // Configurar sombras
            this.avatar.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });

            // Configurar animaciones
            if (gltf.animations && gltf.animations.length > 0) {
                this.mixer = new THREE.AnimationMixer(this.avatar);
                this.setupAnimations(gltf.animations);
            }

            this.hideLoading();
            console.log('✅ Avatar cargado:', this.config.name);
            
        } catch (error) {
            console.error('❌ Error cargando avatar:', error);
            this.showFallback();
        }
    }

    setupAnimations(animations) {
        animations.forEach((clip) => {
            const action = this.mixer.clipAction(clip);
            
            if (clip.name.toLowerCase().includes('idle')) {
                this.animations.idle = action;
                action.play();
            } else if (clip.name.toLowerCase().includes('blink')) {
                this.animations.blink = action;
            } else if (clip.name.toLowerCase().includes('talk')) {
                this.animations.talking = action;
            } else if (clip.name.toLowerCase().includes('breath')) {
                this.animations.breathing = action;
            }
        });

        // Si no hay animaciones específicas, crear procedurales
        if (!this.animations.idle) {
            this.createProceduralAnimations();
        }
    }

    createProceduralAnimations() {
        // Crear animaciones procedurales básicas
        console.log('🔄 Creando animaciones procedurales...');
    }

    startAnimationLoop() {
        const animate = () => {
            requestAnimationFrame(animate);
            
            if (!this.isInitialized) return;

            const delta = this.clock.getDelta();
            const elapsedTime = this.clock.getElapsedTime();

            // Actualizar controles
            this.controls.update();

            // Actualizar mixer de animaciones
            if (this.mixer) {
                this.mixer.update(delta * this.config.animationSpeed);
            }

            // Animaciones procedurales
            this.updateProceduralAnimations(elapsedTime);

            // Renderizar
            this.renderer.render(this.scene, this.camera);
        };

        animate();
    }

    updateProceduralAnimations(time) {
        if (!this.avatar || !this.config.enableMovement) return;

        // Parpadeo automático
        if (this.config.enableBlinking) {
            this.blinkTimer += 0.016; // ~60fps
            if (this.blinkTimer > 3 + Math.random() * 4) { // Parpadear cada 3-7 segundos
                this.blink();
                this.blinkTimer = 0;
            }
        }

        // Respiración sutil
        if (this.config.enableBreathing && this.avatar) {
            const breathIntensity = 0.02;
            const breathSpeed = 0.5;
            const breathOffset = Math.sin(time * breathSpeed) * breathIntensity;
            
            this.avatar.scale.y = 1 + breathOffset;
            this.avatar.position.y = breathOffset * 0.5;
        }

        // Movimiento sutil de cabeza
        if (this.avatar && this.config.enableMovement) {
            const headMovement = this.avatar.getObjectByName('Head') || this.avatar;
            if (headMovement) {
                const intensity = 0.05;
                headMovement.rotation.y = Math.sin(time * 0.3) * intensity;
                headMovement.rotation.x = Math.sin(time * 0.2) * intensity * 0.5;
            }
        }
    }

    blink() {
        if (this.animations.blink) {
            this.animations.blink.reset().play();
        }
    }

    startTalking() {
        if (this.isTalking) return;
        
        this.isTalking = true;
        
        if (this.animations.talking) {
            this.animations.talking.play();
        }

        // Agregar clase CSS para efectos visuales
        const container = document.querySelector('.orbix-avatar-container');
        if (container) {
            container.classList.add('speaking');
        }

        console.log('🗣️ Avatar hablando...');
    }

    stopTalking() {
        if (!this.isTalking) return;
        
        this.isTalking = false;
        
        if (this.animations.talking) {
            this.animations.talking.fadeOut(0.5);
        }

        // Remover clase CSS
        const container = document.querySelector('.orbix-avatar-container');
        if (container) {
            container.classList.remove('speaking');
        }

        console.log('🤐 Avatar callado');
    }

    async loadConfig() {
        try {
            const response = await fetch('/avatar-config.json');
            if (response.ok) {
                const config = await response.json();
                this.config = { ...this.config, ...config };
            }
        } catch (error) {
            console.log('ℹ️ Usando configuración por defecto del avatar');
        }
    }

    async updateConfig(field, value) {
        this.config[field] = value;
        
        try {
            // Guardar en localStorage como fallback
            localStorage.setItem('orbix-avatar-config', JSON.stringify(this.config));
            
            // Intentar guardar en servidor (si está disponible)
            await fetch('/api/avatar-config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(this.config)
            });
            
            console.log(`✅ Configuración actualizada: ${field} = ${value}`);
            
        } catch (error) {
            console.log('ℹ️ Configuración guardada localmente');
        }

        // Aplicar cambios inmediatamente
        this.applyConfigChanges(field, value);
    }

    applyConfigChanges(field, value) {
        switch (field) {
            case 'model':
                this.loadAvatar();
                break;
            case 'animationSpeed':
                // Ya se aplica automáticamente en el loop
                break;
            case 'enableMovement':
            case 'enableBlinking':
            case 'enableBreathing':
            case 'enableLipSync':
                // Se aplican automáticamente en updateProceduralAnimations
                break;
        }
    }

    showLoading(message = 'Cargando...') {
        const container = document.getElementById('avatar-container');
        let loading = container.querySelector('.avatar-loading');
        
        if (!loading) {
            loading = document.createElement('div');
            loading.className = 'avatar-loading';
            loading.innerHTML = `
                <div class="loading-spinner"></div>
                <p>${message}</p>
            `;
            container.appendChild(loading);
        } else {
            loading.querySelector('p').textContent = message;
        }
    }

    hideLoading() {
        const loading = document.querySelector('.avatar-loading');
        if (loading) {
            loading.remove();
        }
    }

    showFallback() {
        this.hideLoading();
        const container = document.getElementById('avatar-container');
        
        const fallback = document.createElement('div');
        fallback.className = 'avatar-fallback';
        fallback.innerHTML = `
            <div class="fallback-icon">🤖</div>
            <p>Avatar no disponible</p>
            <small>Verificando conexión...</small>
        `;
        
        container.appendChild(fallback);
    }

    resize() {
        if (!this.renderer || !this.camera) return;
        
        const container = document.getElementById('avatar-container');
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    destroy() {
        if (this.mixer) {
            this.mixer.stopAllAction();
        }
        
        if (this.renderer) {
            this.renderer.dispose();
        }
        
        if (this.scene) {
            this.scene.clear();
        }
        
        this.isInitialized = false;
    }
}

// Crear instancia global para compatibilidad
window.avatarManager = new AvatarManager();

// Auto-inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    if (window.avatarManager && typeof window.avatarManager.init === 'function') {
        window.avatarManager.init();
    }
});

// Manejar redimensionado
window.addEventListener('resize', () => {
    if (window.avatarManager && typeof window.avatarManager.resize === 'function') {
        window.avatarManager.resize();
    }
});

// Export para uso como módulo ES6
export default AvatarManager;
