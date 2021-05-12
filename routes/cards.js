const router = require('express').Router();
const {
  createCard, getCards, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

const dataValidator = require('../middlewares/validator');

router.post('/', dataValidator, createCard);
router.get('/', getCards);
router.delete('/:cardId', dataValidator, deleteCard);
router.put('/:cardId/likes', dataValidator, likeCard);
router.delete('/:cardId/likes', dataValidator, dislikeCard);

module.exports = router;
