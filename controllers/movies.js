const Movies = require('../models/movies');
const IncorrectDataError = require('../errors/incorrect-data-err');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');

const getMovies = (req, res, next) => {
  Movies.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(next);
};

// создаем карточку
const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  Movies.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    owner: req.user._id,
    nameRU,
    nameEN,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new IncorrectDataError('Некорректные данные');
      }
      next(err);
    })
    .catch(next);
};

// удаляем карточку
const deleteMovie = (req, res, next) => {
  Movies.findById(req.params.movieId)
    .orFail(() => {
      throw new NotFoundError('Нет фильма с таким id');
    })
    .then((movie) => {
      if (movie.owner.toString() === req.user._id) {
        return Movies.findOneAndRemove({
          _id: req.params.movieId,
          owner: req.user._id,
        })
          .then((delMovie) => res.send(delMovie));
      }
      throw new ForbiddenError('Нет доступа к удалению фильма');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new IncorrectDataError('Некорректный id');
      }
      if (err.message === 'NotFound') {
        throw new NotFoundError('Запрашиваемый ресурс не найден');
      }
      next(err);
    })
    .catch(next);
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
