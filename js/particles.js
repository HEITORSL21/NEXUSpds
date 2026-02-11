// Sistema de partículas voando

class ParticleSystem {
    constructor() {
        this.particlesContainer = document.getElementById('particles');
        this.particles = [];
        this.maxParticles = 80; // Aumentado para mais partículas
        this.colors = [
            '#8a2be2', // Neon Purple
            '#00bfff', // Neon Blue
            '#00ff88', // Neon Green
            '#ff00ff', // Neon Pink
            '#ffffff', // White
            '#ff3366', // Neon Red
            '#ffcc00'  // Neon Yellow
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
            this.createParticle(i);
        }
    }
    
    createParticle(index) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Tamanho aleatório
        const size = Math.random() * 5 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Cor aleatória
        const color = this.colors[Math.floor(Math.random() * this.colors.length)];
        particle.style.backgroundColor = color;
        particle.style.boxShadow = `0 0 ${size * 4}px ${color}`;
        
        // Posição inicial aleatória
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        
        // Velocidade e direção aleatórias
        const speed = Math.random() * 0.8 + 0.2;
        const angle = Math.random() * Math.PI * 2;
        particle.speedX = Math.cos(angle) * speed;
        particle.speedY = Math.sin(angle) * speed;
        
        // Opacidade aleatória
        particle.opacity = Math.random() * 0.6 + 0.2;
        particle.style.opacity = particle.opacity;
        
        // Adicionar ao container
        this.particlesContainer.appendChild(particle);
        this.particles.push({
            element: particle,
            speedX: particle.speedX,
            speedY: particle.speedY,
            opacity: particle.opacity,
            originalOpacity: particle.opacity,
            pulseSpeed: Math.random() * 0.02 + 0.01,
            pulsePhase: Math.random() * Math.PI * 2
        });
    }
    
    animateParticles() {
        const animate = () => {
            const time = Date.now() * 0.001;
            
            this.particles.forEach((particle, index) => {
                let rect = particle.element.getBoundingClientRect();
                
                // Mover partícula
                let x = parseFloat(particle.element.style.left) + particle.speedX;
                let y = parseFloat(particle.element.style.top) + particle.speedY;
                
                // Verificar bordas e inverter direção se necessário
                if (x < -5 || x > 105) particle.speedX *= -1;
                if (y < -5 || y > 105) particle.speedY *= -1;
                
                // Garantir que a partícula fique dentro dos limites
                x = Math.max(-5, Math.min(105, x));
                y = Math.max(-5, Math.min(105, y));
                
                particle.element.style.left = `${x}%`;
                particle.element.style.top = `${y}%`;
                
                // Efeito de pulsação
                particle.opacity = particle.originalOpacity + Math.sin(time * particle.pulseSpeed + particle.pulsePhase) * 0.2;
                particle.opacity = Math.max(0.1, Math.min(0.8, particle.opacity));
                particle.element.style.opacity = particle.opacity;
                
                // Efeito de interação com o mouse
                if (window.mouseX && window.mouseY) {
                    const dx = (x / 100 * window.innerWidth) - window.mouseX;
                    const dy = (y / 100 * window.innerHeight) - window.mouseY;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 150) {
                        // Repulsão
                        const force = (150 - distance) / 150 * 0.5;
                        particle.element.style.left = `${x + (dx / distance) * force}%`;
                        particle.element.style.top = `${y + (dy / distance) * force}%`;
                        
                        // Brilho ao passar o mouse
                        particle.element.style.opacity = Math.min(particle.opacity * 1.5, 1);
                    }
                }
            });
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    createExplosion(x, y, color = '#8a2be2', count = 20) {
        for (let i = 0; i < count; i++) {
            const explosionParticle = document.createElement('div');
            explosionParticle.className = 'explosion-particle';
            
            // Tamanho
            const size = Math.random() * 10 + 5;
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
            explosionParticle.style.zIndex = '9999';
            
            // Velocidade radial
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 4 + 2;
            const speedX = Math.cos(angle) * speed;
            const speedY = Math.sin(angle) * speed;
            
            // Rotação
            const rotationSpeed = (Math.random() - 0.5) * 10;
            
            // Adicionar ao container
            document.body.appendChild(explosionParticle);
            
            // Movimento com gravidade simulada
            let currentX = x;
            let currentY = y;
            let currentSpeedY = speedY;
            let opacity = 1;
            let rotation = 0;
            
            const animateExplosion = () => {
                const gravity = 0.1;
                currentSpeedY += gravity;
                
                currentX += speedX;
                currentY += currentSpeedY;
                
                explosionParticle.style.left = `${currentX}px`;
                explosionParticle.style.top = `${currentY}px`;
                opacity -= 0.02;
                explosionParticle.style.opacity = opacity;
                
                // Rotação
                rotation += rotationSpeed;
                explosionParticle.style.transform = `rotate(${rotation}deg)`;
                
                if (opacity > 0) {
                    requestAnimationFrame(animateExplosion);
                } else {
                    explosionParticle.remove();
                }
            };
            
            animateExplosion();
        }
    }
    
    createSmoke(x, y, color = '#8a2be2', count = 15) {
        for (let i = 0; i < count; i++) {
            const smoke = document.createElement('div');
            smoke.className = 'cart-smoke';
            
            // Cor da fumaça baseada no produto
            smoke.style.background = `radial-gradient(circle, ${color}40, transparent 70%)`;
            
            // Posição inicial
            smoke.style.left = `${x}px`;
            smoke.style.top = `${y}px`;
            
            // Tamanho aleatório
            const size = Math.random() * 100 + 50;
            smoke.style.width = `${size}px`;
            smoke.style.height = `${size}px`;
            
            // Adicionar ao body
            document.body.appendChild(smoke);
            
            // Remover após animação
            setTimeout(() => {
                smoke.remove();
            }, 2000);
        }
    }
}

// Inicializar sistema de partículas quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    const particleSystem = new ParticleSystem();
    window.particleSystem = particleSystem;
    
    // Rastrear posição do mouse para interação
    document.addEventListener('mousemove', (e) => {
        window.mouseX = e.clientX;
        window.mouseY = e.clientY;
    });
    
    // Limpar rastreamento quando o mouse sair da janela
    document.addEventListener('mouseleave', () => {
        window.mouseX = null;
        window.mouseY = null;
    });
});

// Função para criar confetti
function createConfetti(count = 100, color = null) {
    const colors = color ? [color] : ['#8a2be2', '#00bfff', '#00ff88', '#ff00ff', '#ffffff', '#ff3366', '#ffcc00'];
    
    for (let i = 0; i < count; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        
        // Tamanho e forma aleatórios
        const size = Math.random() * 12 + 3;
        confetti.style.width = `${size}px`;
        confetti.style.height = `${size}px`;
        
        // Forma aleatória
        if (Math.random() > 0.5) {
            confetti.style.borderRadius = '50%';
        } else if (Math.random() > 0.5) {
            confetti.style.borderRadius = '20%';
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
        
        // Rotação inicial
        const rotation = Math.random() * 360;
        confetti.style.transform = `rotate(${rotation}deg)`;
        
        // Adicionar ao body
        document.body.appendChild(confetti);
        
        // Animação
        const animationDuration = Math.random() * 3 + 2;
        const animationDelay = Math.random() * 0.5;
        
        // Movimento com curva
        const endX = (Math.random() - 0.5) * 300;
        const endY = window.innerHeight + 20;
        const rotationSpeed = (Math.random() - 0.5) * 20;
        
        let startTime = Date.now();
        
        const animateConfetti = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / (animationDuration * 1000), 1);
            
            if (progress >= 1) {
                confetti.remove();
                return;
            }
            
            // Movimento parabólico
            const x = endX * progress;
            const y = endY * progress - (progress * progress * 500);
            const currentRotation = rotation + (rotationSpeed * elapsed / 50);
            
            confetti.style.left = `calc(${confetti.style.left} + ${x}px)`;
            confetti.style.top = `calc(${confetti.style.top} + ${y}px)`;
            confetti.style.transform = `rotate(${currentRotation}deg)`;
            confetti.style.opacity = 1 - progress;
            
            requestAnimationFrame(animateConfetti);
        };
        
        setTimeout(() => {
            startTime = Date.now();
            animateConfetti();
        }, animationDelay * 1000);
    }
}

// Exportar funções para uso global
window.createConfetti = createConfetti;