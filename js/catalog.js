// Catálogo de Produtos
class ProductCatalog {
    constructor() {
        this.catalogGrid = document.getElementById('catalogGrid');
        this.selectedProductPanel = document.getElementById('selectedProductPanel');
        this.smokeEffects = {};
        
        // Usar os mesmos produtos do carrossel
        this.products = window.carousel3D ? window.carousel3D.products : [];
        
        this.init();
    }
    
    init() {
        this.renderCatalog();
        this.bindEvents();
        this.createSmokeEffects();
    }
    
    renderCatalog() {
        if (!this.catalogGrid) return;
        
        this.catalogGrid.innerHTML = '';
        
        this.products.forEach(product => {
            const productElement = document.createElement('div');
            productElement.className = `catalog-product`;
            productElement.dataset.productId = product.id;
            productElement.style.color = product.colorGlow;
            
            productElement.innerHTML = `
                <div class="product-image-wrapper">
                    <img src="${product.image}" alt="${product.name}" class="catalog-product-image">
                </div>
                
                <div class="product-info-content">
                    <div class="product-header">
                        <h3 class="product-name">${product.name}</h3>
                        <span class="product-tag ${product.badge}">${product.badge.toUpperCase()}</span>
                    </div>
                    
                    <div class="product-specs">
                        ${product.specs.map(spec => `<span class="spec-item">${spec}</span>`).join('')}
                    </div>
                    
                    <div class="product-pricing">
                        <div class="original-price">
                            <span>De: </span>
                            <span class="strike">R$ ${product.originalPrice.toFixed(2)}</span>
                        </div>
                        <div class="promo-price">
                            <span class="current-price">R$ ${product.price.toFixed(2)}</span>
                            <span class="economy-badge">Economize R$ ${product.economy.toFixed(2)}</span>
                        </div>
                    </div>
                    
                    <button class="catalog-add-to-cart" data-product-id="${product.id}">
                        <i class="fas fa-cart-plus"></i>
                        ADICIONAR
                    </button>
                </div>
            `;
            
            this.catalogGrid.appendChild(productElement);
        });
    }
    
    createSmokeEffects() {
        this.products.forEach(product => {
            const productElement = document.querySelector(`.catalog-product[data-product-id="${product.id}"] .product-image-wrapper`);
            if (productElement) {
                const smokeEffect = new ProductSmokeEffect(
                    productElement,
                    product.colorGlow,
                    25
                );
                
                this.smokeEffects[product.id] = smokeEffect;
                smokeEffect.setIntensity(0.4);
            }
        });
    }
    
    bindEvents() {
        if (!this.catalogGrid) return;
        
        this.catalogGrid.addEventListener('click', (e) => {
            const productElement = e.target.closest('.catalog-product');
            const addToCartBtn = e.target.closest('.catalog-add-to-cart');
            
            if (productElement) {
                const productId = parseInt(productElement.dataset.productId);
                this.selectProduct(productId, productElement);
            }
            
            if (addToCartBtn) {
                const productId = parseInt(addToCartBtn.dataset.productId);
                this.addToCart(productId, 1);
            }
        });
        
        this.catalogGrid.addEventListener('mouseenter', (e) => {
            const productElement = e.target.closest('.catalog-product');
            if (productElement) {
                const productId = parseInt(productElement.dataset.productId);
                if (this.smokeEffects[productId]) {
                    this.smokeEffects[productId].setIntensity(0.7);
                }
            }
        }, true);
        
        this.catalogGrid.addEventListener('mouseleave', (e) => {
            const productElement = e.target.closest('.catalog-product');
            if (productElement) {
                const productId = parseInt(productElement.dataset.productId);
                if (this.smokeEffects[productId]) {
                    this.smokeEffects[productId].setIntensity(0.4);
                }
            }
        }, true);
    }
    
    selectProduct(productId, element) {
        // Remover seleção anterior
        document.querySelectorAll('.catalog-product.selected').forEach(el => {
            el.classList.remove('selected');
        });
        
        // Selecionar novo produto
        element.classList.add('selected');
        
        // Aumentar fumaça do produto selecionado
        if (this.smokeEffects[productId]) {
            this.smokeEffects[productId].setIntensity(0.9);
        }
        
        // Efeito visual
        this.createSelectionEffect(element);
        
        // Atualizar painel
        this.updateSelectedProductPanel(productId);
        
        // Scroll para o painel
        setTimeout(() => {
            if (this.selectedProductPanel) {
                this.selectedProductPanel.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }, 300);
    }
    
    createSelectionEffect(element) {
        // Efeito de partículas
        if (window.particleEffects) {
            const rect = element.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const productId = parseInt(element.dataset.productId);
            const product = this.products.find(p => p.id === productId);
            
            if (product) {
                window.particleEffects.createExplosion(
                    centerX,
                    centerY,
                    product.colorGlow,
                    15
                );
            }
        }
    }
    
    updateSelectedProductPanel(productId) {
        if (!this.selectedProductPanel) return;
        
        const product = this.products.find(p => p.id === productId);
        if (!product) return;
        
        this.selectedProductPanel.innerHTML = `
            <div class="panel-header">
                <h2 class="panel-title" style="color: ${product.colorGlow}">${product.name}</h2>
                <div class="panel-rating">
                    <div class="rating-stars">
                        ${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}
                    </div>
                    <span class="rating-value">${product.rating}</span>
                </div>
            </div>
            
            <div class="panel-content">
                <div class="panel-image-container">
                    <img src="${product.image}" alt="${product.name}" class="panel-image" style="color: ${product.colorGlow}">
                </div>
                
                <div class="panel-details">
                    <p class="panel-description">${product.description}</p>
                    
                    <div class="panel-price">
                        <div class="price-original">De: R$ ${product.originalPrice.toFixed(2)}</div>
                        <div class="price-current">Por: R$ ${product.price.toFixed(2)}</div>
                        <div class="price-economy">
                            <i class="fas fa-tag"></i>
                            Economize R$ ${product.economy.toFixed(2)} (10% OFF)
                        </div>
                    </div>
                    
                    <button class="panel-add-to-cart" data-product-id="${product.id}">
                        <i class="fas fa-cart-plus"></i>
                        ADICIONAR AO CARRINHO
                    </button>
                </div>
            </div>
        `;
        
        // Adicionar evento ao botão do painel
        const addToCartBtn = this.selectedProductPanel.querySelector('.panel-add-to-cart');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', () => {
                this.addToCart(productId, 1);
            });
        }
    }
    
    addToCart(productId, quantity) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;
        
        // Disparar evento para o carrinho
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
    }
    
    createAddToCartEffect(product) {
        // Reutilizar a função do carrossel
        if (window.carousel3D && window.carousel3D.createAddToCartEffect) {
            window.carousel3D.createAddToCartEffect(product);
        } else {
            // Fallback se o carrossel não estiver disponível
            const feedback = document.createElement('div');
            feedback.className = 'cart-feedback';
            feedback.innerHTML = `
                <i class="fas fa-check-circle"></i>
                <span>${product.name} adicionado ao carrinho!</span>
            `;
            feedback.style.position = 'fixed';
            feedback.style.top = '20px';
            feedback.style.right = '20px';
            feedback.style.background = 'linear-gradient(135deg, rgba(26, 26, 26, 0.95), rgba(40, 40, 40, 0.9))';
            feedback.style.backdropFilter = 'blur(20px)';
            feedback.style.border = `1px solid ${product.colorGlow}40`;
            feedback.style.borderRadius = '15px';
            feedback.style.padding = '20px 30px';
            feedback.style.color = '#ffffff';
            feedback.style.display = 'flex';
            feedback.style.alignItems = 'center';
            feedback.style.gap = '15px';
            feedback.style.zIndex = '10000';
            feedback.style.transform = 'translateX(120%)';
            feedback.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
            feedback.style.boxShadow = `0 10px 30px ${product.colorGlow}40`;
            
            document.body.appendChild(feedback);
            
            // Mostrar feedback
            setTimeout(() => {
                feedback.style.transform = 'translateX(0)';
            }, 10);
            
            // Ocultar após 3 segundos
            setTimeout(() => {
                feedback.style.transform = 'translateX(120%)';
                setTimeout(() => feedback.remove(), 500);
            }, 3000);
        }
    }
}