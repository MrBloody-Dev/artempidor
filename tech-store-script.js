// Корзина товаров
let cart = [];
let cartCount = 0;
let totalPrice = 0;

// Функция для показа модальных окон
function showModal(modalId) {
    document.getElementById(modalId).style.display = "block";
    document.body.style.overflow = "hidden";
}

// Функция для закрытия модальных окон
function closeModal(modalId) {
    document.getElementById(modalId).style.display = "none";
    document.body.style.overflow = "auto";
}

// Показать окно входа
function showLoginModal() {
    showModal('loginModal');
}

// Показать окно регистрации
function showRegisterModal() {
    showModal('registerModal');
}

// Показать корзину
function showCart() {
    updateCartDisplay();
    showModal('cartModal');
}

// Показать окно оплаты
function showPaymentModal() {
    if (cart.length === 0) {
        alert('Корзина пуста! Добавьте товары перед оформлением заказа.');
        return;
    }
    closeModal('cartModal');
    showModal('paymentModal');
    document.getElementById('paymentTotal').textContent = totalPrice.toLocaleString('ru-RU') + ' ₽';
}

// Добавить товар в корзину
function addToCart(productName, price) {
    cart.push({
        name: productName,
        price: price,
        id: Date.now()
    });
    
    cartCount++;
    totalPrice += price;
    
    updateCartCount();
    
    // Анимация добавления
    event.target.textContent = 'Добавлено!';
    event.target.style.background = '#fff';
    event.target.style.color = '#000';
    
    setTimeout(() => {
        event.target.textContent = 'В корзину';
        event.target.style.background = 'transparent';
        event.target.style.color = '#fff';
    }, 1500);
    
    // Уведомление
    showNotification('Товар добавлен в корзину!');
}

// Удалить товар из корзины
function removeFromCart(itemId) {
    const index = cart.findIndex(item => item.id === itemId);
    if (index !== -1) {
        totalPrice -= cart[index].price;
        cart.splice(index, 1);
        cartCount--;
        updateCartCount();
        updateCartDisplay();
    }
}

// Обновить счетчик корзины
function updateCartCount() {
    document.querySelector('.cart-count').textContent = cartCount;
}

// Обновить отображение корзины
function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Корзина пуста</p>';
        totalPrice = 0;
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${item.price.toLocaleString('ru-RU')} ₽</div>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart(${item.id})">Удалить</button>
            </div>
        `).join('');
    }
    
    document.getElementById('totalPrice').textContent = totalPrice.toLocaleString('ru-RU') + ' ₽';
}

// Прокрутка к секции товаров
function scrollToProducts() {
    document.getElementById('products').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

// Показать уведомление
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #fff;
        color: #000;
        padding: 15px 25px;
        border-radius: 0;
        z-index: 3000;
        animation: slideRight 0.5s ease;
        box-shadow: 0 5px 20px rgba(255,255,255,0.3);
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.5s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 3000);
}

// Закрытие модальных окон при клике вне их
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = "none";
        document.body.style.overflow = "auto";
    }
}

// Обработка форм
document.addEventListener('DOMContentLoaded', function() {
    // Обработка формы входа
    const loginForm = document.querySelector('#loginModal .auth-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showNotification('Успешный вход в систему!');
            closeModal('loginModal');
            loginForm.reset();
        });
    }
    
    // Обработка формы регистрации
    const registerForm = document.querySelector('#registerModal .auth-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showNotification('Регистрация прошла успешно!');
            closeModal('registerModal');
            registerForm.reset();
        });
    }
    
    // Обработка формы оплаты
    const paymentForm = document.querySelector('.payment-form');
    if (paymentForm) {
        paymentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Анимация обработки платежа
            const submitBtn = paymentForm.querySelector('.btn-pay');
            submitBtn.textContent = 'Обработка...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                showNotification('Заказ успешно оформлен! Спасибо за покупку!');
                closeModal('paymentModal');
                
                // Очистка корзины
                cart = [];
                cartCount = 0;
                totalPrice = 0;
                updateCartCount();
                
                // Сброс формы
                paymentForm.reset();
                submitBtn.textContent = 'Оплатить';
                submitBtn.disabled = false;
            }, 2000);
        });
    }
    
    // Форматирование номера карты
    const cardInput = document.querySelector('input[placeholder="Номер карты"]');
    if (cardInput) {
        cardInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s/g, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = formattedValue;
        });
    }
    
    // Форматирование даты карты
    const dateInput = document.querySelector('input[placeholder="MM/YY"]');
    if (dateInput) {
        dateInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0,2) + '/' + value.substring(2,4);
            }
            e.target.value = value;
        });
    }
    
    // Только цифры для CVV
    const cvvInput = document.querySelector('input[placeholder="CVV"]');
    if (cvvInput) {
        cvvInput.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    }
});

// Плавная прокрутка для навигационных ссылок
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

// Параллакс эффект для геометрических фигур
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const shapes = document.querySelectorAll('.shape');
    
    shapes.forEach((shape, index) => {
        const speed = 0.5 + (index * 0.2);
        shape.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.1}deg)`;
    });
});

// Анимация при появлении элементов при скролле
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Наблюдение за продуктовыми карточками
document.addEventListener('DOMContentLoaded', () => {
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});

// Эффект печатания для заголовка
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Запуск эффекта печатания при загрузке
window.addEventListener('load', () => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        typeWriter(heroTitle, originalText, 50);
    }
});

// Добавление эффекта для кнопок при наведении
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05)';
    });
    
    button.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
});

// Консольное сообщение
console.log('%c TECHVAULT ', 'background: #000; color: #fff; font-size: 24px; padding: 10px;');
console.log('%c Премиальная техника в монохромном стиле ', 'background: #fff; color: #000; padding: 5px;');