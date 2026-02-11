// Sistema de Carrinho de Compras - VERSÃO COM MÁSCARA INFALÍVEL

class ShoppingCart {
    constructor() {
        this.items = [];
        this.cartToggle = document.getElementById('cartToggle');
        this.cartModal = document.getElementById('cartModal');
        this.cartOverlay = document.getElementById('cartOverlay');
        this.closeCart = document.getElementById('closeCart');
        this.cartItems = document.getElementById('cartItems');
        this.cartSubtotal = document.getElementById('cartSubtotal');
        this.cartDiscount = document.getElementById('cartDiscount');
        this.cartTotal = document.getElementById('cartTotal');
        this.checkoutBtn = document.getElementById('checkoutBtn');
        
        this.discountPercentage = 10;
        this.whatsappNumber = '5589994386200'; // NÚMERO DO VENDEDOR
        
        this.init();
    }
    
    init() {
        this.loadCart();
        this.bindEvents();
        this.updateCartDisplay();
        
        document.addEventListener('addToCart', (e) => {
            this.addItem(e.detail.product, e.detail.quantity);
        });
    }
    
    bindEvents() {
        this.cartToggle.addEventListener('click', () => this.openCart());
        this.closeCart.addEventListener('click', () => this.closeCartModal());
        this.cartOverlay.addEventListener('click', () => this.closeCartModal());
        this.checkoutBtn.addEventListener('click', () => this.checkout());
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.cartModal.classList.contains('open')) {
                this.closeCartModal();
            }
        });
    }
    
    // ---------- CARRINHO ----------
    loadCart() {
        const savedCart = localStorage.getItem('podsPremiumCart');
        if (savedCart) this.items = JSON.parse(savedCart);
    }
    saveCart() {
        localStorage.setItem('podsPremiumCart', JSON.stringify(this.items));
    }
    addItem(product, quantity = 1) {
        const index = this.items.findIndex(i => i.id === product.id);
        if (index > -1) this.items[index].quantity += quantity;
        else this.items.push({ ...product, quantity, addedAt: new Date().toISOString() });
        this.saveCart();
        this.updateCartDisplay();
        this.showAddFeedback(product);
    }
    removeItem(itemId) {
        this.items = this.items.filter(i => i.id !== itemId);
        this.saveCart();
        this.updateCartDisplay();
    }
    updateQuantity(itemId, newQty) {
        const index = this.items.findIndex(i => i.id === itemId);
        if (index > -1) {
            if (newQty <= 0) this.removeItem(itemId);
            else {
                this.items[index].quantity = newQty;
                this.saveCart();
                this.updateCartDisplay();
            }
        }
    }
    calculateSubtotal() {
        return this.items.reduce((t, i) => t + (i.originalPrice * i.quantity), 0);
    }
    calculateDiscount() {
        return this.items.reduce((t, i) => t + ((i.originalPrice - i.price) * i.quantity), 0);
    }
    calculateTotal() {
        return this.items.reduce((t, i) => t + (i.price * i.quantity), 0);
    }
    updateCartDisplay() {
        const totalItems = this.items.reduce((s, i) => s + i.quantity, 0);
        document.querySelector('.cart-count').textContent = totalItems;
        
        if (this.items.length === 0) {
            this.cartItems.innerHTML = '<div class="empty-cart"><i class="fas fa-box-open"></i><p>Seu carrinho está vazio</p><p>Adicione produtos da coleção 3D!</p></div>';
        } else {
            this.cartItems.innerHTML = this.items.map(item => `
                <div class="cart-item" data-id="${item.id}">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <div class="cart-item-price">R$ ${item.price.toFixed(2)}</div>
                    </div>
                    <div class="cart-item-actions">
                        <input type="number" value="${item.quantity}" min="1" max="10" class="cart-item-qty" data-id="${item.id}">
                        <button class="remove-item" data-id="${item.id}"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
            `).join('');
            
            this.cartItems.querySelectorAll('.cart-item-qty').forEach(input => {
                input.addEventListener('change', (e) => {
                    this.updateQuantity(parseInt(e.target.dataset.id), parseInt(e.target.value));
                });
            });
            this.cartItems.querySelectorAll('.remove-item').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    this.removeItem(parseInt(e.target.closest('.remove-item').dataset.id));
                });
            });
        }
        
        this.cartSubtotal.textContent = `R$ ${this.calculateSubtotal().toFixed(2)}`;
        this.cartDiscount.textContent = `- R$ ${this.calculateDiscount().toFixed(2)}`;
        this.cartTotal.textContent = `R$ ${this.calculateTotal().toFixed(2)}`;
    }
    showAddFeedback(product) {
        const cartIcon = this.cartToggle;
        cartIcon.style.transform = 'scale(1.3)';
        setTimeout(() => cartIcon.style.transform = 'scale(1)', 300);
        if (window.particleEffects) {
            const rect = cartIcon.getBoundingClientRect();
            window.particleEffects.createExplosion(rect.left + rect.width/2, rect.top + rect.height/2, product.colorGlow, 10);
        }
    }
    
    // ---------- ABRIR/FECHAR ----------
    openCart() {
        this.cartModal.classList.add('open');
        this.cartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        
        if (this.items.length > 0) {
            const formContainer = document.getElementById('customerFormContainer');
            if (formContainer) formContainer.style.display = 'block';
            
            // ⭐ APLICA A MÁSCARA DE FORMA CONFIÁVEL
            this.aplicarMascaraWhatsApp();
            this.loadCustomerData();
        } else {
            
            if (formContainer) formContainer.style.display = 'none';
        }
    }
    closeCartModal() {
        this.cartModal.classList.remove('open');
        this.cartOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // ---------- MÁSCARA DE WHATSAPP (SIMPLES E FUNCIONAL) ----------
    aplicarMascaraWhatsApp() {
        const phoneInput = document.getElementById('customerWhatsApp');
        if (!phoneInput) {
            console.warn('⚠️ Campo customerWhatsApp ainda não existe no DOM.');
            return;
        }
        
        // Remove todos os listeners antigos clonando o elemento
        const novoInput = phoneInput.cloneNode(true);
        phoneInput.parentNode.replaceChild(novoInput, phoneInput);
        novoInput.id = 'customerWhatsApp';
        
        // Aplica a máscara no evento 'input'
        novoInput.addEventListener('input', function(e) {
            let valor = e.target.value.replace(/\D/g, '');
            if (valor.length === 0) {
                e.target.value = '';
                return;
            }
            
            // (99) 99999-9999 → máximo 11 dígitos
            if (valor.length <= 2) {
                valor = `(${valor}`;
            } else if (valor.length <= 7) {
                valor = `(${valor.substring(0,2)}) ${valor.substring(2)}`;
            } else {
                valor = `(${valor.substring(0,2)}) ${valor.substring(2,7)}-${valor.substring(7,11)}`;
            }
            e.target.value = valor;
        });
        
        // Dispara o evento para formatar caso já tenha valor
        setTimeout(() => novoInput.dispatchEvent(new Event('input')), 30);
        console.log('✅ Máscara do WhatsApp aplicada com sucesso!');
    }
    
    // ---------- CHECKOUT ----------
    checkout() {
        if (this.items.length === 0) {
            this.showMessage('Adicione produtos ao carrinho!', 'error');
            return;
        }
        
        const name = document.getElementById('customerName')?.value.trim();
        const phone = document.getElementById('customerWhatsApp')?.value.trim();
        const address = document.getElementById('deliveryAddress')?.value.trim();
        
        if (!name || name.length < 3) {
            this.showMessage('Digite seu nome completo!', 'error');
            document.getElementById('customerName')?.focus();
            return;
        }
        if (!phone) {
            this.showMessage('Digite seu WhatsApp!', 'error');
            document.getElementById('customerWhatsApp')?.focus();
            return;
        }
        const digits = phone.replace(/\D/g, '');
        if (digits.length < 10 || digits.length > 11) {
            this.showMessage('Número inválido! Use (99) 99999-9999', 'error');
            document.getElementById('customerWhatsApp')?.focus();
            return;
        }
        if (!address || address.length < 5) {
            this.showMessage('Informe o endereço para entrega!', 'error');
            document.getElementById('deliveryAddress')?.focus();
            return;
        }
        
        const message = this.gerarMensagemWhatsApp(name, phone, address);
        window.open(`https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
        this.saveCustomerData(name, phone, address);
        this.showMessage('Redirecionando para WhatsApp...', 'success');
        setTimeout(() => this.closeCartModal(), 2000);
    }
    
    gerarMensagemWhatsApp(nome, telefone, endereco) {
        let msg = `🛒 *PEDIDO - PODS PREMIUM 3D*\n\n`;
        msg += `*DADOS DO CLIENTE*\n`;
        msg += `👤 Nome: ${nome}\n`;
        msg += `📱 WhatsApp: ${telefone}\n`;
        msg += `📍 Endereço: ${endereco}\n\n`;
        msg += `*ITENS DO PEDIDO*\n`;
        this.items.forEach((item, i) => {
            msg += `${i+1}. ${item.name}\n   Qtd: ${item.quantity}x  R$ ${(item.price * item.quantity).toFixed(2)}\n`;
        });
        msg += `\n*RESUMO*\n`;
        msg += `Subtotal: R$ ${this.calculateSubtotal().toFixed(2)}\n`;
        msg += `Desconto (10%): -R$ ${this.calculateDiscount().toFixed(2)}\n`;
        msg += `*TOTAL: R$ ${this.calculateTotal().toFixed(2)}*\n\n`;
        msg += `🚚 Entrega via delivery\n📞 Contato: (89) 99438-6200`;
        return msg;
    }
    
    saveCustomerData(name, phone, address) {
        localStorage.setItem('podsPremiumCustomer', JSON.stringify({ name, phone, address, lastOrder: new Date().toISOString() }));
    }
    
    loadCustomerData() {
        const saved = localStorage.getItem('podsPremiumCustomer');
        if (!saved) return;
        try {
            const data = JSON.parse(saved);
            const nameInput = document.getElementById('customerName');
            const phoneInput = document.getElementById('customerWhatsApp');
            const addressInput = document.getElementById('deliveryAddress');
            if (nameInput && data.name) nameInput.value = data.name;
            if (phoneInput && data.phone) {
                phoneInput.value = data.phone;
                this.aplicarMascaraWhatsApp(); // reaplica máscara
            }
            if (addressInput && data.address) addressInput.value = data.address;
        } catch (e) {}
    }
    
    showMessage(text, type) {
        const msg = document.createElement('div');
        msg.textContent = text;
        msg.style.cssText = `
            position: fixed; top: 20px; left: 50%; transform: translateX(-50%) translateY(-100%);
            background: ${type === 'error' ? '#ff4444' : '#00C851'};
            color: white; padding: 15px 30px; border-radius: 12px; z-index: 10000;
            transition: transform 0.3s; font-weight: bold; box-shadow: 0 5px 20px rgba(0,0,0,0.3);
        `;
        document.body.appendChild(msg);
        setTimeout(() => msg.style.transform = 'translateX(-50%) translateY(0)', 10);
        setTimeout(() => {
            msg.style.transform = 'translateX(-50%) translateY(-100%)';
            setTimeout(() => msg.remove(), 300);
        }, 3000);
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    window.shoppingCart = new ShoppingCart();
});