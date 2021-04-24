const Card = require('../models/card');

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании карточки' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.deleteCard = (req, res) => Card.findByIdAndRemove(req.params.cardId)
  .orFail(() => {
    const error = new Error('Карточка с таким id не найдена');
    error.statusCode = 404;
    throw error;
  })
  .then(() => res.status(200).send({ message: 'Карточка удалена успешно' }))
  .catch((err) => {
    if (err.kind === 'ObjectId') {
      res.status(400).send({ message: 'Невалидный id карточки' });
    } else if (err.statusCode === 404) {
      res.status(404).send({ message: err.message });
    } else {
      res.status(500).send({ message: 'Произошла ошибка' });
    }
  });

module.exports.likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .orFail(() => {
    const error = new Error('Карточка с таким id не найдена');
    error.statusCode = 404;
    throw error;
  })
  .then(() => res.status(200).send({ message: 'Карточка лайкнута успешно' }))
  .catch((err) => {
    if (err.kind === 'ObjectId') {
      res.status(400).send({ message: 'Переданы некорректные данные для постановки лайка' });
    } else if (err.statusCode === 404) {
      res.status(404).send({ message: err.message });
    } else {
      res.status(500).send({ message: 'Произошла ошибка' });
    }
  });

module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .orFail(() => {
    const error = new Error('Карточка с таким id не найдена');
    error.statusCode = 404;
    throw error;
  })
  .then(() => res.status(200).send({ message: 'Лайк снят' }))
  .catch((err) => {
    if (err.kind === 'ObjectId') {
      res.status(400).send({ message: 'Переданы некорректные данные для снятия лайка' });
    } else if (err.statusCode === 404) {
      res.status(404).send({ message: err.message });
    } else {
      res.status(500).send({ message: 'Произошла ошибка' });
    }
  });
