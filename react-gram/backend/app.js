require('dotenv').config();

const express = require('express');
const path = require('path');
const cors = require('cors');

// acessa a porta criada no arquivo .env
const port = process.env.PORT;

const app = express();

//config JSON and form data reponse
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//resolvendo cors(quando é executado as requisições pelo meos dominío)
app.use(cors({ credentials: true, origin: 'http://localhost:5173 ' }));

//diretóro de upload de imagens
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

//conexão com BD
require('./config/db.js');

//routes
const router = require('./routes/Router.js');

app.use(router);

app.listen(port, () => {
  console.log(`App rodando na porta ${port}`);
});
