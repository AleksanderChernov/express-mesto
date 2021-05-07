const router = require('express').Router();
const {
  getUsers, findSpecificUser, /* createUser */ modifyUser, modifyAvatar, getUserInfo,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getUserInfo);
router.get('/:userId', findSpecificUser);
router.patch('/me', modifyUser);
router.patch('/me/avatar', modifyAvatar);

module.exports = router;
