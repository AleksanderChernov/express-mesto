const express = require('express');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');

const app = express();
app.use(cookieParser());

const { PORT = 3000 } = process.env;
const mongoose = require('mongoose');
const { createUser, login } = require('./controllers/users');
const errorHandler = require('./middlewares/error-handler');
const NotFoundErr = require('./middlewares/errors/NotFoundErr.js');
const auth = require('./middlewares/auth');
const { loginValidator } = require('./middlewares/validator');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.post('/signin', loginValidator, login);
app.post('/signup', loginValidator, createUser);

app.use('/users', auth, require('./routes/users'));
app.use('/cards', auth, require('./routes/cards'));

app.use(() => {
  throw new NotFoundErr('Ошибка 404. Такой страницы не существует');
});

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => (`App listening on port ${PORT}`));
