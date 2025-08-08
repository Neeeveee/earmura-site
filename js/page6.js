document.addEventListener('DOMContentLoaded', () => {
  // Products (L→R, top→bottom)
  const products = [
    { id:1, name:'Blessed Pear',        price:  990,   img:'images/products/pear.png' },
    { id:2, name:'Eternal Peach',       price:  6990,  img:'images/products/peach.png' },
    { id:3, name:'Prayer Censer',       price: 16990,  img:'images/products/incense.png' },
    { id:4, name:'Sacred Grain',        price: 12990,  img:'images/products/grain.png' },
    { id:5, name:'Divine Coin',         price: 10990,  img:'images/products/coins.png' },
    { id:6, name:'Crimson Crystal',     price: 26990,  img:'images/products/crystal-red.png' },
    { id:7, name:'Celestial Amethyst',  price:  6990,  img:'images/products/crystal-blueviolet.png' },
    { id:8, name:'Golden Tear',         price: 18990,  img:'images/products/golden-drop.png' },
  ];

  const cart = []; // {id,name,price,qty}

  // DOM
  const grid = document.getElementById('giveGrid');
  const openCartBtn = document.getElementById('openCart');
  const cartBadge = document.getElementById('cartBadge');

  const addModal = document.getElementById('addModal');
  const addNameEl = document.getElementById('addName');
  const confirmAdd = document.getElementById('confirmAdd');

  const cartModal = document.getElementById('cartModal');
  const cartList = document.getElementById('cartList');
  const cartEmpty = document.getElementById('cartEmpty');
  const cartTotal = document.getElementById('cartTotal');
  const checkoutBtn = document.getElementById('checkoutBtn');
  const checkoutMsg = document.getElementById('checkoutMsg');

  const toast = document.getElementById('toast');

  let toAdd = null;

  // Render product grid
  function renderGrid() {
    grid.innerHTML = products.map(p => `
      <article class="give-card">
        <div class="give-thumb">
          <img src="${p.img}" alt="${p.name}" onerror="this.style.display='none'"/>
        </div>
        <div class="give-info">
          <h3 class="give-name">${p.name}</h3>
          <p class="give-price">￥${p.price.toLocaleString()}</p>
          <button class="give-add" data-id="${p.id}" aria-label="Add to cart">
            <img src="images/cart-icon.png" alt="cart"/>
            Add
          </button>
        </div>
      </article>
    `).join('');
  }

  // Modals
  function openModal(which) { (which === 'add' ? addModal : cartModal).classList.add('show'); }
  function closeModal(which) { (which === 'add' ? addModal : cartModal).classList.remove('show'); }

  // Cart helpers
  function addToCart(prod) {
    const ex = cart.find(i => i.id === prod.id);
    if (ex) ex.qty += 1;
    else cart.push({ id: prod.id, name: prod.name, price: prod.price, qty: 1 });
    updateBadge();
    showToast('Added to cart');
  }
  function removeFromCart(id) {
    const idx = cart.findIndex(i => i.id === id);
    if (idx > -1) cart.splice(idx, 1);
  }
  function updateBadge() {
    const count = cart.reduce((n, i) => n + i.qty, 0);
    if (count > 0) {
      cartBadge.style.display = 'inline-flex';
      cartBadge.textContent = count;
    } else {
      cartBadge.style.display = 'none';
      cartBadge.textContent = '0';
    }
  }
  function renderCart() {
    if (cart.length === 0) {
      cartList.innerHTML = '';
      cartEmpty.style.display = 'block';
      cartTotal.textContent = '0';
      return;
    }
    cartEmpty.style.display = 'none';
    cartList.innerHTML = cart.map(i => `
      <li class="cart-row" data-id="${i.id}">
        <span class="cart-name">${i.name}</span>

        <div class="qty">
          <button class="qty-btn minus" aria-label="Decrease">−</button>
          <span class="qty-num">${i.qty}</span>
          <button class="qty-btn plus" aria-label="Increase">+</button>
          <button class="remove-btn" aria-label="Remove">Remove</button>
        </div>

        <span class="cart-price">￥${(i.price * i.qty).toLocaleString()}</span>
      </li>
    `).join('');
    const total = cart.reduce((n, i) => n + i.price * i.qty, 0);
    cartTotal.textContent = total.toLocaleString();
  }

  // Grid "Add" → confirm modal
  grid.addEventListener('click', (e) => {
    const btn = e.target.closest('.give-add');
    if (!btn) return;
    const id = Number(btn.dataset.id);
    toAdd = products.find(p => p.id === id) || null;
    if (toAdd) {
      addNameEl.textContent = `${toAdd.name} (￥${toAdd.price.toLocaleString()})`;
      openModal('add');
    }
  });

  // Confirm add
  confirmAdd.addEventListener('click', () => {
    if (toAdd) addToCart(toAdd);
    toAdd = null;
    closeModal('add');
  });

  // Top-right cart
  openCartBtn.addEventListener('click', () => {
    checkoutMsg.style.display = 'none';
    renderCart();
    openModal('cart');
  });

  // Close modals by shade/cancel
  document.body.addEventListener('click', (e) => {
    const which = e.target.getAttribute('data-close');
    if (which === 'add') closeModal('add');
    if (which === 'cart') closeModal('cart');
  });

  // ✅ Quantity +/− & Remove (event delegation on the list)
  cartList.addEventListener('click', (e) => {
    const row = e.target.closest('.cart-row');
    if (!row) return;
    const id = Number(row.dataset.id);
    const item = cart.find(i => i.id === id);
    if (!item) return;

    if (e.target.classList.contains('plus')) {
      item.qty += 1;
    } else if (e.target.classList.contains('minus')) {
      item.qty -= 1;
      if (item.qty <= 0) removeFromCart(id);
    } else if (e.target.classList.contains('remove-btn')) {
      removeFromCart(id);
    } else {
      return;
    }
    updateBadge();
    renderCart();
  });

  // ✅ Checkout → show message & clear cart
  checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
      showToast('Cart is empty');
      return;
    }
    checkoutMsg.style.display = 'block';
    // 清空购物车
    cart.length = 0;
    updateBadge();
    renderCart();
  });

  // Toast
  let toastTimer = null;
  function showToast(text) {
    toast.textContent = text;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 1600);
  }

  // Init
  renderGrid();
});
