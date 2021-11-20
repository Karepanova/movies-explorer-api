const Movies = require('../models/movies');
const mongoose = require('mongoose');
const validator = require('validator');

const getMovies = (req, res, next) => {
  Movies.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(next);
};

const createMovie = (req, res, next) => {
  const {
    country, director,
    duration, year,
    description, image,
    trailer, nameRU,
    nameEN, thumbnail,
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
    owner: req.user.id,
    nameRU,
    nameEN,
  })
    .then((movie) => res.status(201).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(ApiError.BadRequestError(errConfig.movie_create_error));
      }
      next(err);
    });
};

const deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  Movies.findById(movieId)
    .orFail(() => ApiError.NotFoundError(errConfig.movie_error_id))
    .then((movie) => {
      if (movie.owner.toString() !== req.user.id.toString()) {
        next(ApiError.ForbiddenError(errConfig.movie_forbidden_error));
      }
      Movies.findByIdAndRemove(movieId)
        .then(() => res.send({ message: errConfig.movie_is_delete }))
        .catch((err) => next(err));
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(ApiError.NotFoundError(errConfig.movie_error_id));
      }
      next(err);
    });
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
