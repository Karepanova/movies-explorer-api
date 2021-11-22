const router = require('express').Router();

const { validateGetUser, validateUpdateUser, } = require('../middlewares/validations');

const { getUser, updateUser, } = require('../controllers/users');

router.get('/users/me', validateGetUser, getUser); // возвращает информацию о пользователе (email и имя)
router.patch('/users/me', validateUpdateUser, updateUser); // обновляет информацию о пользователе (email и имя)

module.exports = router;