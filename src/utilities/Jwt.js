const jwt = require('jsonwebtoken')

const createJWT = function (id, name) {
    return jwt.sign(
        { userId: id, name: name },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_LIFETIME,
        }
    )
}

module.exports = createJWT