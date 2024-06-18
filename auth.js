document.getElementById('login-btn').addEventListener('click', () => {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();

    if (email && password) {
    fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Добро пожаловать')
            localStorage.setItem('user', JSON.stringify(data.user));
            window.location.href = 'index.html';
        } else {
            alert('Неправильные данные для входа');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Произошла ошибка при попытке входа в систему');
});
} else {
    alert('Пожалуйста, заполните все поля');
}
});

document.getElementById('register-btn').addEventListener('click', () => {
    const email = document.getElementById('register-email').value.trim();
    const username = document.getElementById('register-username').value.trim();
    const password = document.getElementById('register-password').value.trim();
    const repeatPassword = document.getElementById('register-password-repeat').value.trim();

    if (password !== repeatPassword) {
        alert('Пароли не совпадают');
        return;
    }

    fetch('/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, username, password }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Регистрация успешна');
            window.location.href = 'auth.html';
        } else {
            alert('Ошибка при регистрации');
        }
    });
});
