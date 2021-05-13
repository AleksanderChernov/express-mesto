const Card = require('../models/card');

const NotFoundErr = require('../middlewares/errors/NotFoundErr.js');
const WrongInfoErr = require('../middlewares/errors/WrongInfoErr.js');
const NoRightsErr = require('../middlewares/errors/NoRightsErr.js');

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new WrongInfoErr('Переданы некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    });
};

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => {
      throw new NotFoundErr('Карточка по заданному id отсутствует в базе');
    })
    .then((card) => {
      console.log(`${req.user._id} владелец  ${card.owner.toString()}`);
      if (req.user._id !== card.owner.toString()) {
        next(new NoRightsErr('Вы можете удалять только свои карточки'));
      } else {
        Card.findByIdAndRemove(req.params.cardId)
          .then((data) => res.send(data))
          .catch(next);
      }
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.likeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .orFail(() => {
    throw new NotFoundErr('Карточка по заданному id отсутствует в базе');
  })
  .then(() => res.status(200).send({ message: 'Карточка лайкнута успешно' }))
  .catch((err) => {
    if (err.kind === 'ObjectId') {
      next(new WrongInfoErr({ message: 'Переданы некорректные данные при постановке лайка' }));
    } else {
      next(err);
    }
  });

module.exports.dislikeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .orFail(() => {
    throw new NotFoundErr('Карточка по заданному id отсутствует в базе');
  })
  .then(() => res.status(200).send({ message: 'Лайк снят' }))
  .catch((err) => {
    if (err.kind === 'ObjectId') {
      next(new WrongInfoErr({ message: 'Переданы некорректные данные при снятии лайка' }));
    } else {
      next(err);
    }
  });
