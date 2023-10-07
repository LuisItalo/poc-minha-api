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
  db.query('SELECT * FROM produtos', (err, results) => {
    if (err) {
      console.error('Erro ao buscar produtos no banco de dados:', err);
      res.status(500).json({ mensagem: 'Erro interno do servidor' });
    } else {
      res.json(results);
    }
  });
});

router.get('/:id', (req, res) => {
  const produtoId = req.params.id;
  db.query('SELECT * FROM produtos WHERE id_produto = ?', [produtoId], (err, results) => {
    if (err) {
      console.error('Erro ao buscar produto no banco de dados:', err);
      res.status(500).json({ mensagem: 'Erro interno do servidor' });
    } else if (results.length === 0) {
      res.status(404).json({ mensagem: 'Produto não encontrado' });
    } else {
      res.json(results[0]);
    }
  });
});

router.post('/', (req, res) => {
  const novoProduto = req.body; // Certifique-se de que esta é a estrutura correta do corpo da solicitação.

  db.query('INSERT INTO produtos SET ?', [novoProduto], (err, result) => {
    if (err) {
      console.error('Erro ao adicionar produto ao banco de dados:', err);
      res.status(500).json({ mensagem: 'Erro interno do servidor' });
    } else {
      novoProduto.id = result.insertId;
      res.status(201).json(novoProduto);
    }
  });
});

router.put('/:id', (req, res) => {
  const produtoId = req.params.id;
  const {nome, descricao, preco} = req.body; // Certifique-se de que esta é a estrutura correta do corpo da solicitação.

  db.query(
    'UPDATE produtos SET nome = ?, descricao = ?, preco = ? WHERE id_produto = ?',
    [nome, descricao, preco, produtoId],
    (err, result) => {
      if (err) {
        console.error('Erro ao atualizar produto:', err);
        res.status(500).json({ mensagem: 'Erro interno do servidor' });
      } else {
        res.status(200).json({ mensagem: 'Produto atualizado com sucesso' });
      }
    }
  );
});

router.delete('/:id', (req, res) => {
  const produtoId = req.params.id;

  db.query('DELETE FROM produtos WHERE id = ?', [produtoId], (err, result) => {
    if (err) {
      console.error('Erro ao excluir produto no banco de dados:', err);
      res.status(500).json({ mensagem: 'Erro interno do servidor' });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ mensagem: 'Produto não encontrado' });
    } else {
      res.json({ mensagem: 'Produto excluído com sucesso' });
    }
  });
});

module.exports = router;
