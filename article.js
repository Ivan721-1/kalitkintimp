document.getElementById('logout').addEventListener('click', () => {
    localStorage.removeItem('user');
    window.location.href = 'auth.html';
});

document.getElementById('home').addEventListener('click', () => {
    window.location.href = 'index.html';
});

document.getElementById('profile').addEventListener('click', () => {
    window.location.href = 'profile.html';
});

document.addEventListener('DOMContentLoaded', () => {
    const article = JSON.parse(localStorage.getItem('article'));
    if (article) {
        document.getElementById('article-title').textContent = article.title;
        document.getElementById('article-tags').textContent = `Теги: ${article.tags}`;
        document.getElementById('article-text').textContent = article.content;
    } else {
        window.location.href = 'index.html';
    }
});

document.getElementById('bookmark-btn').addEventListener('click', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        window.location.href = 'auth.html';
        return;
    }

    fetch('/api/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, article_id: article.id })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Добавлено в закладки');
        } else {
            alert('Ошибка добавления в закладки');
        }
    });
});

document.getElementById('download-btn').addEventListener('click', () => {
    fetch(`/api/articles/${article.id}/download`)
        .then(response => response.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${article.title}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
        });
});
