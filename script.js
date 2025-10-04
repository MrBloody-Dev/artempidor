let isLoggedIn = false;
let currentUser = {
    email: '',
    games: []
};
let currentPurchase = {
    name: '',
    price: 0
};

function showLogin() {
    document.getElementById('loginModal').style.display = 'block';
}

function showRegister() {
    document.getElementById('registerModal').style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function switchToRegister() {
    closeModal('loginModal');
    showRegister();
}

function switchToLogin() {
    closeModal('registerModal');
    showLogin();
}

function handleLogin(event) {
    event.preventDefault();
    const email = event.target[0].value;
    
    isLoggedIn = true;
    currentUser.email = email;
    
    closeModal('loginModal');
    updateNavigation();
    
    alert('Вход выполнен успешно!');
}

function handleRegister(event) {
    event.preventDefault();
    const name = event.target[0].value;
    const email = event.target[1].value;
    const password = event.target[2].value;
    const confirmPassword = event.target[3].value;
    
    if (password !== confirmPassword) {
        alert('Пароли не совпадают!');
        return;
    }
    
    isLoggedIn = true;
    currentUser.email = email;
    
    closeModal('registerModal');
    updateNavigation();
    
    alert('Регистрация выполнена успешно!');
}

function updateNavigation() {
    const navButtons = document.querySelector('.nav-buttons');
    
    if (isLoggedIn) {
        navButtons.innerHTML = `
            <button class="btn-login" onclick="showDashboard()">Личный кабинет</button>
            <button class="btn-logout" onclick="handleLogout()">Выйти</button>
        `;
    } else {
        navButtons.innerHTML = `
            <button class="btn-login" onclick="showLogin()">Войти</button>
            <button class="btn-register" onclick="showRegister()">Регистрация</button>
        `;
    }
}

function handleLogout() {
    isLoggedIn = false;
    currentUser = {
        email: '',
        games: []
    };
    
    closeModal('dashboardModal');
    updateNavigation();
    
    alert('Вы вышли из аккаунта');
}

function buyGame(gameName, price) {
    if (!isLoggedIn) {
        alert('Войдите в аккаунт для покупки игр');
        showLogin();
        return;
    }
    
    currentPurchase.name = gameName;
    currentPurchase.price = price;
    
    document.getElementById('paymentGame').textContent = gameName;
    document.getElementById('paymentPrice').textContent = price;
    document.getElementById('paymentModal').style.display = 'block';
}

function handlePayment(event) {
    event.preventDefault();
    
    const gameKey = generateGameKey();
    
    currentUser.games.push({
        name: currentPurchase.name,
        price: currentPurchase.price,
        key: gameKey,
        date: new Date().toLocaleDateString()
    });
    
    closeModal('paymentModal');
    
    alert(`Покупка успешна!\nИгра: ${currentPurchase.name}\nКлюч: ${gameKey}`);
}

function generateGameKey() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let key = '';
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            key += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        if (i < 3) key += '-';
    }
    return key;
}

function showDashboard() {
    if (!isLoggedIn) {
        showLogin();
        return;
    }
    
    document.getElementById('userEmail').textContent = currentUser.email;
    document.getElementById('gamesCount').textContent = currentUser.games.length;
    
    const gamesList = document.getElementById('gamesList');
    
    if (currentUser.games.length === 0) {
        gamesList.innerHTML = '<p class="empty-state">У вас пока нет игр</p>';
    } else {
        gamesList.innerHTML = currentUser.games.map(game => `
            <div class="game-item">
                <div class="game-item-info">
                    <h4>${game.name}</h4>
                    <p>Куплено: ${game.date} • ${game.price} ₽</p>
                </div>
                <div class="game-key">${game.key}</div>
            </div>
        `).join('');
    }
    
    document.getElementById('dashboardModal').style.display = 'block';
}

function scrollToGames() {
    document.getElementById('games').scrollIntoView({ behavior: 'smooth' });
}

window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
}