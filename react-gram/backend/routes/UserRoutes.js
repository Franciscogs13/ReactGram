const express = require('express');
const router = express.Router();

//chamando as funções do controller
const {
  register,
  login,
  getCurrentUser,
  update
} = require('../controllers/UserController');

//middlewares, vai ficar entre a requisição do usuário e a resposta que vai obter do bd
const validate = require('../middlewares/handleValidation');
const {
  userCreateValidation,
  loginValidation,
  userUpdateValidation,
} = require('../middlewares/userValidations');

const { imageUpload } = require('../middlewares/imageUpload');

const authGuard = require('../middlewares/authGuard');

//rotas
router.post('/register', userCreateValidation(), validate, register);
router.post('/login', loginValidation(), validate, login);
router.get('/profile', authGuard, getCurrentUser);
router.put(
  "/",
  authGuard,
  userUpdateValidation(),
  validate,
  imageUpload.single("profileImage"),
  update
);

module.exports = router;
