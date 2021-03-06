const router = require('express').Router();
const userRouter = require('./users');
const movieRouter = require('./movies');
const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { validateLogin, validateCreateUser } = require('../middlewares/validations');
const NotFoundError = require('../errors/not-found-err');

router.post('/signin', validateLogin, login);
router.post('/signup', validateCreateUser, createUser);

router.use(auth); // авторизация

router.use('/users', require('./users')); // все операции с пользователями (получить, удалить, изменить)

router.use('/movies', require('./movies')); // все операции с карточками

router.use(auth, userRouter);
router.use(auth, movieRouter);

router.use(() => {
  throw new NotFoundError('Ресурс не найден');
});

module.exports = router;
