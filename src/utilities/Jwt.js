const jwt = require('jsonwebtoken');

const createJWT = function (id, name) {
  const secret = process.env.JWT_SECRET;
  const lifeTime = process.env.JWT_LIFETIME;
  return jwt.sign(
    { userId: id, name: name },
    secret,
    {
      expiresIn: lifeTime,
    }
  );
};

module.exports = createJWT;