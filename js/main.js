// Main JavaScript - Maneja funcionalidades generales de la página
class OrbixMain {
    constructor() {
        this.init();
    }

    init() {
        this.setupLoadingScreen();
        this.setupScrollEffects();
        this.setupSmoothScrolling();
        this.setupAnimations();
        this.setupKeyboardNavigation();
        this.setupParallaxEffects();
    }

    setupLoadingScreen() {
        window.addEventListener('load', () => {
            const loadingScreen = document.getElementById('loading-screen');
            if (loadingScreen) {
                setTimeout(() => {
                    loadingScreen.style.opacity = '0';
                    setTimeout(() => {
                        loadingScreen.style.display = 'none';
                    }, 500);
                }, 2000);
            }
        });
    }

    setupScrollEffects() {
        const header = document.querySelector('.main-header');
        if (!header) return;

        let lastScrollY = window.scrollY;

        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            // Efecto de transparencia del header
            if (currentScrollY > 100) {
                header.style.background = 'rgba(10, 10, 10, 0.98)';
                header.style.backdropFilter = 'blur(15px)';
            } else {
                header.style.background = 'rgba(10, 10, 10, 0.95)';
                header.style.backdropFilter = 'blur(10px)';
            }

            // Ocultar/mostrar header al hacer scroll
            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }

            lastScrollY = currentScrollY;
        });
    }

    setupSmoothScrolling() {
        // Smooth scroll para enlaces internos
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
    }

    setupAnimations() {
        // Animaciones de entrada para elementos
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observar elementos con animaciones
        document.querySelectorAll('.feature-card, .hero-title, .hero-description').forEach(el => {
            observer.observe(el);
        });

        // Animación de escritura para el título
        this.typeWriterEffect();
    }

    typeWriterEffect() {
        const titleElement = document.querySelector('.hero-title');
        if (!titleElement) return;

        const text = titleElement.textContent;
        const highlightText = titleElement.querySelector('.highlight')?.textContent || '';
        
        // Solo aplicar efecto en pantallas grandes
        if (window.innerWidth > 768) {
            titleElement.innerHTML = '';
            let i = 0;
            const timer = setInterval(() => {
                const char = text.charAt(i);
                if (char) {
                    if (highlightText && text.indexOf(highlightText) <= i && i < text.indexOf(highlightText) + highlightText.length) {
                        titleElement.innerHTML += `<span class="highlight">${char}</span>`;
                    } else {
                        titleElement.innerHTML += char;
                    }
                    i++;
                } else {
                    clearInterval(timer);
                }
            }, 50);
        }
    }

    setupKeyboardNavigation() {
        // Navegación con teclado
        document.addEventListener('keydown', (e) => {
            // Escape para cerrar modal
            if (e.key === 'Escape') {
                const modal = document.querySelector('.modal-overlay.active');
                if (modal && window.avatarManager) {
                    window.avatarManager.closeEditor();
                }
            }

            // Ctrl + / para abrir configuración del avatar
            if (e.ctrlKey && e.key === '/') {
                e.preventDefault();
                if (window.avatarManager) {
                    window.avatarManager.openEditor();
                }
            }
        });
    }

    setupParallaxEffects() {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            // Efecto parallax en el fondo del hero
            hero.style.transform = `translateY(${rate}px)`;
        });
    }

    // Utilidades
    static formatTime(date) {
        return new Intl.DateTimeFormat('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        }).format(date);
    }

    static formatDate(date) {
        return new Intl.DateTimeFormat('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    }

    static showStatus(message, type = 'info') {
        console.log(`[${type.toUpperCase()}] ${message}`);
        
        // Actualizar indicador de estado si existe
        const statusIndicator = document.querySelector('.status-indicator');
        if (statusIndicator) {
            statusIndicator.className = `status-indicator ${type === 'success' ? 'active' : 'inactive'}`;
        }
    }

    static async fetchWithTimeout(url, options = {}, timeout = 5000) {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);
        
        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal
            });
            clearTimeout(id);
            return response;
        } catch (error) {
            clearTimeout(id);
            throw error;
        }
    }
}

// Clase para manejar efectos de partículas (opcional)
class ParticleEffect {
    constructor(container) {
        this.container = container;
        this.particles = [];
        this.init();
    }

    init() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.container.appendChild(this.canvas);
        
        this.resize();
        this.createParticles();
        this.animate();
        
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = this.container.offsetWidth;
        this.canvas.height = this.container.offsetHeight;
    }

    createParticles() {
        const numParticles = Math.floor((this.canvas.width * this.canvas.height) / 15000);
        
        for (let i = 0; i < numParticles; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Mantener partículas en pantalla
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;
            
            // Dibujar partícula
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(0, 255, 204, ${particle.opacity})`;
            this.ctx.fill();
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar funcionalidades principales
    window.orbixMain = new OrbixMain();
    
    // Añadir efecto de partículas al hero (opcional)
    const hero = document.querySelector('.hero');
    if (hero && window.innerWidth > 768) {
        hero.style.position = 'relative';
        const particleContainer = document.createElement('div');
        particleContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 0;
        `;
        hero.appendChild(particleContainer);
        new ParticleEffect(particleContainer);
    }
    
    // Configurar indicadores de estado
    const statusIndicator = document.querySelector('.status-indicator');
    if (statusIndicator) {
        // Simular conexión con el sistema
        setTimeout(() => {
            statusIndicator.classList.add('active');
            OrbixMain.showStatus('Sistemas Orbix conectados', 'success');
        }, 3000);
    }
    
    // Configurar tooltips dinámicos
    document.querySelectorAll('[title]').forEach(element => {
        element.addEventListener('mouseenter', function() {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = this.getAttribute('title');
            tooltip.style.cssText = `
                position: absolute;
                background: rgba(0, 0, 0, 0.9);
                color: white;
                padding: 0.5rem 1rem;
                border-radius: 5px;
                font-size: 0.8rem;
                z-index: 10000;
                pointer-events: none;
                white-space: nowrap;
            `;
            document.body.appendChild(tooltip);
            
            const updatePosition = (e) => {
                tooltip.style.left = (e.clientX + 10) + 'px';
                tooltip.style.top = (e.clientY - 30) + 'px';
            };
            
            this.addEventListener('mousemove', updatePosition);
            this.addEventListener('mouseleave', () => {
                tooltip.remove();
                this.removeEventListener('mousemove', updatePosition);
            });
        });
    });
    
    console.log('🚀 Orbix AI Systems iniciado correctamente');
});

// Exportar para uso global
window.OrbixMain = OrbixMain;
