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

router.get('/', (req, res) => {
  db.query('SELECT * FROM clientes', (err, results) => {
    if (err) {
      console.error('Erro ao buscar clientes no banco de dados:', err);
      res.status(500).json({ mensagem: 'Erro interno do servidor' });
    } else {
      res.json(results);
    }
  });
});

router.get('/:id', (req, res) => {
  const clienteId = req.params.id;

  // Consulta SQL para buscar o cliente pelo ID
    db.query('SELECT * FROM clientes WHERE id_cliente = ?', [clienteId], (err, results) => {
    if (err) {
      console.error('Erro ao buscar cliente no banco de dados:', err);
      res.status(500).json({ mensagem: 'Erro interno do servidor' });
    } else if (results.length === 0) {
      res.status(404).json({ mensagem: 'Cliente não encontrado' });
    } else {
      res.json(results[0]);
    }
  });
});

router.post('/', (req, res) => {
  const novoCliente = req.body; // Certifique-se de que esta é a estrutura correta do corpo da solicitação.

  db.query('INSERT INTO clientes SET ?', [novoCliente], (err, result) => {
    if (err) {
      console.error('Erro ao adicionar cliente ao banco de dados:', err);
      res.status(500).json({ mensagem: 'Erro interno do servidor' });
    } else {
      novoCliente.id = result.insertId;
      res.status(201).json(novoCliente);
    }
  });
});

router.put('/:id', (req, res) => {
  const clienteId = req.params.id;
  const { nome, email, endereco, telefone } = req.body; // Certifique-se de que esta é a estrutura correta do corpo da solicitação.

  db.query(
    'UPDATE clientes SET nome = ?, email = ?, endereco = ?, telefone = ? WHERE id_cliente = ?',
    [nome, email, endereco, telefone, clienteId],
    (err, result) => {
      if (err) {
        console.error('Erro ao atualizar cliente:', err);
        res.status(500).json({ mensagem: 'Erro interno do servidor' });
      } else {
        res.status(200).json({ mensagem: 'Cliente atualizado com sucesso' });
      }
    }
  );
});

router.delete('/:id', (req, res) => {
  const clienteId = req.params.id;

  db.query('DELETE FROM clientes WHERE id = ?', [clienteId], (err, result) => {
    if (err) {
      console.error('Erro ao excluir cliente no banco de dados:', err);
      res.status(500).json({ mensagem: 'Erro interno do servidor' });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ mensagem: 'Cliente não encontrado' });
    } else {
      res.json({ mensagem: 'Cliente excluído com sucesso' });
    }
  });
});

module.exports = router;
