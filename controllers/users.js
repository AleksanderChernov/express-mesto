const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

const NotFoundErr = require('../middlewares/errors/NotFoundErr.js');
const EmailDoubledErr = require('../middlewares/errors/EmailDoubledErr.js');
const WrongInfoErr = require('../middlewares/errors/WrongInfoErr.js');
const WrongPassOrMail = require('../middlewares/errors/WrongPassOrMail.js');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((user) => {
      if (!user) {
        throw new NotFoundErr('Нет пользователей');
      }
      res.send({ data: user });
    })
    .catch(next);
};

module.exports.findSpecificUser = (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundErr('Пользователь по заданному id отсутствует в базе');
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        throw new NotFoundErr('Невалидный id пользователя');
      } else {
        next(err);
      }
    });
};

module.exports.getUserInfo = (req, res, next) => {
  const { userId } = req.body;
  User.findOne({ userId })
    .then((user) => {
      if (!user) {
        throw new NotFoundErr('Нет пользователя с таким id');
      }
      res.send(user);
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      email: req.body.email,
      password: hash,
    }))
    .then((user) => res.status(201).send({
      avatar: user.avatar,
      name: user.name,
      about: user.about,
      _id: user._id,
      email: user.email,
    }))
    .catch((err) => {
      if (err.kind === 'ValidationError') {
        next(new WrongInfoErr({ message: 'Переданы некорректные данные при обновлении пользователя' }));
      } else if (err.name === 'MongoError' && err.code === 11000) {
        next(new EmailDoubledErr('Такой e-mail уже существует в базе'));
      } else if (err.statusCode === 400) {
        next(new WrongInfoErr('Переданы некорректные данные при создании пользователя'));
      } else {
        next(err);
      }
    });
};

module.exports.modifyUser = (req, res, next) => {
  const filter = req.user._id;
  User.findByIdAndUpdate(filter, { $set: req.body }, { new: true, runValidators: true })
    .orFail(() => {
      next(new NotFoundErr('Пользователь по заданному id отсутствует в базе'));
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.kind === 'ValidationError') {
        next(new WrongInfoErr({ message: 'Переданы некорректные данные при обновлении пользователя' }));
      } else {
        next(err);
      }
    });
};

module.exports.modifyAvatar = (req, res, next) => {
  const filter = req.user._id;
  User.findByIdAndUpdate(filter, { $set: req.body }, { new: true, runValidators: true })
    .orFail(() => {
      throw new NotFoundErr('Пользователь по заданному id отсутствует в базе');
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.kind === 'ValidationError') {
        next(new WrongInfoErr('Переданы некорректные данные при обновлении аватара'));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'devsecret', { expiresIn: '7d' });
      res.cookie('lingeCoin', token, { maxAge: 360000, httpOnly: true, sameSite: true })
        .send({ _id: user._id });
    })
    .catch((err) => {
      if (err.statusCode === 401) {
        next(new WrongPassOrMail({ message: 'Передан неправильный e-mail или пароль' }));
      } else {
        next(err);
      }
    });
};
