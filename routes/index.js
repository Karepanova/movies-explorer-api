const router = require('express').Router();
const { validateLogin, validateCreateUser, } = require('../middlewares/validations');
const { login, createUser, } = require('../controllers/users');
const auth = require('../middlewares/auth');

const userRouter = require('./users');
const movieRouter = require('./movies');

router.post('/signup', createUser);
router.post('/signin', login);

module.exports = router;
