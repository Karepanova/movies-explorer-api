const router = require('express').Router();

const {
  validateCreateMovie,
  validateDeleteMovie,
} = require('../middlewares/validations');

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

router.get('/movies', getMovies); // возвращает все сохранённые пользователем фильмы
router.post('/movies', createMovie, validateCreateMovie); // создаёт фильм с переданными в теле
// country, director, duration, year, description, image, trailer, nameRU, nameEN и thumbnail, movieId
router.delete('/movies/movieId', deleteMovie, validateDeleteMovie); // удаляет сохранённый фильм по id

module.exports = router;