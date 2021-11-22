const router = require('express').Router();
const { validateLogin, validateCreateUser, } = require('../middlewares/validations');
const { login, createUser, } = require('../controllers/users');
const auth = require('../middlewares/auth');

const userRouter = require('./users');
const movieRouter = require('./movies');

router.post('/signin', validateLogin, login);
router.post('/signup', validateCreateUser, createUser);

router.use(auth, userRouter);
router.use(auth, movieRouter);

module.exports = router;
