const router = require('express').Router();

router.get('/');
router.get('/movies'); // возвращает все сохранённые пользователем фильмы
router.post('/movies'); // создаёт фильм с переданными в теле
// country, director, duration, year, description, image, trailer, nameRU, nameEN и thumbnail, movieId
router.delete('/movies/movieId'); // удаляет сохранённый фильм по id


module.exports = router;