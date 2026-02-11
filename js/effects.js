// Efeitos de partículas e animações - VERSÃO ATUALIZADA

class ParticleEffects {
    constructor() {
        this.particlesContainer = document.getElementById('particles');
        this.particles = [];
        this.maxParticles = 50;
        this.colors = [
            '#8a2be2', // Neon Purple
            '#00bfff', // Neon Blue
            '#00ff88', // Neon Green
            '#ff00ff', // Neon Pink
            '#ffffff'  // White
        ];
        
        this.init();
    }
    
    init() {
        this.createParticles();
        this.animateParticles();
        
        // Recriar partículas ao redimensionar
        window.addEventListener('resize', () => {
            this.particles = [];
            this.particlesContainer.innerHTML = '';
            this.createParticles();
        });
    }
    
    createParticles() {
        for (let i = 0; i < this.maxParticles; i++) {
            this.createParticle();
        }
    }
    
    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Tamanho aleatório (mantido)
        const size = Math.random() * 2 + 0.5; // Partículas ainda menores
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Cor aleatória
        const color = this.colors[Math.floor(Math.random() * this.colors.length)];
        particle.style.backgroundColor = color;
        particle.style.boxShadow = `0 0 ${size * 1.5}px ${color}`; // Brilho ainda mais reduzido
        
        // Posição inicial aleatória
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        
        // Velocidade MUITO mais lenta (reduzida em 80%)
        particle.speedX = (Math.random() - 0.5) * 0.08;
        particle.speedY = (Math.random() - 0.5) * 0.08;
        
        // Opacidade muito baixa
        particle.opacity = Math.random() * 0.15 + 0.05;
        particle.style.opacity = particle.opacity;
        
        // Adicionar ao container
        this.particlesContainer.appendChild(particle);
        this.particles.push({
            element: particle,
            speedX: particle.speedX,
            speedY: particle.speedY,
            opacity: particle.opacity
        });
    }
    
    animateParticles() {
        const animate = () => {
            this.particles.forEach(particle => {
                let rect = particle.element.getBoundingClientRect();
                
                // Movimento MUITO mais lento
                let x = parseFloat(particle.element.style.left) + particle.speedX * 0.3;
                let y = parseFloat(particle.element.style.top) + particle.speedY * 0.3;
                
                // Verificar bordas e inverter direção suavemente
                if (x < 0 || x > 100) particle.speedX *= -0.8;
                if (y < 0 || y > 100) particle.speedY *= -0.8;
                
                // Garantir que a partícula fique dentro dos limites
                x = Math.max(0, Math.min(100, x));
                y = Math.max(0, Math.min(100, y));
                
                particle.element.style.left = `${x}%`;
                particle.element.style.top = `${y}%`;
                
                // Efeito de pulsação muito suave
                particle.opacity += (Math.random() - 0.5) * 0.01;
                particle.opacity = Math.max(0.03, Math.min(0.15, particle.opacity));
                particle.element.style.opacity = particle.opacity;
            });
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    createExplosion(x, y, color = '#8a2be2', count = 15) {
        for (let i = 0; i < count; i++) {
            const explosionParticle = document.createElement('div');
            explosionParticle.className = 'explosion-particle';
            
            // Tamanho
            const size = Math.random() * 8 + 3;
            explosionParticle.style.width = `${size}px`;
            explosionParticle.style.height = `${size}px`;
            
            // Cor
            explosionParticle.style.backgroundColor = color;
            explosionParticle.style.boxShadow = `0 0 ${size * 3}px ${color}`;
            explosionParticle.style.borderRadius = '50%';
            
            // Posição inicial
            explosionParticle.style.position = 'fixed';
            explosionParticle.style.left = `${x}px`;
            explosionParticle.style.top = `${y}px`;
            explosionParticle.style.zIndex = '999';
            
            // Velocidade radial
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 3 + 1;
            const speedX = Math.cos(angle) * speed;
            const speedY = Math.sin(angle) * speed;
            
            // Adicionar ao container
            document.body.appendChild(explosionParticle);
            
            // Animação da explosão
            let opacity = 1;
            const animateExplosion = () => {
                opacity -= 0.02;
                
                if (opacity <= 0) {
                    explosionParticle.remove();
                    return;
                }
                
                const currentX = parseFloat(explosionParticle.style.left);
                const currentY = parseFloat(explosionParticle.style.top);
                
                explosionParticle.style.left = `${currentX + speedX}px`;
                explosionParticle.style.top = `${currentY + speedY}px`;
                explosionParticle.style.opacity = opacity;
                
                requestAnimationFrame(animateExplosion);
            };
            
            animateExplosion();
        }
    }
}

// Classe para criar efeito de fumaça Purple Haze nos produtos
class ProductSmokeEffect {
    constructor(container, color, count = 40) {
        this.container = container;
        this.color = color;
        this.count = count;
        this.smokeContainer = null;
        this.circles = [];
        
        this.init();
    }
    
    init() {
        this.createSmokeContainer();
        this.createSmokeCircles();
        this.startAnimation();
    }
    
    createSmokeContainer() {
        this.smokeContainer = document.createElement('div');
        this.smokeContainer.className = 'product-smoke-container';
        this.container.appendChild(this.smokeContainer);
    }
    
    createSmokeCircles() {
        // Criar círculos de fumaça baseado no Purple Haze
        for (let i = 1; i <= this.count; i++) {
            const circle = document.createElement('div');
            circle.className = 'smoke-circle';
            
            // Tamanho crescente (inspirado no Purple Haze)
            const size = i * 3; // i * 6 no original, reduzindo
            circle.style.width = `${size}px`;
            circle.style.height = `${size}px`;
            
            // Posição orbital
            const right = i * 6; // i * 10 no original, mais compacto
            const bottom = i * 6;
            circle.style.right = `${right}%`;
            circle.style.bottom = `${bottom}%`;
            
            // Blur dinâmico
            const blur = i/3 + 5; // i/3 + 8 no original, menos blur
            circle.style.filter = `blur(${blur}px)`;
            
            // Ponto de origem para rotação
            circle.style.transformOrigin = `${i * 2}px ${i * 1}px`;
            
            // Delay individual para animação
            const delay = i/8;
            circle.style.animationDelay = `${delay}s`;
            
            // Cor baseada no produto com variação
            this.setCircleColor(circle, i);
            
            // Adicionar ao container
            this.smokeContainer.appendChild(circle);
            this.circles.push(circle);
        }
    }
    
    setCircleColor(circle, index) {
        // Converter cor hexadecimal para RGB
        let r, g, b;
        
        if (this.color.startsWith('#')) {
            r = parseInt(this.color.slice(1, 3), 16);
            g = parseInt(this.color.slice(3, 5), 16);
            b = parseInt(this.color.slice(5, 7), 16);
        } else {
            // Fallback para roxo
            r = 138;
            g = 43;
            b = 226;
        }
        
        // Variação de cor baseada no índice (como no Purple Haze)
        const rVar = Math.min(255, r + (index * 3));
        const gVar = Math.min(255, g + (index * 1));
        const bVar = Math.min(255, b + 205);
        const opacity = 1 - (index / 80);
        
        circle.style.background = `rgba(${rVar}, ${gVar}, ${bVar}, ${opacity})`;
        circle.style.borderColor = `rgba(255, 255, 255, 0.1)`;
        circle.style.boxShadow = `
            3px 0px rgba(255, 255, 255, ${0.2 - (index/40)}),
            6px -5px rgba(10, 0, 0, ${0.2 - (index/40)})
        `;
    }
    
    startAnimation() {
        // A animação é controlada por CSS
        // Adicionar classe de animação
        this.circles.forEach((circle, index) => {
            circle.style.animation = `smoke-float ${20 + (index * 0.5)}s ${index/10}s infinite linear`;
        });
    }
    
    updateColor(newColor) {
        this.color = newColor;
        this.circles.forEach((circle, index) => {
            this.setCircleColor(circle, index + 1);
        });
    }
    
    setIntensity(intensity) {
        // 0-1 scale
        this.circles.forEach(circle => {
            circle.style.opacity = intensity;
        });
    }
    
    destroy() {
        if (this.smokeContainer && this.smokeContainer.parentNode) {
            this.smokeContainer.parentNode.removeChild(this.smokeContainer);
        }
        this.circles = [];
    }
}

// Efeitos de iluminação dinâmica
class DynamicLighting {
    constructor() {
        this.lights = [];
        this.maxLights = 5;
        this.container = document.querySelector('.main-container');
        
        this.init();
    }
    
    init() {
        this.createAmbientLights();
        this.animateLights();
    }
    
    createAmbientLights() {
        for (let i = 0; i < this.maxLights; i++) {
            const light = document.createElement('div');
            light.className = 'ambient-light';
            
            // Tamanho e posição aleatórios
            const size = Math.random() * 200 + 100;
            light.style.width = `${size}px`;
            light.style.height = `${size}px`;
            light.style.left = `${Math.random() * 100}%`;
            light.style.top = `${Math.random() * 100}%`;
            
            // Cor baseada no índice
            const colors = [
                'rgba(138, 43, 226, 0.1)',
                'rgba(0, 191, 255, 0.1)',
                'rgba(0, 255, 136, 0.1)',
                'rgba(255, 0, 255, 0.1)'
            ];
            const color = colors[i % colors.length];
            light.style.backgroundColor = color;
            light.style.filter = 'blur(60px)';
            
            // Adicionar ao container
            this.container.appendChild(light);
            
            this.lights.push({
                element: light,
                speedX: (Math.random() - 0.5) * 0.2,
                speedY: (Math.random() - 0.5) * 0.2,
                pulseSpeed: Math.random() * 0.01 + 0.005
            });
        }
    }
    
    animateLights() {
        const animate = () => {
            this.lights.forEach((light, index) => {
                // Mover luz
                const rect = light.element.getBoundingClientRect();
                const x = parseFloat(light.element.style.left) + light.speedX;
                const y = parseFloat(light.element.style.top) + light.speedY;
                
                // Verificar bordas
                let newSpeedX = light.speedX;
                let newSpeedY = light.speedY;
                
                if (x < -20 || x > 120) newSpeedX *= -1;
                if (y < -20 || y > 120) newSpeedY *= -1;
                
                light.speedX = newSpeedX;
                light.speedY = newSpeedY;
                
                light.element.style.left = `${Math.max(-20, Math.min(120, x))}%`;
                light.element.style.top = `${Math.max(-20, Math.min(120, y))}%`;
                
                // Pulsação
                const opacity = 0.05 + Math.sin(Date.now() * light.pulseSpeed) * 0.05;
                light.element.style.opacity = opacity;
            });
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    createSpotlight(x, y, color = '#8a2be2') {
        const spotlight = document.createElement('div');
        spotlight.className = 'spotlight';
        
        spotlight.style.position = 'fixed';
        spotlight.style.left = `${x}px`;
        spotlight.style.top = `${y}px`;
        spotlight.style.width = '300px';
        spotlight.style.height = '300px';
        spotlight.style.background = `radial-gradient(circle, ${color}20, transparent 70%)`;
        spotlight.style.filter = 'blur(40px)';
        spotlight.style.pointerEvents = 'none';
        spotlight.style.zIndex = '5';
        spotlight.style.transform = 'translate(-50%, -50%)';
        
        document.body.appendChild(spotlight);
        
        // Remover após animação
        setTimeout(() => {
            spotlight.style.opacity = '0';
            spotlight.style.transition = 'opacity 1s ease';
            
            setTimeout(() => {
                if (spotlight.parentNode) {
                    spotlight.parentNode.removeChild(spotlight);
                }
            }, 1000);
        }, 500);
    }
}

// Efeito de mouse tracking
class MouseTracker {
    constructor() {
        this.tracker = null;
        this.mouseX = 0;
        this.mouseY = 0;
        
        this.init();
    }
    
    init() {
        this.createTracker();
        this.bindEvents();
    }
    
    createTracker() {
        this.tracker = document.createElement('div');
        this.tracker.className = 'mouse-tracker';
        this.tracker.style.position = 'fixed';
        this.tracker.style.width = '20px';
        this.tracker.style.height = '20px';
        this.tracker.style.background = 'radial-gradient(circle, #8a2be2, transparent 70%)';
        this.tracker.style.borderRadius = '50%';
        this.tracker.style.filter = 'blur(5px)';
        this.tracker.style.pointerEvents = 'none';
        this.tracker.style.zIndex = '9999';
        this.tracker.style.transform = 'translate(-50%, -50%)';
        this.tracker.style.opacity = '0';
        this.tracker.style.transition = 'opacity 0.3s ease';
        
        document.body.appendChild(this.tracker);
    }
    
    bindEvents() {
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            
            this.tracker.style.left = `${this.mouseX}px`;
            this.tracker.style.top = `${this.mouseY}px`;
            
            if (this.tracker.style.opacity === '0') {
                this.tracker.style.opacity = '0.3';
            }
        });
        
        document.addEventListener('mouseleave', () => {
            this.tracker.style.opacity = '0';
        });
        
        document.addEventListener('mouseenter', () => {
            this.tracker.style.opacity = '0.3';
        });
        
        // Efeito de clique
        document.addEventListener('click', (e) => {
            this.createClickEffect(e.clientX, e.clientY);
        });
    }
    
    createClickEffect(x, y) {
        const clickEffect = document.createElement('div');
        clickEffect.className = 'click-effect';
        clickEffect.style.position = 'fixed';
        clickEffect.style.left = `${x}px`;
        clickEffect.style.top = `${y}px`;
        clickEffect.style.width = '0';
        clickEffect.style.height = '0';
        clickEffect.style.borderRadius = '50%';
        clickEffect.style.background = 'radial-gradient(circle, #8a2be2, transparent 70%)';
        clickEffect.style.transform = 'translate(-50%, -50%)';
        clickEffect.style.pointerEvents = 'none';
        clickEffect.style.zIndex = '9998';
        
        document.body.appendChild(clickEffect);
        
        // Animação
        let size = 0;
        const maxSize = 100;
        const growSpeed = 10;
        
        const animate = () => {
            size += growSpeed;
            clickEffect.style.width = `${size}px`;
            clickEffect.style.height = `${size}px`;
            clickEffect.style.opacity = `${1 - size / maxSize}`;
            
            if (size < maxSize) {
                requestAnimationFrame(animate);
            } else {
                if (clickEffect.parentNode) {
                    clickEffect.parentNode.removeChild(clickEffect);
                }
            }
        };
        
        animate();
    }
}

// Efeito de digitação
class TypewriterEffect {
    constructor(element, texts, options = {}) {
        this.element = element;
        this.texts = texts;
        this.options = {
            typingSpeed: 100,
            deletingSpeed: 50,
            pauseTime: 2000,
            loop: true,
            ...options
        };
        
        this.currentTextIndex = 0;
        this.currentCharIndex = 0;
        this.isDeleting = false;
        this.isPaused = false;
        
        this.init();
    }
    
    init() {
        this.type();
    }
    
    type() {
        const currentText = this.texts[this.currentTextIndex];
        
        if (!this.isDeleting && !this.isPaused) {
            // Digitando
            this.element.textContent = currentText.substring(0, this.currentCharIndex + 1);
            this.currentCharIndex++;
            
            if (this.currentCharIndex === currentText.length) {
                this.isPaused = true;
                
                setTimeout(() => {
                    this.isPaused = false;
                    this.isDeleting = true;
                    this.type();
                }, this.options.pauseTime);
                
                return;
            }
        } else if (this.isDeleting) {
            // Apagando
            this.element.textContent = currentText.substring(0, this.currentCharIndex - 1);
            this.currentCharIndex--;
            
            if (this.currentCharIndex === 0) {
                this.isDeleting = false;
                this.currentTextIndex = (this.currentTextIndex + 1) % this.texts.length;
            }
        }
        
        const speed = this.isDeleting ? this.options.deletingSpeed : this.options.typingSpeed;
        setTimeout(() => this.type(), speed);
    }
}

// Inicializar efeitos quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar partículas
    const particles = new ParticleEffects();
    
    // Inicializar iluminação dinâmica
    const lighting = new DynamicLighting();
    
    // Inicializar rastreador de mouse
    const mouseTracker = new MouseTracker();
    
    // Expor para uso global
    window.particleEffects = particles;
    window.dynamicLighting = lighting;
    window.mouseTracker = mouseTracker;
    window.ProductSmokeEffect = ProductSmokeEffect;
    
    // Efeito de digitação para elementos com classe 'typewriter'
    document.querySelectorAll('.typewriter').forEach(element => {
        const texts = element.dataset.texts ? JSON.parse(element.dataset.texts) : [element.textContent];
        new TypewriterEffect(element, texts);
    });
});

// Função para criar efeito de confete
function createConfetti(count = 100, color = null) {
    const colors = color ? [color] : ['#8a2be2', '#00bfff', '#00ff88', '#ff00ff', '#ffffff'];
    
    for (let i = 0; i < count; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        
        // Tamanho e forma aleatórios
        const size = Math.random() * 10 + 5;
        confetti.style.width = `${size}px`;
        confetti.style.height = `${size}px`;
        
        // Forma aleatória (quadrado ou círculo)
        if (Math.random() > 0.5) {
            confetti.style.borderRadius = '50%';
        }
        
        // Cor aleatória
        const confettiColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.backgroundColor = confettiColor;
        
        // Posição inicial (topo da tela)
        confetti.style.position = 'fixed';
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.top = '-20px';
        confetti.style.zIndex = '9999';
        confetti.style.pointerEvents = 'none';
        
        // Adicionar ao body
        document.body.appendChild(confetti);
        
        // Animação
        const animationDuration = Math.random() * 3 + 2;
        const animationDelay = Math.random() * 0.5;
        
        confetti.style.transition = `all ${animationDuration}s cubic-bezier(0.1, 0.8, 0.3, 1) ${animationDelay}s`;
        
        // Mover para baixo com movimento lateral
        setTimeout(() => {
            const endX = (Math.random() - 0.5) * 200;
            const endY = window.innerHeight + 20;
            const rotation = Math.random() * 720 - 360;
            
            confetti.style.transform = `translate(${endX}px, ${endY}px) rotate(${rotation}deg)`;
            confetti.style.opacity = '0';
            
            // Remover após animação
            setTimeout(() => {
                if (confetti.parentNode) {
                    confetti.parentNode.removeChild(confetti);
                }
            }, animationDuration * 1000 + 1000);
        }, 10);
    }
}

// Exportar funções para uso global
window.createConfetti = createConfetti;