// Configuração Principal e Timer

class MainApp {
    constructor() {
        this.promoEndTime = this.getPromoEndTime();
        this.timerInterval = null;
        
        this.init();
    }
    
    init() {
        this.initTimer();
        this.initScrollAnimations();
        this.initEventListeners();
        this.initPerformanceOptimizations();
    }
    
    getPromoEndTime() {
        // Promoção dura 24 horas a partir do carregamento
        const endTime = new Date();
        endTime.setHours(endTime.getHours() + 24);
        return endTime;
    }
    
    initTimer() {
        this.updateTimer();
        this.timerInterval = setInterval(() => this.updateTimer(), 1000);
    }
    
    updateTimer() {
        const now = new Date();
        const timeLeft = this.promoEndTime - now;
        
        if (timeLeft <= 0) {
            clearInterval(this.timerInterval);
            document.getElementById('countdown').innerHTML = `
                <span class="timer-unit">00</span>
                <span class="timer-separator">:</span>
                <span class="timer-unit">00</span>
                <span class="timer-separator">:</span>
                <span class="timer-unit">00</span>
            `;
            
            // Mostrar mensagem de promoção encerrada
            this.showPromoEndedMessage();
            return;
        }
        
        const hours = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        
        const timerDisplay = document.getElementById('countdown');
        if (timerDisplay) {
            timerDisplay.innerHTML = `
                <span class="timer-unit">${hours.toString().padStart(2, '0')}</span>
                <span class="timer-separator">:</span>
                <span class="timer-unit">${minutes.toString().padStart(2, '0')}</span>
                <span class="timer-separator">:</span>
                <span class="timer-unit">${seconds.toString().padStart(2, '0')}</span>
            `;
            
            // Efeito de pulsação quando restar menos de 10 minutos
            if (hours === 0 && minutes < 10) {
                timerDisplay.classList.add('pulse');
            } else {
                timerDisplay.classList.remove('pulse');
            }
        }
    }
    
    showPromoEndedMessage() {
        const promoCard = document.querySelector('.promo-card');
        if (promoCard) {
            promoCard.innerHTML = `
                <div class="promo-header">
                    <h3 class="promo-title">
                        <i class="fas fa-clock"></i>
                        PROMOÇÃO ENCERRADA
                    </h3>
                </div>
                <div class="promo-content">
                    <p>A promoção especial de 10% foi encerrada. Fique atento para nossas próximas ofertas!</p>
                    <div class="promo-newsletter">
                        <p>Quer ser avisado sobre as próximas promoções?</p>
                        <div class="newsletter-form">
                            <input type="email" placeholder="Seu melhor e-mail" class="newsletter-input">
                            <button class="newsletter-btn">
                                <i class="fas fa-paper-plane"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }
    }
    
    initScrollAnimations() {
        // Observar elementos para animação ao scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    
                    // Adicionar delay baseado no índice
                    const index = Array.from(entry.target.parentNode.children).indexOf(entry.target);
                    entry.target.style.animationDelay = `${index * 0.1}s`;
                }
            });
        }, observerOptions);
        
        // Observar cards de tecnologia
        document.querySelectorAll('.tech-card').forEach(card => {
            observer.observe(card);
        });
        
        // Observar depoimentos
        document.querySelectorAll('.testimonial-card').forEach(card => {
            observer.observe(card);
        });
        
        // Observar seções
        document.querySelectorAll('section').forEach(section => {
            observer.observe(section);
        });
    }
    
    initEventListeners() {
        // Smooth scroll para âncoras
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
        });
        
        // Atualizar ano no footer
        const yearElement = document.querySelector('.footer-copyright');
        if (yearElement) {
            const currentYear = new Date().getFullYear();
            yearElement.textContent = yearElement.textContent.replace('2023', currentYear);
        }
        
        // Newsletter form
        document.addEventListener('submit', (e) => {
            if (e.target.classList.contains('newsletter-form')) {
                e.preventDefault();
                const input = e.target.querySelector('.newsletter-input');
                const email = input.value.trim();
                
                if (this.validateEmail(email)) {
                    this.subscribeNewsletter(email);
                    input.value = '';
                } else {
                    this.showNewsletterMessage('Por favor, insira um e-mail válido.', 'error');
                }
            }
        });
    }
    
    initPerformanceOptimizations() {
        // Lazy loading para imagens
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                    
                    if (src) {
                        img.src = src;
                        img.removeAttribute('data-src');
                        img.classList.add('loaded');
                    }
                    
                    observer.unobserve(img);
                }
            });
        });
        
        // Observar todas as imagens com data-src
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
        
        // Debounce para eventos de resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                // Atualizar carrossel após redimensionamento
                if (window.carousel3D) {
                    window.carousel3D.updateCarousel();
                }
            }, 250);
        });
    }
    
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    subscribeNewsletter(email) {
        // Simular envio para newsletter
        console.log('Inscrição na newsletter:', email);
        
        // Mostrar mensagem de sucesso
        this.showNewsletterMessage('Inscrição realizada com sucesso!', 'success');
        
        // Criar confetti
        if (window.createConfetti) {
            window.createConfetti(50, '#00ff88');
        }
    }
    
    showNewsletterMessage(text, type = 'info') {
        const message = document.createElement('div');
        message.className = `newsletter-message ${type}`;
        message.textContent = text;
        
        message.style.position = 'fixed';
        message.style.bottom = '20px';
        message.style.left = '50%';
        message.style.transform = 'translateX(-50%) translateY(100%)';
        message.style.background = type === 'success' 
            ? 'linear-gradient(135deg, rgba(0, 255, 136, 0.9), rgba(0, 191, 255, 0.8))'
            : 'linear-gradient(135deg, rgba(255, 59, 48, 0.9), rgba(255, 95, 87, 0.8))';
        message.style.backdropFilter = 'blur(10px)';
        message.style.border = '1px solid rgba(255, 255, 255, 0.1)';
        message.style.borderRadius = '12px';
        message.style.padding = '15px 30px';
        message.style.color = '#ffffff';
        message.style.zIndex = '10000';
        message.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
        message.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.3)';
        
        document.body.appendChild(message);
        
        // Mostrar mensagem
        setTimeout(() => {
            message.style.transform = 'translateX(-50%) translateY(0)';
        }, 10);
        
        // Ocultar e remover após 3 segundos
        setTimeout(() => {
            message.style.transform = 'translateX(-50%) translateY(100%)';
            
            setTimeout(() => {
                if (message.parentNode) {
                    message.parentNode.removeChild(message);
                }
            }, 500);
        }, 3000);
    }
}

// Inicializar aplicação quando o DOM estiver carregado
// Substituir o código de inicialização existente
document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicializar efeitos primeiro
    const particles = new ParticleEffects();
    window.particleEffects = particles;
    
    // 2. Inicializar carrinho
    const shoppingCart = new ShoppingCart();
    window.shoppingCart = shoppingCart;
    
    // 3. Verificar qual sistema usar
    const hasCarousel3D = document.getElementById('carousel3D');
    const hasCatalogGrid = document.getElementById('catalogGrid');
    
    if (hasCarousel3D && hasCatalogGrid) {
        // Usar apenas o catálogo (mais completo)
        console.log('🌐 Sistema: Catálogo + Carrinho');
        const productCatalog = new ProductCatalog();
        window.productCatalog = productCatalog;
        window.carousel3D = null; // Desativar carrossel
    } else if (hasCarousel3D) {
        // Usar apenas carrossel
        console.log('🌀 Sistema: Carrossel 3D + Carrinho');
        const carousel3D = new Carousel3D();
        window.carousel3D = carousel3D;
    }
    
    // 4. Inicializar timer principal
    const mainApp = new MainApp();
    window.mainApp = mainApp;
    
    console.log('✅ Sistema inicializado com sucesso!');
});

