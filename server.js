const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

const db = new sqlite3.Database('./db/database.db');



// Регистрация пользователя
app.post('/api/register', (req, res) => {
    const { email, username, password } = req.body;
    db.run(`INSERT INTO users (email, username, password) VALUES (?, ?, ?)`, [email, username, password], function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
        } else {
            res.json({ success: true });
        }
    });
});

// Вход пользователя
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    db.get(`SELECT * FROM users WHERE email = ? AND password = ?`, [email, password], (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
        } else if (row) {
            res.json({ success: true, user: row });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    });
});

// Получение статей
app.get('/api/articles', (req, res) => {
    const search = req.query.search ? `%${req.query.search}%` : '%%';
    db.all(`SELECT * FROM articles WHERE title LIKE ? OR tags LIKE ?`, [search, search], (err, rows) => {
        if (err) {
            return res.json({ success: false, message: 'Error fetching articles' });
        }
        res.json({ success: true, articles: rows });
    });
});

app.post('/api/articles', upload.single('pdf'), (req, res) => {
    const { title, tags, content } = req.body;
    const pdf = fs.readFileSync(req.file.path);
    db.run(`INSERT INTO articles (title, tags, content, pdf) VALUES (?, ?, ?, ?)`, [title, tags, content, pdf], function(err) {
        if (err) {
            return res.json({ success: false, message: 'Error adding article' });
        }
        res.json({ success: true });
    });
});

// Добавление статьи (только для администратора)


app.post('/api/add-article', (req, res) => {
    const { title, tags, content } = req.body;
    db.run(`INSERT INTO articles (title, tags, content) VALUES (?, ?, ?)`, [title, tags, content], function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
        } else {
            res.json({ success: true });
        }
    });
});

app.get('/api/articles/:id/download', (req, res) => {
    const id = req.params.id;
    db.get(`SELECT pdf FROM articles WHERE id = ?`, [id], (err, row) => {
        if (err || !row) {
            return res.status(404).json({ success: false, message: 'Article not found' });
        }
        res.setHeader('Content-Type', 'application/pdf');
        res.send(row.pdf);
    });
});

// Получение всех пользователей (для администратора)
app.get('/api/users', (req, res) => {
    db.all(`SELECT username, email FROM users`, [], (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
        } else {
            res.json({ users: rows });
        }
    });
});

// Добавление закладки
app.post('/api/bookmarks', (req, res) => {
    const { user_id, article_id } = req.body;
    db.run(`INSERT INTO bookmarks (user_id, article_id) VALUES (?, ?)`, [user_id, article_id], function(err) {
        if (err) {
            return res.json({ success: false, message: 'Error adding bookmark' });
        }
        res.json({ success: true });
    });
});


// Получение закладок пользователя
app.get('/api/bookmarks', (req, res) => {
    const userId = req.query.userId;
    db.all(`SELECT a.id, a.title FROM bookmarks b JOIN articles a ON b.article_id = a.id WHERE b.user_id = ?`, [userId], (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
        } else { 
            res.json({ bookmarks: rows });
        }
    });
});

// Прослушивание порта
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
