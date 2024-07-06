// aqui vão estar as rotas da aplicação

const express = require('express');
const router = express();

//rotas do usuário para deixar disponível para a aplicação
router.use("/api/users", require("./UserRoutes"));

//rota de teste
router.get('/', (req, res) => {
  res.send('API funcionando!');
});

module.exports = router;
