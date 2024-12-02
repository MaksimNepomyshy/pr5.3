const loginButton = document.querySelector('.button-login');
const authModal = document.querySelector('.modal-auth');
const closeAuth = document.querySelector('.close-auth');
const loginInput = document.getElementById('login');
const loginError = document.getElementById('loginError');
const userName = document.querySelector('.user-name');
const buttonAuth = document.querySelector('.button-auth');
const buttonOut = document.querySelector('.button-out');
const loginForm = document.getElementById('logInForm');
const passwordInput = document.getElementById('password');
const passwordError = document.getElementById('passwordError');
const cartButton = document.getElementById('cart-button');

let authModalIsOpen = false;

// Функція для відображення модального вікна авторизації
function showAuthModal() {
    authModal.style.display = 'block';
    authModalIsOpen = true;
    document.body.style.overflow = 'hidden'; // Приховуємо прокрутку
}

// Функція для закриття модального вікна авторизації
function closeAuthModal() {
    authModal.style.display = 'none';
    loginInput.style.borderColor = '';
    passwordInput.style.borderColor = '';
    loginError.style.display = 'none';
    passwordError.style.display = 'none';
    loginInput.value = '';
    passwordInput.value = '';
    authModalIsOpen = false;
    document.body.style.overflow = ''; // Повертаємо прокрутку
}

// Функція для авторизації користувача
function authorize(login) {
    closeAuthModal();
    localStorage.setItem('userName', login);
    userName.textContent = login;
    userName.style.display = 'inline';
    buttonAuth.style.display = 'none';
    buttonOut.style.display = 'inline';
    cartButton.style.display = 'inline'; // Відображаємо кошик після авторизації
}

// Функція для виходу з облікового запису
function logout() {
    localStorage.removeItem('userName');
    userName.textContent = '';
    userName.style.display = 'none';
    buttonAuth.style.display = 'inline';
    buttonOut.style.display = 'none';
    cartButton.style.display = 'none'; // Приховуємо кошик після виходу
}

// Функція для перевірки авторизації при завантаженні сторінки
function checkAuth() {
    const storedUserName = localStorage.getItem('userName');
    if (storedUserName) {
        authorize(storedUserName);
    } else {
        cartButton.style.display = 'none'; // Приховуємо кошик, якщо користувач не авторизований
    }

}



// Обробник події кліку на кнопку "Війти"
loginButton.addEventListener('click', (event) => {
    event.preventDefault();

    const login = loginInput.value.trim();
    const password = passwordInput.value.trim();

    if (!login) {
        loginInput.style.borderColor = 'red';
        loginError.style.display = 'block';
    }

    if (!password) {
        passwordInput.style.borderColor = 'red';
        passwordError.style.display = 'block';
    }

    if (!login || !password) {
        return;
    }

    authorize(login);
});


// Обробники подій для кнопок "Війти", "Вийти" та закриття модального вікна
buttonAuth.addEventListener('click', showAuthModal);
buttonOut.addEventListener('click', logout);
closeAuth.addEventListener('click', closeAuthModal);

// Обробник кліків на window для закриття модального вікна
window.addEventListener('click', (event) => {
    if (authModalIsOpen && event.target === authModal) {
        closeAuthModal();
    }
});


// Функція для додавання карток ресторанів на сторінку
function renderRestaurants(restaurants) {
    const restaurantsContainer = document.querySelector('.cards-restaurants');
    restaurantsContainer.innerHTML = ''; // Очищаємо контейнер перед додаванням нових карток

    restaurants.forEach(restaurant => {
        const card = document.createElement('a');
        card.href = 'restaurant.html';
        card.classList.add('card', 'card-restaurant');

        card.innerHTML = `
            <img src="${restaurant.image}" alt="image" class="card-image" />
            <div class="card-text">
                <div class="card-heading">
                    <h3 class="card-title">${restaurant.name}</h3>
                    <span class="card-tag tag">${restaurant.time}</span>
                </div>
                <div class="card-info">
                    <div class="rating">${restaurant.rating}</div>
                    <div class="price">від ${restaurant.price} ₴</div>
                    <div class="category">${restaurant.category}</div>
                </div>
            </div>
        `;
        restaurantsContainer.appendChild(card);
    });

    // Додаємо обробник подій після створення карток
    addRestaurantCardClickHandlers();
}


function addRestaurantCardClickHandlers() {
    const restaurantCards = document.querySelectorAll('.card-restaurant');
    restaurantCards.forEach(card => {
        card.addEventListener('click', (event) => {
            const storedUserName = localStorage.getItem('userName');
            if (!storedUserName) {
                event.preventDefault();
                showAuthModal();
            }
        });
    });
}


// Викликаємо renderRestaurants після завантаження DOM та даних з db.js
document.addEventListener('DOMContentLoaded', () => {
    renderRestaurants(restaurants);
    checkAuth(); // Перевіряємо авторизацію при завантаженні сторінки
});