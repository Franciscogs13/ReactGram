// controller usado para verificar se o usuário está autenticado

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { default: mongoose } = require('mongoose');

const jwtSecret = process.env.JWT_SECRET;

//gerar token do usuário
const generateToken = (id) => {
  return jwt.sign({ id }, jwtSecret, {
    expiresIn: '7d',
  });
};

//registrar o usuário e logar
const register = async (req, res) => {
  const { name, email, password } = req.body;

  // checar se o usuário existe!
  const user = await User.findOne({ email });

  if (user) {
    res.status(422).json({ errors: ['Por favor, utilize outro e-mail'] });
    return;
  }

  //gerar senha hash
  const salt = await bcrypt.genSalt();
  const passwordHash = await bcrypt.hash(password, salt);

  // criar usuário
  const newUser = await User.create({
    name,
    email,
    password: passwordHash,
  });

  //checagem se o usuário foi criado com sucesso e retorna um token
  if (!newUser) {
    res
      .status(422)
      .json({ errors: ['Houve um erro, por favor tente mais tarde.'] });
  }

  res.status(201).json({
    _id: newUser._id,
    token: generateToken(newUser._id),
  });
};

//logar usuário
const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  //checar se o usuário existe
  if (!user) {
    res.status(404).json({ errors: ['Usuário não encontrado.'] });
    return;
  }
  //checar se a senha está correta
  if (!(await bcrypt.compare(password, user.password))) {
    res.status(422).json({ errors: ['Senha inválida.'] });
    return;
  }

  //retornar o usuário com token
  res.status(201).json({
    _id: user._id,
    profileImage: user.profileImage,
    token: generateToken(user._id),
  });
};

//validar proteção de autenticação e resgatar o usuário
const getCurrentUser = async (req, res) => {
  const user = req.user;

  res.status(200).json(user);
};

//atualizar o usuário
const update = async (req, res) => {
  const { name, password, bio } = req.body;

  let profileImage = null;

  if (req.file) {
    profileImage = req.file.filename;
  }

  const reqUser = req.user;

  const user = await User.findById(
    new mongoose.Types.ObjectId(reqUser._id),
  ).select('-password');

  if (name) {
    user.name = name;
  }

  if (password) {
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    user.password = passwordHash;
  }

  if (profileImage) {
    user.profileImage = profileImage;
  }

  if (bio) {
    user.bio = bio;
  }

  await user.save();

  res.status(200).json(user);
};

module.exports = {
  register,
  login,
  getCurrentUser,
  update,
};
