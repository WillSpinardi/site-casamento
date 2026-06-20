const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

const app = express();
app.use(cors());
app.use(express.json());

let db;

// Conecta e cria o banco de dados
async function iniciarBanco() {
    db = await open({
        filename: './banco_casamento.sqlite', // Cria o arquivo do banco
        driver: sqlite3.Database
    });

    // Cria a estrutura da lista se for a primeira vez
    await db.exec(`
        CREATE TABLE IF NOT EXISTS convidados (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT,
            vaiComparecer BOOLEAN
        )
    `);
}
iniciarBanco();

// Recebe a resposta e salva definitivamente
app.post('/rsvp', async (req, res) => {
    const { nome, vaiComparecer } = req.body;
    await db.run('INSERT INTO convidados (nome, vaiComparecer) VALUES (?, ?)', [nome, vaiComparecer]);
    res.json({ mensagem: 'Resposta salva no banco de dados com sucesso!' });
});

// Lê a lista direto do banco de dados
app.get('/convidados', async (req, res) => {
    const lista = await db.all('SELECT * FROM convidados');
    res.json(lista);
});

app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});