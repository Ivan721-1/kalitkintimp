document.getElementById('logout').addEventListener('click', () => {
    localStorage.removeItem('user');
    window.location.href = 'auth.html';
});

document.getElementById('home').addEventListener('click', () => {
    window.location.href = 'index.html';
});



document.getElementById('add-article-btn').addEventListener('click', () => {
    const title = document.getElementById('article-title').value.trim();
    const tags = document.getElementById('article-tags').value.trim();
    const content = document.getElementById('article-content').value.trim();


    fetch('/api/add-article', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, tags, content }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Статья добавлена');
            window.location.href = 'index.html';
        } else {
            alert('Ошибка при добавлении');
        }
    });
});