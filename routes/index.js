const router = require('express').Router();
const userRouter = require('./users');
const movieRouter = require('./movies');
const { login, createUser, signOut } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { validateLogin, validateCreateUser, } = require('../middlewares/validations');


router.post('/signin', validateLogin, login);
router.post('/signup', validateCreateUser, createUser);
router.post('/signout', signOut);

router.use(auth, userRouter);
router.use(auth, movieRouter);

module.exports = router;
