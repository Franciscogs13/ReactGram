//vai impedir o usuário de acessar uma rota que não esteja autenticado
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

const authGuard = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(" ")[1];

  //checar se o header tem um token
  if (!token) return res.status(401).json({ errors: ['Acesso negado.'] });

  //checar se o token é válido
  try {
    //valida se o token combina com o secret
    const verified = jwt.verify(token, jwtSecret);

    //pegar o usuário na requisição sem precisar ficar fazendo consultas no banco o tmepo todo
    req.user = await User.findById(verified.id).select("-password");

    next();
  } catch (error) {
    res.status(401).json({ errors: ['Token inválido.'] });
  }
};

module.exports = authGuard;
