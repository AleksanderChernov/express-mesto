const router = require('express').Router();
const {
  getUsers, findSpecificUser, modifyUser, modifyAvatar, getUserInfo,
} = require('../controllers/users');
const dataValidator = require('../middlewares/validator');

router.get('/', getUsers);
router.get('/me', getUserInfo);
router.get('/:userId', dataValidator, findSpecificUser);
router.patch('/me', dataValidator, modifyUser);
router.patch('/me/avatar', dataValidator, modifyAvatar);

module.exports = router;
