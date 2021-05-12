const router = require('express').Router();
const {
  getUsers, findSpecificUser, modifyUser, modifyAvatar, getUserInfo,
} = require('../controllers/users');
const { profileValidator, avatarValidator, userIdValidator } = require('../middlewares/validator');

router.get('/', getUsers);
router.get('/me', getUserInfo);
router.get('/:userId', userIdValidator, findSpecificUser);
router.patch('/me', profileValidator, modifyUser);
router.patch('/me/avatar', avatarValidator, modifyAvatar);

module.exports = router;
