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
  db.query('SELECT * FROM carrinho_compras', (err, results) => {
    if (err) {
      console.error('Erro ao buscar carrinho no bando de dados:', err);
      res.status(500).json({ mensagem: 'Erro interno no servidor'});      
    } else {
      res.json(results);
    }
  });
});

// Rota para buscar o cliente e os produtos no carrinho
router.get('/carrinho_cliente', (req, res) => {
  const sql = `
    SELECT 
      cl.id_cliente,
      cl.nome AS nome_cliente,
      p.id_produto,
      p.nome AS nome_produto,
      p.preco AS preco_produto,
      c.quantidade
    FROM carrinho_compras c
    INNER JOIN clientes cl ON c.id_cliente = cl.id_cliente
    INNER JOIN produtos p ON c.id_produto = p.id_produto;
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Erro na consulta SQL:', err);
      res.status(500).json({ mensagem: 'Erro interno do servidor' });
      return;
    }

    // Formate os resultados conforme necessário
    const carrinho = {};
    results.forEach((row) => {
      const clienteId = row.id_cliente;
      const produtoId = row.id_produto;

      if (!carrinho[clienteId]) {
        carrinho[clienteId] = {
          id_cliente: clienteId,
          nome_cliente: row.nome_cliente,
          produtos: [],
        };
      }

      carrinho[clienteId].produtos.push({
        id_produto: produtoId,
        nome_produto: row.nome_produto,
        preco_produto: row.preco_produto,
        quantidade: row.quantidade,
      });
    });

    // Converta o objeto em uma matriz de carrinhos (opcional)
    const carrinhoArray = Object.values(carrinho);

    res.json(carrinhoArray);
  });
});

// Rota para adicionar um produto com uma quantidade específica ao carrinho do cliente
router.post('/carrinho_cliente/adicionar', (req, res) => {
  // Obtenha os valores do corpo da solicitação JSON
  const { id_cliente, id_produto, quantidade } = req.body;

  // Query SQL para adicionar o produto e a quantidade ao carrinho do cliente
  const sql = `
    INSERT INTO carrinho_compras (id_cliente, id_produto, quantidade)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE quantidade = quantidade + VALUES(quantidade);
  `;

  // Executar a query com os valores
  db.query(sql, [id_cliente, id_produto, quantidade], (err, result) => {
    if (err) {
      console.error('Erro ao adicionar produto ao carrinho:', err);
      res.status(500).json({ mensagem: 'Erro interno do servidor' });
    } else {
      res.json({ mensagem: 'Produto adicionado ao carrinho com sucesso' });
    }
  });
});


// Rota para alterar a quantidade de um produto no carrinho de um cliente
router.put('/carrinho_cliente/:id_cliente/:id_produto', (req, res) => {
  const clienteId = req.params.id_cliente;
  const produtoId = req.params.id_produto;
  const novaQuantidade = req.body.novaQuantidade; // Suponha que a nova quantidade seja enviada no corpo da solicitação JSON

  const sql = 'UPDATE carrinho_compras SET quantidade = ? WHERE id_cliente = ? AND id_produto = ?';

  db.query(sql, [novaQuantidade, clienteId, produtoId], (err, result) => {
    if (err) {
      console.error('Erro na consulta SQL:', err);
      res.status(500).json({ mensagem: 'Erro interno do servidor' });
      return;
    }

    if (result.affectedRows === 0) {
      res.status(404).json({ mensagem: 'Produto não encontrado no carrinho do cliente' });
    } else {
      res.json({ mensagem: 'Quantidade do produto atualizada com sucesso' });
    }
  });
});

// Rota para deletar um produto do carrinho de um cliente
router.delete('/carrinho_cliente/:id_cliente/:id_produto', (req, res) => {
  const clienteId = req.params.id_cliente;
  const produtoId = req.params.id_produto;

  // Query SQL para deletar o produto do carrinho do cliente
  const sql = 'DELETE FROM carrinho_compras WHERE id_cliente = ? AND id_produto = ?';

  // Executar a query com os valores dos IDs
  db.query(sql, [clienteId, produtoId], (err, result) => {
    if (err) {
      console.error('Erro ao excluir produto do carrinho:', err);
      res.status(500).json({ mensagem: 'Erro interno do servidor' });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ mensagem: 'Produto não encontrado no carrinho do cliente' });
    } else {
      res.json({ mensagem: 'Produto excluído do carrinho com sucesso' });
    }
  });
});


module.exports = router;