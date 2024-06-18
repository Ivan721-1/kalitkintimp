document.getElementById('logout').addEventListener('click', () => {
    localStorage.removeItem('user');
    window.location.href = 'auth.html';
});

document.getElementById('home').addEventListener('click', () => {
    window.location.href = 'index.html';
});

document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        window.location.href = 'auth.html';
        return;
    }

    document.getElementById('profile-info').innerHTML = `
        <h2>${user.username}</h2>
        <p>${user.email}</p>
    `;

    fetch(`/api/bookmarks?user_id=${user.id}`)
        .then(response => response.json())
        .then(data => {
            const bookmarksList = document.getElementById('bookmarks-list');
            bookmarksList.innerHTML = '';
            data.bookmarks.forEach(bookmark => {
                const bookmarkElement = document.createElement('h3');
                bookmarkElement.textContent = bookmark.title;
                bookmarkElement.addEventListener('click', () => {
                    localStorage.setItem('article', JSON.stringify(bookmark));
                    window.location.href = 'article.html';
                });
                bookmarksList.appendChild(bookmarkElement);
            });
        });

    if (user.email === 'kalitkin03@list.ru') {
        fetch('/api/users')
            .then(response => response.json())
            .then(data => {
                const usersList = document.getElementById('users-list');
                usersList.innerHTML = '';
                data.users.forEach(user => {
                    const userElement = document.createElement('p');
                    userElement.textContent = user.username;
                    usersList.appendChild(userElement);
                });
            });
    }
});
