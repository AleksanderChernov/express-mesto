const jwt = require('jsonwebtoken');
const WrongPassOrMail = require('./errors/WrongPassOrMail.js');

const { NODE_ENV, JWT_SECRET } = process.env;

const handleAuthError = (res) => {
  if (res.status(401)) {
    throw new WrongPassOrMail('Необходима авторизация');
  }
};

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const token = req.cookies.lingeCoin;
  if (!token) {
    return handleAuthError(res);
  }
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'devsecret');
  } catch (err) {
    return handleAuthError(res);
  }

  req.user = payload;

  next();
};
