const auth = require('../services/auth')
const cache = require('../services/cache')

const authController = (request, response) => {
    let userId = request.body.userId,
        password = request.body.password,
        token;
}

module.exports.default = authController