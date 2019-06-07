const auth = require('../services/auth')
const cache = require('../services/cache')

function authController(request, response) {
    let userId = request.body.userId,
        password = request.body.password;

    // check cache userId (key) - token (value)
    // if exist -> return token
    // if doesn't -> auth logic
    // if auth is correct -> cache.set userId (key) - token (value) in cache

    /** Añade código aquí */
}

module.exports.default = authController
