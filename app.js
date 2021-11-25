const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { errors } = require('celebrate');
const auth = require('./middlewares/auth');
const centralErrors = require('./middlewares/errors');
const NotFoundError = require('./errors/not-found-err');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
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

app.use(auth); // авторизация

app.use('/users', require('./routes/users')); // все операции с пользователями (получить, удалить, изменить)

app.use('/movies', require('./routes/movies')); // все операции с карточками

app.use(() => {
  throw new NotFoundError('Ресурс не найден');
});

// подключаем логгер ошибок после обработчиков роутов и до обработчиков ошибок:
app.use(errorLogger);

app.use(errors()); // обработчик ошибок celebrate

app.use(centralErrors); // централизованный обработчик ошибок

module.exports = app;
