document.getElementById('logout').addEventListener('click', () => {
    localStorage.removeItem('user');
    window.location.href = 'auth.html';
});

document.getElementById('profile').addEventListener('click', () => {
    window.location.href = 'profile.html';
});

document.getElementById('searchBtn').addEventListener('click', () => {
    const searchInput = document.getElementById('search').value.trim();
    fetch(`/api/articles?search=${searchInput}`)
        .then(response => response.json())
        .then(data => {
            const articlesList = document.getElementById('articles-list');
            articlesList.innerHTML = '';
            data.articles.forEach(article => {
                const articleElement = document.createElement('h3');
                articleElement.textContent = article.title;
                articleElement.addEventListener('click', () => {
                    localStorage.setItem('article', JSON.stringify(article));
                    window.location.href = 'article.html';
                });
                articlesList.appendChild(articleElement);
            });
        });
});

document.getElementById('addArticleBtn').addEventListener('click', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.email === 'kalitkin03@list.ru') {
        window.location.href = 'add_article.html';
    } else {
        alert('Только администратор может добавлять статьи');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/articles')
        .then(response => response.json())
        .then(data => {
            const articlesList = document.getElementById('articles-list');
            articlesList.innerHTML = '';
            data.articles.forEach(article => {
                const articleElement = document.createElement('h3');
                articleElement.textContent = article.title;
                articleElement.addEventListener('click', () => {
                    localStorage.setItem('article', JSON.stringify(article));
                    window.location.href = 'article.html';
                });
                articlesList.appendChild(articleElement);
            });
        });
});
