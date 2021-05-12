const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const urlValidationMethod = (value, helpers) => {
  if (validator.isUrl(value)) {
    return value;
  }
  return helpers.message('Ошибка в ссылке');
};

const dataValidator = celebrate({
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
    avatar: Joi.string().custom(urlValidationMethod)
      .messages({
        'any.required': 'Аватар должен быть валидной ссылкой',
      }),
    password: Joi.string().required().min(8).max(20)
      .messages({
        'string.min': 'Минимальная длина пароля - 8 символов',
        'string.max': 'Максимальная длина пароля - 20 символов',
        'any.required': 'Непобходимо заполнить поле',
      }),
    email: Joi.string().required().email()
      .messages({
        'any.required': 'Необходимо заполнить поле',
      }),
    link: Joi.string().custom(urlValidationMethod)
      .messages({
        'any.required': 'Ссылка на картинку не валидна',
      }),
  }),
  params: Joi.object().keys({
    id: Joi.string().alphanum().length(24).hex(),
  }),
});

module.exports = dataValidator;
