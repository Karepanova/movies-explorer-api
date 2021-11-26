const jwt = require('jsonwebtoken'); // импортируем модуль jsonwebtoken
const bcrypt = require('bcryptjs'); // импортируем bcrypt
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const IncorrectDataError = require('../errors/incorrect-data-err');
const DuplicateError = require('../errors/duplicate-err');

// получить пользователя
const getUserMe = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError('Нет пользователя с таким id');
    })
    .then((user) => res.send(user))
    .catch(next);
};

// создание пользователя
const createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((({ _id }) => User.findById(_id)))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new IncorrectDataError('Некорректные данные');
      }
      if (err.name === 'MongoServerError' && err.code === 11000) {
        throw new DuplicateError('Пользователь с таким email уже существует!');
      }
      next(err);
    })
    .catch(next);
};

// обновление пользователя
const updateUser = (req, res, next) => {
  const { name } = req.body;
  User.findByIdAndUpdate(req.user._id, { name }, { new: true, runValidators: true })
    .orFail(() => {
      throw new NotFoundError('Нет пользователя с таким id');
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new IncorrectDataError('Некорректные данные');
      }
      if (err.message === 'NotFound') {
        throw new NotFoundError('Пользователь не найден');
      }
      if (err.name === 'CastError') {
        throw new IncorrectDataError('Некорректный id');
      }
      next(err);
    })
    .catch(next);
};

// получить логин - почту и пароль и проверяет их
const login = (req, res, next) => {
  const { email, password } = req.body;
  const { NODE_ENV, JWT_SECRET } = process.env;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // создадим токен
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'someSecretKey-0000',
        { expiresIn: '7d' }, // токен будет просрочен через неделю после создания);
      );
      // вернём токен
      res.send({ token });
    })
    .catch(next);
};

module.exports = {
  getUserMe,
  createUser,
  updateUser,
  login,
};
