const jwt = require('jsonwebtoken');
const config = require("../config/auth_config");

const generateToken = (res, id, email) => {
  const expiration = 86400;
  const token = jwt.sign({
        id, email
    }, config.secret, {
        expiresIn: 86400 // 24 hours
    });
  return res.cookie('token', token, {
    expires: new Date(Date.now() + expiration),
    secure: false,
    httpOnly: true,
  });
};
module.exports = generateToken