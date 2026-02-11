// Carrossel 3D Interativo - VERSÃO CORRIGIDA
class Carousel3D {
    constructor() {
        this.carousel = document.getElementById('carousel3D');
        this.indicatorsContainer = document.getElementById('indicators');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.autoRotateBtn = document.getElementById('autoRotateBtn');
        
        // CORREÇÃO: Criar painel dinâmico se não existir
        this.activeProductPanel = document.getElementById('activeProductPanel');
        if (!this.activeProductPanel) {
            this.activeProductPanel = this.createDynamicPanel('activeProductPanel', 'active-product-panel');
        }
        
        // Produtos
        this.products = [
            {
                id: 1,
                name: 'NEXUS VORTEX',
                description: 'Design futurista com iluminação LED integrada e bateria de longa duração. Sistema de vaporização otimizado para máxima produção de vapor.',
                price: 80.91,
                originalPrice: 89.90,
                image: 'https://i.ibb.co/xrfzYq6/image-Photoroom-1.png',
                gradient: 'linear-gradient(135deg, #8a2be2 0%, #00bfff 50%, #00ff88 100%)',
                colorGlow: '#8a2be2',
                badge: 'bestseller',
                rating: 4.9,
                tags: ['cítrico', 'herbal', 'energético'],
                specs: ['🔋 800mAh', '💨 2.0ml', '⚡ USB-C', '🌈 LED RGB'],
                economy: 8.99
            },
            {
                id: 2,
                name: 'QUANTUM CHILL',
                description: 'Acabamento metálico premium com sistema de fluxo de ar ajustável. Tecnologia de resfriamento para vaporização suave.',
                price: 89.91,
                originalPrice: 99.90,
                image: 'https://i.ibb.co/GvwtN25T/image-Photoroom.png',
                gradient: 'linear-gradient(135deg, #ff66cc 0%, #ccccff 50%, #ffccff 100%)',
                colorGlow: '#ff66cc',
                badge: 'new',
                rating: 4.8,
                tags: ['refrescante', 'menta', 'frutas vermelhas'],
                specs: ['🔋 1000mAh', '💨 2.5ml', '🎛️ Ajustável', '❄️ Resfriamento'],
                economy: 9.99
            },
            {
                id: 3,
                name: 'CYBER FROST',
                description: 'Edição limitada escura com tecnologia de vaporização otimizada. Design stealth com iluminação sutil.',
                price: 107.91,
                originalPrice: 119.90,
                image: 'https://i.ibb.co/Q3WvPnRf/image-Photoroom-4.png',
                gradient: 'linear-gradient(135deg, #333333 0%, #666666 50%, #999999 100%)',
                colorGlow: '#666666',
                badge: 'exclusive',
                rating: 4.6,
                tags: ['gelado', 'eucalipto', 'frutas brancas'],
                specs: ['🔋 1200mAh', '💨 3.0ml', '⚡ Carga Rápida', '🌙 Modo Stealth'],
                economy: 11.99
            },
            {
                id: 4,
                name: 'NEURAL SPARK',
                description: 'Edição especial com cores nebula, tecnologia de aquecimento rápido e design ergonômico.',
                price: 98.91,
                originalPrice: 109.90,
                image: 'https://i.ibb.co/21220g6p/image-Photoroom-3.png',
                gradient: 'linear-gradient(135deg, #8a2be2 0%, #ff66cc 50%, #ff3366 100%)',
                colorGlow: '#8a2be2',
                badge: 'bestseller',
                rating: 4.9,
                tags: ['tropical', 'energético', 'elétrico'],
                specs: ['🔋 900mAh', '💨 2.2ml', '🌈 Cores Nebula', '🚀 Aquecimento Rápido'],
                economy: 10.99
            },
            {
                id: 5,
                name: 'DIGITAL DREAM',
                description: 'Edição limitada aurora com efeito de cor cambiante e bateria de alta performance.',
                price: 116.91,
                originalPrice: 129.90,
                image: 'https://i.ibb.co/cKjtNgtt/image-Photoroom-2.png',
                gradient: 'linear-gradient(135deg, #ff3366 0%, #00ff88 50%, #00bfff 100%)',
                colorGlow: '#00ff88',
                badge: 'exclusive',
                rating: 4.7,
                tags: ['suave', 'baunilha', 'especiarias'],
                specs: ['🔋 1100mAh', '💨 2.8ml', '✨ Efeito Aurora', '⚡ Alta Performance'],
                economy: 12.99
            }
        ];
        
        this.currentIndex = 0;
        this.rotationAngle = 0;
        this.isAutoRotating = true;
        this.autoRotateInterval = null;
        this.rotationSpeed = 3000;
        
        this.init();
    }
    
    // CORREÇÃO: Método para criar painéis dinamicamente
    createDynamicPanel(id, className) {
        const panel = document.createElement('div');
        panel.id = id;
        panel.className = className;
        panel.style.cssText = `
            max-width: 800px;
            margin: 40px auto;
            padding: 30px;
            background: linear-gradient(135deg, rgba(26, 26, 26, 0.9), rgba(40, 40, 40, 0.85));
            border-radius: 20px;
            border: 1px solid rgba(138, 43, 226, 0.3);
            backdrop-filter: blur(20px);
            animation: fadeIn 0.5s ease;
        `;
        
        // Adicionar ao container do carrossel
        const carouselSection = document.querySelector('.carousel-3d-section');
        if (carouselSection) {
            carouselSection.appendChild(panel);
        } else {
            document.body.appendChild(panel);
        }
        
        return panel;
    }
    
    init() {
        // CORREÇÃO: Verificar se os elementos existem
        if (!this.carousel) {
            console.error('Elemento carousel3D não encontrado!');
            return;
        }
        
        this.renderCarousel();
        this.renderIndicators();
        this.updateActiveProductPanel();
        this.bindEvents();
        this.startAutoRotation();
        
        // Criar anéis orbitais
        this.createOrbitalRings();
        
        console.log('🌀 Carrossel 3D inicializado com sucesso!');
    }
    
    renderCarousel() {
        // CORREÇÃO: Limpar carrossel antes de renderizar
        this.carousel.innerHTML = '';
        
        const angleStep = 360 / this.products.length;
        
        this.products.forEach((product, index) => {
            const productElement = document.createElement('div');
            productElement.className = `product-3d ${index === this.currentIndex ? 'active' : ''}`;
            productElement.dataset.index = index;
            productElement.dataset.productId = product.id;
            
            // Calcular posição 3D
            const angle = (index * angleStep + this.rotationAngle) % 360;
            const radius = 250;
            const x = Math.sin((angle * Math.PI) / 180) * radius;
            const z = Math.cos((angle * Math.PI) / 180) * radius;
            const scale = index === this.currentIndex ? 1.2 : 0.7;
            const opacity = index === this.currentIndex ? 1 : 0.5;
            
            // Aplicar transformações 3D
            productElement.style.transform = `
                translate(-50%, -50%)
                translateX(${x}px)
                translateZ(${z}px)
                scale(${scale})
            `;
            productElement.style.opacity = opacity;
            
            // HTML do produto
            productElement.innerHTML = `
                <div class="product-card">
                    <div class="product-front">
                        <div class="product-glow" style="background: ${product.gradient}"></div>
                        <div class="product-image-container">
                            <img src="${product.image}" alt="${product.name}" class="product-image" style="color: ${product.colorGlow}">
                        </div>
                        ${product.badge ? `<div class="product-badge ${product.badge}">${product.badge.toUpperCase()}</div>` : ''}
                        <div class="product-info">
                            <h3 class="product-name" style="color: ${product.colorGlow}">${product.name}</h3>
                            <p class="product-category">${product.tags[0].toUpperCase()}</p>
                        </div>
                    </div>
                    <div class="product-back">
                        <div class="back-content">
                            <h3 class="back-title">${product.name}</h3>
                            <p class="back-description">${product.description}</p>
                            <div class="back-specs">
                                ${product.specs.map(spec => `<span class="spec-tag">${spec}</span>`).join('')}
                            </div>
                            <div class="back-price">
                                <div class="original-price">R$ ${product.originalPrice.toFixed(2)}</div>
                                <div class="current-price">R$ ${product.price.toFixed(2)}</div>
                                <div class="price-economy">Economize R$ ${product.economy.toFixed(2)}</div>
                            </div>
                            <button class="back-add-to-cart" data-product-id="${product.id}">
                                <i class="fas fa-cart-plus"></i>
                                ADICIONAR
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            // CORREÇÃO: Criar efeito de fumaça para cada produto
            setTimeout(() => {
                this.createSmokeEffect(productElement, product.colorGlow);
            }, 100);
            
            this.carousel.appendChild(productElement);
        });
    }
    
    // NOVO: Método para criar efeito de fumaça nos produtos
    createSmokeEffect(productElement, color) {
        const imageContainer = productElement.querySelector('.product-image-container');
        if (!imageContainer) return;
        
        // Criar container de fumaça
        const smokeContainer = document.createElement('div');
        smokeContainer.className = 'product-smoke-container';
        imageContainer.appendChild(smokeContainer);
        
        // Criar círculos de fumaça
        for (let i = 1; i <= 25; i++) {
            const circle = document.createElement('div');
            circle.className = 'smoke-circle';
            
            const size = i * 3;
            circle.style.width = `${size}px`;
            circle.style.height = `${size}px`;
            
            // Converter cor hexadecimal para RGB
            let r, g, b;
            if (color.startsWith('#')) {
                r = parseInt(color.slice(1, 3), 16);
                g = parseInt(color.slice(3, 5), 16);
                b = parseInt(color.slice(5, 7), 16);
            } else {
                r = 138; g = 43; b = 226; // Fallback para roxo
            }
            
            const rVar = Math.min(255, r + (i * 3));
            const gVar = Math.min(255, g + (i * 1));
            const bVar = Math.min(255, b + 205);
            const opacity = 1 - (i / 80);
            
            circle.style.background = `rgba(${rVar}, ${gVar}, ${bVar}, ${opacity})`;
            circle.style.borderColor = `rgba(255, 255, 255, 0.1)`;
            circle.style.filter = `blur(${i/3 + 5}px)`;
            
            // Posicionamento
            const right = i * 6;
            const bottom = i * 6;
            circle.style.right = `${right}%`;
            circle.style.bottom = `${bottom}%`;
            circle.style.transformOrigin = `${i * 2}px ${i * 1}px`;
            
            // Animação
            const delay = i/8;
            circle.style.animationDelay = `${delay}s`;
            circle.style.animation = `smoke-float ${20 + (i * 0.5)}s infinite linear`;
            
            smokeContainer.appendChild(circle);
        }
    }
    
    renderIndicators() {
        if (!this.indicatorsContainer) return;
        
        this.indicatorsContainer.innerHTML = '';
        
        this.products.forEach((_, index) => {
            const indicator = document.createElement('button');
            indicator.className = `indicator ${index === this.currentIndex ? 'active' : ''}`;
            indicator.dataset.index = index;
            
            indicator.addEventListener('click', () => {
                this.goToProduct(index);
            });
            
            this.indicatorsContainer.appendChild(indicator);
        });
    }
    
    createOrbitalRings() {
        const ringsContainer = document.createElement('div');
        ringsContainer.className = 'orbital-rings';
        
        // Criar 3 anéis orbitais
        for (let i = 0; i < 3; i++) {
            const ring = document.createElement('div');
            ring.className = 'orbital-ring';
            ringsContainer.appendChild(ring);
        }
        
        this.carousel.parentElement.appendChild(ringsContainer);
    }
    
    updateActiveProductPanel() {
        const product = this.products[this.currentIndex];
        
        this.activeProductPanel.innerHTML = `
            <div class="panel-header">
                <h2 class="panel-title">${product.name}</h2>
                <div class="panel-rating">
                    <div class="rating-stars">
                        ${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}
                    </div>
                    <span class="rating-value">${product.rating}</span>
                </div>
            </div>
            <div class="panel-content">
                <div class="panel-image">
                    <img src="${product.image}" alt="${product.name}" style="color: ${product.colorGlow}">
                </div>
                <div class="panel-details">
                    <p class="panel-description">${product.description}</p>
                    <div class="panel-tags">
                        ${product.tags.map(tag => `<span class="panel-tag">${tag}</span>`).join('')}
                    </div>
                    <div class="panel-pricing">
                        <div class="panel-original-price">De: R$ ${product.originalPrice.toFixed(2)}</div>
                        <div class="panel-current-price">Por: R$ ${product.price.toFixed(2)}</div>
                        <div class="panel-discount">
                            <i class="fas fa-tag"></i>
                            Economize R$ ${product.economy.toFixed(2)} (10% OFF)
                        </div>
                    </div>
                    <div class="panel-actions">
                        <div class="quantity-selector">
                            <button class="qty-btn minus">-</button>
                            <input type="number" class="qty-input" value="1" min="1" max="10">
                            <button class="qty-btn plus">+</button>
                        </div>
                        <button class="panel-add-to-cart" data-product-id="${product.id}">
                            <i class="fas fa-cart-plus"></i>
                            ADICIONAR AO CARRINHO
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Adicionar eventos aos botões do painel
        const qtyInput = this.activeProductPanel.querySelector('.qty-input');
        const minusBtn = this.activeProductPanel.querySelector('.qty-btn.minus');
        const plusBtn = this.activeProductPanel.querySelector('.qty-btn.plus');
        const addToCartBtn = this.activeProductPanel.querySelector('.panel-add-to-cart');
        
        if (minusBtn && qtyInput) {
            minusBtn.addEventListener('click', () => {
                const currentValue = parseInt(qtyInput.value);
                if (currentValue > 1) {
                    qtyInput.value = currentValue - 1;
                }
            });
        }
        
        if (plusBtn && qtyInput) {
            plusBtn.addEventListener('click', () => {
                const currentValue = parseInt(qtyInput.value);
                if (currentValue < 10) {
                    qtyInput.value = currentValue + 1;
                }
            });
        }
        
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', () => {
                const quantity = parseInt(qtyInput ? qtyInput.value : 1);
                this.addToCart(product, quantity);
            });
        }
    }
    
    bindEvents() {
        // Navegação
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => {
                this.prevProduct();
                this.stopAutoRotation();
            });
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => {
                this.nextProduct();
                this.stopAutoRotation();
            });
        }
        
        // Botão de rotação automática
        if (this.autoRotateBtn) {
            this.autoRotateBtn.addEventListener('click', () => {
                this.toggleAutoRotation();
            });
        }
        
        // Clique nos produtos
        this.carousel.addEventListener('click', (e) => {
            const productElement = e.target.closest('.product-3d');
            if (productElement) {
                const index = parseInt(productElement.dataset.index);
                if (index !== this.currentIndex) {
                    this.goToProduct(index);
                    this.stopAutoRotation();
                }
            }
            
            // Clique no botão de adicionar ao carrinho
            const addToCartBtn = e.target.closest('.back-add-to-cart');
            if (addToCartBtn) {
                const productId = parseInt(addToCartBtn.dataset.productId);
                const product = this.products.find(p => p.id === productId);
                if (product) {
                    this.addToCart(product, 1);
                }
            }
        });
        
        // Eventos de teclado
        document.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'ArrowLeft':
                    this.prevProduct();
                    this.stopAutoRotation();
                    break;
                case 'ArrowRight':
                    this.nextProduct();
                    this.stopAutoRotation();
                    break;
                case ' ':
                    e.preventDefault();
                    this.toggleAutoRotation();
                    break;
            }
        });
        
        // Suporte para gestos touch
        let touchStartX = 0;
        let touchEndX = 0;
        
        this.carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        this.carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX);
        }, { passive: true });
    }
    
    handleSwipe(startX, endX) {
        const swipeThreshold = 50;
        const diff = startX - endX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                this.nextProduct();
            } else {
                this.prevProduct();
            }
            this.stopAutoRotation();
        }
    }
    
    nextProduct() {
        this.currentIndex = (this.currentIndex + 1) % this.products.length;
        this.rotationAngle -= 360 / this.products.length;
        this.updateCarousel();
        this.createTransitionEffect('next');
    }
    
    prevProduct() {
        this.currentIndex = (this.currentIndex - 1 + this.products.length) % this.products.length;
        this.rotationAngle += 360 / this.products.length;
        this.updateCarousel();
        this.createTransitionEffect('prev');
    }
    
    goToProduct(index) {
        const diff = index - this.currentIndex;
        this.currentIndex = index;
        this.rotationAngle -= diff * (360 / this.products.length);
        this.updateCarousel();
        
        // Efeito visual
        if (window.particleEffects) {
            const productElement = document.querySelector(`.product-3d[data-index="${index}"]`);
            if (productElement) {
                const rect = productElement.getBoundingClientRect();
                const x = rect.left + rect.width / 2;
                const y = rect.top + rect.height / 2;
                
                window.particleEffects.createExplosion(x, y, this.products[index].colorGlow);
            }
        }
    }
    
    updateCarousel() {
        const productElements = document.querySelectorAll('.product-3d');
        const angleStep = 360 / this.products.length;
        
        productElements.forEach((element, index) => {
            const angle = (index * angleStep + this.rotationAngle) % 360;
            const radius = 250;
            const x = Math.sin((angle * Math.PI) / 180) * radius;
            const z = Math.cos((angle * Math.PI) / 180) * radius;
            const scale = index === this.currentIndex ? 1.2 : 0.7;
            const opacity = index === this.currentIndex ? 1 : 0.5;
            
            element.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            element.style.transform = `
                translate(-50%, -50%)
                translateX(${x}px)
                translateZ(${z}px)
                scale(${scale})
            `;
            element.style.opacity = opacity;
            
            element.classList.toggle('active', index === this.currentIndex);
        });
        
        // Atualizar indicadores
        document.querySelectorAll('.indicator').forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentIndex);
        });
        
        // Atualizar painel do produto ativo
        this.updateActiveProductPanel();
        
        // Atualizar botão de rotação automática
        if (this.autoRotateBtn) {
            this.autoRotateBtn.classList.toggle('active', this.isAutoRotating);
            this.autoRotateBtn.innerHTML = `
                <i class="fas fa-${this.isAutoRotating ? 'pause' : 'sync-alt'}"></i>
                <span>${this.isAutoRotating ? 'PAUSAR' : 'ROTACIONAR'}</span>
            `;
        }
    }
    
    createTransitionEffect(direction) {
        // Efeito de partículas
        if (window.particleEffects) {
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            const color = this.products[this.currentIndex].colorGlow;
            
            window.particleEffects.createExplosion(centerX, centerY, color, 20);
        }
        
        // Efeito de brilho
        const glow = document.createElement('div');
        glow.style.position = 'fixed';
        glow.style.top = '50%';
        glow.style.left = '50%';
        glow.style.transform = 'translate(-50%, -50%)';
        glow.style.width = '0';
        glow.style.height = '0';
        glow.style.borderRadius = '50%';
        glow.style.background = `radial-gradient(circle, ${this.products[this.currentIndex].colorGlow}40, transparent 70%)`;
        glow.style.filter = 'blur(40px)';
        glow.style.pointerEvents = 'none';
        glow.style.zIndex = '999';
        
        document.body.appendChild(glow);
        
        // Animação
        let size = 0;
        const maxSize = 400;
        const growSpeed = 20;
        
        const animate = () => {
            size += growSpeed;
            glow.style.width = `${size}px`;
            glow.style.height = `${size}px`;
            glow.style.opacity = `${1 - size / maxSize}`;
            
            if (size < maxSize) {
                requestAnimationFrame(animate);
            } else {
                if (glow.parentNode) {
                    glow.parentNode.removeChild(glow);
                }
            }
        };
        
        animate();
    }
    
    startAutoRotation() {
        if (this.autoRotateInterval) {
            clearInterval(this.autoRotateInterval);
        }
        
        this.autoRotateInterval = setInterval(() => {
            this.nextProduct();
        }, this.rotationSpeed);
        
        this.isAutoRotating = true;
        if (this.autoRotateBtn) {
            this.autoRotateBtn.classList.add('active');
            this.autoRotateBtn.innerHTML = `
                <i class="fas fa-pause"></i>
                <span>PAUSAR</span>
            `;
        }
    }
    
    stopAutoRotation() {
        if (this.autoRotateInterval) {
            clearInterval(this.autoRotateInterval);
            this.autoRotateInterval = null;
        }
        
        this.isAutoRotating = false;
        if (this.autoRotateBtn) {
            this.autoRotateBtn.classList.remove('active');
            this.autoRotateBtn.innerHTML = `
                <i class="fas fa-sync-alt"></i>
                <span>ROTACIONAR</span>
            `;
        }
    }
    
    toggleAutoRotation() {
        if (this.isAutoRotating) {
            this.stopAutoRotation();
        } else {
            this.startAutoRotation();
        }
    }
    
    addToCart(product, quantity) {
        // Disparar evento para o sistema de carrinho
        const cartEvent = new CustomEvent('addToCart', {
            detail: {
                product: {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    originalPrice: product.originalPrice,
                    image: product.image,
                    colorGlow: product.colorGlow
                },
                quantity: quantity
            }
        });
        
        document.dispatchEvent(cartEvent);
        
        // Feedback visual
        this.createAddToCartEffect(product);
        
        // Efeito de confete
        if (window.createConfetti) {
            window.createConfetti(30, product.colorGlow);
        }
    }
    
    createAddToCartEffect(product) {
        // Criar elemento de feedback
        const feedback = document.createElement('div');
        feedback.className = 'cart-feedback';
        feedback.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${product.name} adicionado!</span>
        `;
        
        feedback.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, rgba(26, 26, 26, 0.9), rgba(40, 40, 40, 0.8));
            backdrop-filter: blur(10px);
            border: 1px solid ${product.colorGlow}40;
            border-radius: 12px;
            padding: 15px 25px;
            color: #ffffff;
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 10000;
            transform: translateX(120%);
            transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
            box-shadow: 0 5px 20px ${product.colorGlow}40;
        `;
        
        document.body.appendChild(feedback);
        
        // Mostrar feedback
        setTimeout(() => {
            feedback.style.transform = 'translateX(0)';
        }, 10);
        
        // Ocultar e remover após 3 segundos
        setTimeout(() => {
            feedback.style.transform = 'translateX(120%)';
            
            setTimeout(() => {
                if (feedback.parentNode) {
                    feedback.parentNode.removeChild(feedback);
                }
            }, 500);
        }, 3000);
    }
}

// Inicializar carrossel quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    // Verificar se o elemento do carrossel existe
    if (document.getElementById('carousel3D')) {
        const carousel3D = new Carousel3D();
        window.carousel3D = carousel3D;
        console.log('✅ Carrossel 3D inicializado com sucesso!');
    } else {
        console.warn('⚠️ Elemento do carrossel não encontrado. Carrossel não será inicializado.');
    }
});