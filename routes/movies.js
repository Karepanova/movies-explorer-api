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

router.get('/', getMovies); // возвращает все сохранённые пользователем фильмы
router.post('/', validateCreateMovie, createMovie); // создаёт фильм с переданными в теле
// country, director, duration, year, description, image,
// trailer, nameRU, nameEN и thumbnail, movieId

// удаляет сохранённый фильм по id
router.delete('/:movieId', validateDeleteMovie, deleteMovie);

module.exports = router;
