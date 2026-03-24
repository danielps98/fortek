const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const multer = require('multer');
const path = require('path');

const app = express();

// 🔐 SENHA DO ADMIN
const SENHA_ADMIN = "1234";

// 📦 CONFIG
app.use(express.json());
app.use(express.static('public'));

// 📁 UPLOAD DE IMAGEM
const storage = multer.diskStorage({
  destination: 'public/uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// 📦 BANCO
const db = new sqlite3.Database('./database.db');

// 🧠 TABELA COMPLETA
db.run(`
  CREATE TABLE IF NOT EXISTS maquinas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    descricao TEXT,
    imagem TEXT,
    status TEXT
  )
`);

// 🚀 GET
app.get('/maquinas', (req, res) => {
  db.all('SELECT * FROM maquinas', [], (err, rows) => {
    res.json(rows);
  });
});

// 🚀 POST COM IMAGEM
app.post('/maquinas', upload.single('imagem'), (req, res) => {

  const { nome, descricao, status, senha } = req.body;

  // 🔐 PROTEÇÃO
  if (senha !== SENHA_ADMIN) {
    return res.status(403).json({ erro: "Senha inválida" });
  }

  const imagem = req.file ? "/uploads/" + req.file.filename : "";

  db.run(
    'INSERT INTO maquinas (nome, descricao, imagem, status) VALUES (?, ?, ?, ?)',
    [nome, descricao, imagem, status],
    function (err) {
      res.json({ id: this.lastID });
    }
  );
});

// 🚀 LISTAR NO ADMIN
app.get('/admin/maquinas', (req, res) => {
  db.all('SELECT * FROM maquinas', [], (err, rows) => {
    res.json(rows);
  });
});

app.listen(3000, () => {
  console.log("🔥 http://localhost:3000");
});