const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
/* const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env; */

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
    /* required: true, */
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
    /* required: true, */
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
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }
          /* jwt.sign({ _id: user._id },
          NODE_ENV === 'production' ? JWT_SECRET : 'devsecret', { expiresIn: '7d' }); */
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
