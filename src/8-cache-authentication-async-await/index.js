const auth = require('../services/auth')
const cache = require('../services/cache')

async function authController (request, response) {
    let userId = request.body.userId,
        password = request.body.password;

    /** Añade código aquí */
}

module.exports.default = authController
