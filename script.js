/* ===========================
   BOUTIQUE — script.js
   All shared JS functionality
   =========================== */

/* ---------- CART STORE ---------- */
const CartStore = {
  KEY: 'boutique_cart',

  getAll() {
    try { return JSON.parse(localStorage.getItem(this.KEY)) || []; }
    catch { return []; }
  },

  save(items) {
    localStorage.setItem(this.KEY, JSON.stringify(items));
    this.updateBadges();
  },

  add(product) {
    const items = this.getAll();
    const existing = items.find(i => i.id === product.id);
    if (existing) {
      existing.qty += 1;
    } else {
      items.push({ ...product, qty: 1 });
    }
    this.save(items);
    showToast(`✨ "${product.name}" added to cart`);
  },

  remove(id) {
    const items = this.getAll().filter(i => i.id !== id);
    this.save(items);
  },

  updateQty(id, qty) {
    const items = this.getAll();
    const item = items.find(i => i.id === id);
    if (item) {
      if (qty < 1) { this.remove(id); return; }
      item.qty = qty;
      this.save(items);
    }
  },

  clear() {
    localStorage.removeItem(this.KEY);
    this.updateBadges();
  },

  totalItems() {
    return this.getAll().reduce((sum, i) => sum + i.qty, 0);
  },

  totalPrice() {
    return this.getAll().reduce((sum, i) => sum + (i.price * i.qty), 0);
  },

  updateBadges() {
    const count = this.totalItems();
    document.querySelectorAll('.cart-badge').forEach(badge => {
      badge.textContent = count;
      if (count === 0) {
        badge.classList.add('hidden');
      } else {
        badge.classList.remove('hidden');
        badge.classList.add('bump');
        setTimeout(() => badge.classList.remove('bump'), 400);
      }
    });
  }
};

/* ---------- NAVBAR ---------- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  // Scroll shadow
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) navbar?.classList.add('scrolled');
    else navbar?.classList.remove('scrolled');
  }, { passive: true });

  // Hamburger toggle
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });
  }

  // Close menu on link click
  mobileMenu?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger?.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Highlight active nav
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  CartStore.updateBadges();
}

/* ---------- SCROLL ANIMATIONS ---------- */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.fade-in');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  elements.forEach(el => observer.observe(el));
}

/* ---------- BACK TO TOP ---------- */
function initBackToTop() {
  const btn = document.getElementById('backTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) btn.classList.add('show');
    else btn.classList.remove('show');
  }, { passive: true });

  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ---------- TOAST ---------- */
function showToast(message, duration = 3000) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => toast.classList.remove('show'), duration);
}

/* ---------- PRODUCTS DATA ---------- */
const PRODUCTS = [
  { id: 1, name: 'Floral Anarkali Kurti', category: 'kurtis', price: 1499, originalPrice: 2000, desc: 'Elegantly flared kurti with intricate floral print in soft cotton fabric', badge: 'New', gradient: 'p1' },
  { id: 2, name: 'Silk Banarasi Blouse', category: 'blouses', price: 899, originalPrice: 1200, desc: 'Classic silk blouse with zari border and traditional Banarasi weave', badge: 'Best Seller', gradient: 'p2' },
  { id: 3, name: 'Chanderi Summer Dress', category: 'dresses', price: 2199, originalPrice: 2800, desc: 'Lightweight chanderi fabric dress perfect for festive occasions', badge: null, gradient: 'p3' },
  { id: 4, name: 'Cotton Block Print Kurti', category: 'kurtis', price: 1199, originalPrice: 1600, desc: 'Hand block-printed cotton kurti with straight-cut silhouette', badge: 'New', gradient: 'p4' },
  { id: 5, name: 'Embroidered Mirror Blouse', category: 'blouses', price: 1299, originalPrice: 1800, desc: 'Handcrafted blouse with mirror work and colorful embroidery', badge: null, gradient: 'p5' },
  { id: 6, name: 'Georgette Wrap Dress', category: 'dresses', price: 2499, originalPrice: 3200, desc: 'Flowing georgette wrap dress with delicate floral motifs', badge: 'Best Seller', gradient: 'p6' },
  { id: 7, name: 'Custom Fit Salwar Set', category: 'custom', price: 3500, originalPrice: 4500, desc: 'Fully customized salwar suit stitched to your exact measurements', badge: 'Custom', gradient: 'p7' },
  { id: 8, name: 'Chikankari Kurti', category: 'kurtis', price: 1799, originalPrice: 2400, desc: 'Authentic Lucknowi chikankari embroidery on soft white cotton', badge: null, gradient: 'p8' },
  { id: 9, name: 'Brocade Bridal Blouse', category: 'blouses', price: 1899, originalPrice: 2500, desc: 'Luxurious brocade blouse ideal for weddings and special occasions', badge: 'Premium', gradient: 'p1' },
  { id: 10, name: 'Linen Tunic Dress', category: 'dresses', price: 1599, originalPrice: 2100, desc: 'Casual yet elegant linen tunic with minimal design and relaxed fit', badge: 'New', gradient: 'p2' },
  { id: 11, name: 'Jaipuri Print Kurti', category: 'kurtis', price: 999, originalPrice: 1400, desc: 'Vibrant Rajasthani print kurti in breathable pure cotton', badge: null, gradient: 'p3' },
  { id: 12, name: 'Custom Lehenga Blouse', category: 'custom', price: 4500, originalPrice: 6000, desc: 'Handcrafted lehenga blouse made to your design with premium fabrics', badge: 'Custom', gradient: 'p4' },
];

/* ---------- PRODUCT CARD HTML ---------- */
function createProductCard(product, showActions = true) {
  return `
    <div class="product-card fade-in" data-category="${product.category}" data-id="${product.id}">
      <div class="product-img-wrap">
        <div class="product-img-placeholder prod-placeholder ${product.gradient}">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.57a2 2 0 00-1.34-2.23z"/>
          </svg>
        </div>
        ${product.badge ? `<span class="product-badge ${product.badge === 'New' ? 'new' : ''}">${product.badge}</span>` : ''}
        ${showActions ? `
        <div class="product-actions">
          <button class="btn btn-primary btn-sm add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
        </div>` : ''}
      </div>
      <div class="product-info">
        <div class="product-category">${categoryLabel(product.category)}</div>
        <div class="product-name">${product.name}</div>
        <div class="product-desc">${product.desc}</div>
        <div class="product-price">
          ₹${product.price.toLocaleString('en-IN')}
          ${product.originalPrice ? `<span class="original">₹${product.originalPrice.toLocaleString('en-IN')}</span>` : ''}
        </div>
      </div>
      <div class="product-footer">
        <button class="btn btn-outline btn-sm" style="width:100%" onclick="CartStore.add(${JSON.stringify(JSON.stringify(product)).slice(1,-1)})">
          + Add to Cart
        </button>
      </div>
    </div>
  `;
}

function categoryLabel(cat) {
  const map = { kurtis: 'Kurtis', blouses: 'Blouses', dresses: 'Dresses', custom: 'Custom Orders' };
  return map[cat] || cat;
}

/* ---------- HOME PAGE ---------- */
function initHome() {
  const grid = document.getElementById('featuredProducts');
  if (!grid) return;

  const featured = PRODUCTS.slice(0, 8);
  grid.innerHTML = featured.map(p => createProductCard(p)).join('');

  // Add to cart from product cards
  grid.addEventListener('click', e => {
    const btn = e.target.closest('.add-to-cart-btn');
    if (btn) {
      const id = parseInt(btn.dataset.id);
      const product = PRODUCTS.find(p => p.id === id);
      if (product) CartStore.add(product);
    }
    const outlineBtn = e.target.closest('.btn-outline');
    if (outlineBtn && outlineBtn.closest('.product-footer')) {
      // already handled via inline onclick
    }
  });

  // Fix inline onclick for product cards
  grid.querySelectorAll('.product-footer .btn-outline').forEach(btn => {
    const card = btn.closest('.product-card');
    const id = parseInt(card.dataset.id);
    btn.onclick = () => {
      const product = PRODUCTS.find(p => p.id === id);
      if (product) CartStore.add(product);
    };
  });

  initScrollAnimations();
}

/* ---------- COLLECTION PAGE ---------- */
function initCollection() {
  const grid = document.getElementById('collectionGrid');
  const filterBtns = document.querySelectorAll('.filter-btn');
  if (!grid) return;

  let activeFilter = 'all';

  function renderProducts() {
    const filtered = activeFilter === 'all'
      ? PRODUCTS
      : PRODUCTS.filter(p => p.category === activeFilter);

    grid.innerHTML = filtered.map(p => createProductCard(p)).join('');

    // Fix cart buttons
    grid.querySelectorAll('.product-footer .btn-outline').forEach(btn => {
      const card = btn.closest('.product-card');
      const id = parseInt(card.dataset.id);
      btn.onclick = () => {
        const product = PRODUCTS.find(p => p.id === id);
        if (product) CartStore.add(product);
      };
    });

    initScrollAnimations();
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.filter;
      renderProducts();
    });
  });

  renderProducts();
}

/* ---------- CART PAGE ---------- */
function initCart() {
  const cartSection = document.getElementById('cartSection');
  if (!cartSection) return;
  renderCart();
}

function renderCart() {
  const items = CartStore.getAll();
  const cartSection = document.getElementById('cartSection');
  const summarySection = document.getElementById('summarySection');
  if (!cartSection) return;

  if (items.length === 0) {
    cartSection.innerHTML = `
      <div class="cart-empty">
        <div class="empty-icon">🛍️</div>
        <h3>Your cart is empty</h3>
        <p>Discover our beautiful collection of hand-stitched clothing</p>
        <a href="collection.html" class="btn btn-primary">Explore Collection</a>
      </div>
    `;
    if (summarySection) summarySection.innerHTML = '';
    return;
  }

  const cartHTML = `
    <div class="cart-items-section">
      <div class="cart-header">
        <h3>Shopping Cart</h3>
        <span class="cart-count">${items.length} item${items.length !== 1 ? 's' : ''}</span>
      </div>
      ${items.map(item => `
        <div class="cart-item" data-id="${item.id}">
          <div class="cart-item-img">
            <div class="cart-item-img-placeholder prod-placeholder ${item.gradient}" style="border-radius:8px; min-height:110px;"></div>
          </div>
          <div class="cart-item-details">
            <div class="cart-item-category">${categoryLabel(item.category)}</div>
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-desc">${item.desc}</div>
            <div class="qty-control">
              <button class="qty-btn" onclick="CartStore.updateQty(${item.id}, ${item.qty - 1}); renderCart();">−</button>
              <span class="qty-display">${item.qty}</span>
              <button class="qty-btn" onclick="CartStore.updateQty(${item.id}, ${item.qty + 1}); renderCart();">+</button>
            </div>
          </div>
          <div class="cart-item-right">
            <div class="cart-item-price">₹${(item.price * item.qty).toLocaleString('en-IN')}</div>
            <button class="remove-btn" onclick="CartStore.remove(${item.id}); renderCart();">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
              Remove
            </button>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  cartSection.innerHTML = cartHTML;

  if (summarySection) {
    const total = CartStore.totalPrice();
    const shipping = total > 0 ? 'Free' : '—';
    summarySection.innerHTML = `
      <div class="order-summary">
        <h3>Order Summary</h3>
        <div class="summary-row">
          <span>Subtotal (${CartStore.totalItems()} items)</span>
          <span class="value">₹${total.toLocaleString('en-IN')}</span>
        </div>
        <div class="summary-row">
          <span>Delivery</span>
          <span class="value" style="color:#2e7d32">${shipping}</span>
        </div>
        <div class="summary-row">
          <span>Custom Fitting</span>
          <span class="value" style="color:#2e7d32">Complimentary</span>
        </div>
        <div class="summary-row total">
          <span>Total</span>
          <span class="value">₹${total.toLocaleString('en-IN')}</span>
        </div>
        <a href="checkout.html" class="btn btn-primary" style="width:100%;justify-content:center;margin-top:20px;">
          Proceed to Checkout →
        </a>
        <a href="collection.html" class="btn btn-outline btn-sm" style="width:100%;justify-content:center;margin-top:10px;">
          Continue Shopping
        </a>
        <p class="summary-note">💌 We'll contact you on WhatsApp to confirm your order and measurements</p>
      </div>
    `;
  }
}

/* ---------- CHECKOUT PAGE ---------- */
function initCheckout() {
  const form = document.getElementById('checkoutForm');
  const orderItems = document.getElementById('checkoutItems');
  const orderTotal = document.getElementById('checkoutTotal');
  const successMsg = document.getElementById('orderSuccess');
  if (!form) return;

  const items = CartStore.getAll();

  if (orderItems) {
    if (items.length === 0) {
      orderItems.innerHTML = '<p style="color:var(--text-muted);font-size:0.85rem;text-align:center;padding:16px 0">No items in cart</p>';
    } else {
      orderItems.innerHTML = items.map(item => `
        <div class="checkout-item">
          <div class="checkout-item-img">
            <div class="checkout-item-img-placeholder prod-placeholder ${item.gradient}" style="border-radius:6px;min-height:66px;"></div>
          </div>
          <div class="checkout-item-info">
            <div class="checkout-item-name">${item.name}</div>
            <div class="checkout-item-qty">Qty: ${item.qty}</div>
          </div>
          <div class="checkout-item-price">₹${(item.price * item.qty).toLocaleString('en-IN')}</div>
        </div>
      `).join('');
    }
  }

  if (orderTotal) {
    const total = CartStore.totalPrice();
    orderTotal.innerHTML = `
      <div class="summary-row"><span>Subtotal</span><span class="value">₹${total.toLocaleString('en-IN')}</span></div>
      <div class="summary-row"><span>Delivery</span><span class="value" style="color:#2e7d32">Free</span></div>
      <div class="summary-row total"><span>Total</span><span class="value">₹${total.toLocaleString('en-IN')}</span></div>
    `;
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    form.style.display = 'none';
    if (successMsg) {
      successMsg.classList.add('show');
      successMsg.style.display = 'block';
    }
    CartStore.clear();
    CartStore.updateBadges();
  });
}

/* ---------- CONTACT PAGE ---------- */
function initContact() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    showToast('✅ Message sent! We\'ll get back to you soon.');
    form.reset();
  });
}

/* ---------- INIT ---------- */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollAnimations();
  initBackToTop();
  initHome();
  initCollection();
  initCart();
  initCheckout();
  initContact();
});
