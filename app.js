const express = require('express');
const Router = express();
const clientesRoutes = require('./router/clientes');
const carrinhoComprasRoutes = require('./router/carrinho_compras');
const qualificacoesProdutosRoutes = require('./router/qualif_produtos');
const produtosRoutes = require('./router/produtos');

// Configuração do middleware e outras configurações
Router.use(express.json());

// Usar as rotas para cada recurso
Router.use('/api/clientes', clientesRoutes);
Router.use('/api/qualificacoes_produtos', qualificacoesProdutosRoutes);
Router.use('/api/produtos', produtosRoutes);
Router.use('/api/carrinho', carrinhoComprasRoutes);

// Outras configurações e inicialização do servidor

Router.listen(3000, () => {
  console.log('Servidor está ouvindo na porta 3000');
});
