const router = require('express').Router();

router.get('/');
router.get('/users/me'); // возвращает информацию о пользователе (email и имя)
router.patch('/users/me'); // обновляет информацию о пользователе (email и имя)


module.exports = router;