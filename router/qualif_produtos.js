const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

// Configuração do banco de dados MySQL.
const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'qwe123',
    database: 'loja_online',
  });

router.post('/:cliente_id/:produto_id', (req, res) => {
  const clienteId = req.params.cliente_id;
  const produtoId = req.params.produto_id;
  const qualificacao = req.body.qualificacao; // Certifique-se de que esta é a estrutura correta do corpo da solicitação.

  // Execute a consulta para adicionar uma qualificação de produto por um cliente.
});

router.put('/:cliente_id/:produto_id', (req, res) => {
  const clienteId = req.params.cliente_id;
  const produtoId = req.params.produto_id;
  const novosDadosQualificacao = req.body; // Certifique-se de que esta é a estrutura correta do corpo da solicitação.

  // Execute a consulta para atualizar uma qualificação de produto por um cliente.
});

router.delete('/:cliente_id/:produto_id', (req, res) => {
  const clienteId = req.params.cliente_id;
  const produtoId = req.params.produto_id;

  // Execute a consulta para remover uma qualificação de produto por um cliente.
});

module.exports = router;
