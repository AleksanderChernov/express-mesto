const router = require('express').Router();
const {
  getUsers, findSpecificUser, createUser, modifyUser, modifyAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', findSpecificUser);
router.post('/', createUser);
router.patch('/me', modifyUser);
router.patch('/me/avatar', modifyAvatar);

module.exports = router;
