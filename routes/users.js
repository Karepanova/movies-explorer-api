const router = require('express').Router();

const { validateGetUser, validateUpdateUser } = require('../middlewares/validations');

const { getUserMe, updateUser } = require('../controllers/users');

router.get('/me', validateGetUser, getUserMe); // возвращает информацию о пользователе (email и имя)
router.patch('/me', validateUpdateUser, updateUser); // обновляет информацию о пользователе (email и имя)

module.exports = router;
