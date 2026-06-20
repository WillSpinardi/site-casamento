const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors()); // Permite que o visual do site acesse o servidor
app.use(express.json()); // Prepara o servidor para ler o formulário

// Nossa lista de convidados temporária
const listaPresenca = [];

// Recebe a resposta do convidado
app.post('/rsvp', (req, res) => {
    const { nome, vaiComparecer } = req.body;
    listaPresenca.push({ nome, vaiComparecer });
    res.json({ mensagem: 'Resposta salva com sucesso!' });
});

// Mostra para você quem já confirmou
app.get('/convidados', (req, res) => {
    res.json(listaPresenca);
});

// Liga o servidor
app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});