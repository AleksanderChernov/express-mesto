const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
/* const { celebrate, Joi } = require('celebrate'); */
const WrongPassOrMail = require('../middlewares/errors/WrongPassOrMail.js');

/* const { NODE_ENV, JWT_SECRET } = process.env; */

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [2, 'Поле name должно содержать минимум 2 символа'],
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: [2, 'Поле about должно содержать минимум 2 символа'],
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    required: [true, 'Поле avatar должно быть заполнено'],
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Поле "avatar" должно быть валидным url-адресом.',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (email) => validator.isEmail(email),
      message: 'Невалидная почта',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new WrongPassOrMail('Неправильные почта или пароль');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new WrongPassOrMail('Неправильные почта или пароль');
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
