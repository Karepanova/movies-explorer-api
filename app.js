const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { errors } = require('celebrate');
const centralErrors = require('./middlewares/errors');
const NotFoundError = require('./errors/not-found-err');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { BASE_ADDRESS = 'mongodb://localhost:27017/bitfilmsdb' } = process.env;
const app = express();

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// подключаемся к серверу mongo
mongoose.connect(BASE_ADDRESS, {
  useNewUrlParser: true,
  // useCreateIndex: true,
  // useFindAndModify: false
});
app.use(requestLogger); // подключаем логгер запросов до всех обработчиков роутов

// todo "Не забудьте удалить этот код после успешного прохождения ревью".
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use('/', require('./routes/index'));

app.use(() => {
  throw new NotFoundError('Ресурс не найден');
});

// подключаем логгер ошибок после обработчиков роутов и до обработчиков ошибок:
app.use(errorLogger);

app.use(errors()); // обработчик ошибок celebrate

app.use(centralErrors); // централизованный обработчик ошибок

module.exports = app;
