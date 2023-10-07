const verificarExistenciaCliente = (db, clienteId, callback) => {
  // Consulta ao banco de dados para verificar se o cliente existe
  db.query('SELECT * FROM clientes WHERE id = ?', [clienteId], (err, results) => {
    if (err) {
      console.error('Erro ao verificar existência do cliente:', err);
      callback(err, null);
    } else {
      // Se a consulta retornar resultados, o cliente existe
      const clienteExiste = results.length > 0;
      callback(null, clienteExiste);
    }
  });
};

const verificarExistenciaProduto = (db, produtoId, callback) => {
  // Consulta ao banco de dados para verificar se o produto existe
  db.query('SELECT * FROM produtos WHERE id = ?', [produtoId], (err, results) => {
    if (err) {
      console.error('Erro ao verificar existência do produto:', err);
      callback(err, null);
    } else {
      // Se a consulta retornar resultados, o produto existe
      const produtoExiste = results.length > 0;
      callback(null, produtoExiste);
    }
  });
};

module.exports = {
  verificarExistenciaCliente,
  verificarExistenciaProduto,
};
