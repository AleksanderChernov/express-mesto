const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const urlValidationMethod = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.message('Ошибка в ссылке');
};

module.exports.profileValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30)
      .messages({
        'string.min': 'Минимальная длина имени - 2 символа',
        'string.max': 'Максимальная длина имени - 30 символов',
      }),
    about: Joi.string().min(2).max(30)
      .messages({
        'string.min': 'Минимальная длина описания - 2 символа',
        'string.max': 'Максимальная длина описания - 30 символов',
      }),
  }),
});

module.exports.avatarValidator = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().custom(urlValidationMethod)
      .messages({
        'any.required': 'Аватар должен быть валидной ссылкой',
      }),
  }),
});

module.exports.loginValidator = celebrate({
  body: Joi.object().keys({
    password: Joi.string().required().min(8).max(20)
      .messages({
        'string.min': 'Минимальная длина пароля - 8 символов',
        'string.max': 'Максимальная длина пароля - 20 символов',
        'any.required': 'Необходимо заполнить поле',
      }),
    email: Joi.string().required().email()
      .messages({
        'any.required': 'Необходимо заполнить поле',
      }),
  }),
});

module.exports.linkValidator = celebrate({
  body: Joi.object().keys({
    link: Joi.string().custom(urlValidationMethod)
      .messages({
        'any.required': 'Ссылка на картинку не валидна',
      }),
  }),
});

module.exports.userIdValidator = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24).hex(),
  }),
});

module.exports.cardIdValidator = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24).hex(),
  }),
});
