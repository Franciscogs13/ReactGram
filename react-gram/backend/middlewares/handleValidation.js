//no meio de algumas requisições como por exemplo as feitas nas rotas, pega os erros relacionados a validações e retorna de uma forma mais amigável para o usuário final.

const { validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if(errors.isEmpty()){
    return next()
  }

  const extractedErrors =[]

  errors.array().map((err)=> extractedErrors.push(err.msg))

  return res.status(422).json({
    errors: extractedErrors
    //este errors será consumido no front-end
  })
};

module.exports = validate;