document.addEventListener('DOMContentLoaded', () => {
    // Elementos del DOM
    const menuItemsContainer = document.getElementById('menu-items');
    const categoryBtns = document.querySelectorAll('.category-btn');
    const cartButton = document.getElementById('order-button');
    const cartItemsContainer = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');
    const placeOrderButton = document.getElementById('place-order');
    let cartModal;

    // Datos del menú
    const encebollados = [
        { id: 1, name: 'Encebollado', description: 'Delicioso encebollado de pescado.', price: 3.30, image: 'images/encebollado_normal.jpg', category: 'encebollados' },
        { id: 2, name: 'Encebollado Junior', description: 'Encebollado en tamaño pequeño.', price: 2.20, image: 'images/encebollado_junior.jpg', category: 'encebollados' },
        { id: 3, name: 'Encebollado Jumbo', description: 'Encebollado en tamaño grande.', price: 4.30, image: 'images/encebollado_jumbo.jpg', category: 'encebollados' },
        { id: 4, name: 'Encebollado Mixto', description: 'Encebollado con pescado y camarón.', price: 5.30, image: 'images/encebollado_mixto.jpg', category: 'encebollados' },
    ];

    const platosPrincipales = [
        { id: 5, name: 'Guatita', description: 'Deliciosa guatita con arroz.', price: 6.50, image: 'images/guatita.jpeg', category: 'platos-principales' },
        { id: 6, name: 'Arroz con Camarón', description: 'Arroz con camarones frescos.', price: 7.30, image: 'images/arroz_con_camaron.jpeg', category: 'platos-principales' },
        { id: 7, name: 'Bollo', description: 'Tradicional bollo de pescado.', price: 2.70, image: 'images/bollo.jpg', category: 'platos-principales' },
        { id: 8, name: 'Bollo Mixto', description: 'El mejor bollo con pescado y camaron', price: 3.50, image: 'images/bollo_mixto.png', category: 'platos-principales' },
        { id: 9, name: 'Cazuela', description: 'Tradicional cazuela de pescado.', price: 4.50, image: 'images/cazuela.jpg', category: 'platos-principales' },
        { id: 10, name: 'Bandera', description: 'Tradicional Bandera ecuatoriana.', price: 5.50, image: 'images/banderas.jpg', category: 'platos-principales' },
        { id: 11, name: 'Ceviche de Camarón', description: 'El mejor ceviche de camarón de la urbe porteña.', price: 6.50, image: 'images/ceviche.jpg', category: 'platos-principales' }
    ];

    const bebidas = [
        { id: 12, name: 'Coca Cola', description: 'Bebida gaseosa.', price: 1.50, image: 'images/coca_cola.jpeg', category: 'bebidas' },
        { id: 13, name: 'Coca Cola Light', description: 'Bebida gaseosa light.', price: 1.50, image: 'images/coca_cola_light.jpeg', category: 'bebidas' },
        { id: 14, name: 'Jugo de Naranja', description: 'Jugo natural de naranja.', price: 1.99, image: 'images/jucy_naranja.jpeg', category: 'bebidas' },
        { id: 15, name: 'Agua de Coco', description: 'Agua de coco natural.', price: 2.25, image: 'images/jucy_coco.png', category: 'bebidas' },
        { id: 16, name: 'Colas', description: 'Bebidas varias.', price: 1.25, image: 'images/colas.png', category: 'bebidas' }
    ];

    const products = [...encebollados, ...platosPrincipales, ...bebidas];

    // Variables del carrito de compras
    let cart = [];
    let totalPrice = 0;

    // Función para cargar el carrito desde localStorage
    function loadCartFromLocalStorage() {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            cart = JSON.parse(storedCart);
            updateCartButton();
        }
    }

    // Función para renderizar el menú
    function renderMenu() {
        menuItemsContainer.innerHTML = ''; 

        const selectedCategory = document.querySelector('.category-btn.active').dataset.category;

        const filteredItems = selectedCategory === 'all'
            ? products 
            : products.filter(item => item.category === selectedCategory);

        filteredItems.forEach(item => {
            const card = document.createElement('div');
            card.classList.add('col-lg-4', 'col-md-6', 'mb-4'); 
            card.innerHTML = `
                <div class="card h-100">
                    <img src="${item.image}" class="card-img-top" alt="${item.name}">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${item.name}</h5>
                        <p class="card-text flex-grow-1">${item.description}</p>
                        <p class="card-text price mb-2">${item.price.toFixed(2)}</p>
                        <button onclick="addToCart(${item.id})" class="btn btn-primary">Agregar al Carrito</button>
                    </div>
                </div>
            `;
            menuItemsContainer.appendChild(card);
        });
    }

    // Función para agregar un producto al carrito
    window.addToCart = function(productId) {
        const existingProductIndex = cart.findIndex(item => item.id === productId);
        if (existingProductIndex > -1) {
            cart[existingProductIndex].quantity++;
        } else {
            const productToAdd = products.find(p => p.id === productId);
            if (productToAdd) {
                cart.push({ ...productToAdd, quantity: 1 });
            } else {
                alert('Producto no encontrado.');
            }
        }
        saveCartToLocalStorage();
        updateCartButton();
        renderCart();
    }

    // Función para eliminar un producto del carrito
    window.removeFromCart = function(productId) {
        const cartIndex = cart.findIndex(item => item.id === productId);

        if (cartIndex > -1) {
            if (cart[cartIndex].quantity > 1) {
                cart[cartIndex].quantity--;
            } else {
                cart.splice(cartIndex, 1);
            }
            saveCartToLocalStorage();
            updateCartButton();
            renderCart();
        }
    }

    // Función para actualizar el botón del carrito
    function updateCartButton() {
        const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);
        cartButton.textContent = `Carrito (${cartItemCount})`;
    }

    // Función para guardar el carrito en localStorage
    function saveCartToLocalStorage() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Función para renderizar el carrito de compras en el modal
    function renderCart() {
        cartItemsContainer.innerHTML = '';
        totalPrice = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>El carrito está vacío.</p>';
        } else {
            const cartList = document.createElement('ul');
            cartList.classList.add('list-group');
            cart.forEach(item => {
                const listItem = document.createElement('li');
                listItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
                listItem.innerHTML = `
                    <div class="ms-2 me-auto">
                        <div class="fw-bold">${item.name} x ${item.quantity}</div>
                        ${item.price.toFixed(2)}
                    </div>
                    <button onclick="removeFromCart(${item.id})" class="badge bg-danger rounded-pill">X</button>
                `;
                cartList.appendChild(listItem);
                totalPrice += item.price * item.quantity;
            });
            cartItemsContainer.appendChild(cartList);
        }

        totalPriceElement.textContent = `Total: $${totalPrice.toFixed(2)}`;
    }

    // Función para abrir el modal del carrito
    function openModal() {
        renderCart();
        cartModal = new bootstrap.Modal(document.getElementById('cart-modal'));
        cartModal.show();

        // Evento 'shown.bs.modal' para agregar el event listener después de que el modal se haya mostrado
        cartModal._element.addEventListener('shown.bs.modal', function() {
            placeOrderButton.addEventListener('click', () => {
                if (cart.length > 0) {
                    // Lógica para procesar el pedido
                    alert('Pedido realizado con éxito. Total: $' + totalPrice.toFixed(2));
                    cart = [];
                    saveCartToLocalStorage();
                    renderCart();
                    updateCartButton();
                    cartModal.hide();
                } else {
                    alert('El carrito está vacío.');
                }
            });
        });
    }

    // Eventos y lógica del modal
    cartButton.addEventListener('click', () => {
        openModal();
    });

    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderMenu();
        });
    });

    // Renderizar el menú inicial al cargar la página
    renderMenu();

    // Cargar el carrito desde localStorage al cargar la página
    loadCartFromLocalStorage();
});
