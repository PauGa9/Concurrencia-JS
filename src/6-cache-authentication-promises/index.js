const auth = require('../services/auth')
const cache = require('../services/cache')

const authController = (request, response) => {
    let userId = request.body.userId,
        password = request.body.password,
        token;
    
    /** Añade código aquí */

    /* Aquí tienes una posible solución con callbacks
    cache.get(userId, (error, token) => {
        if (error) {
            response.json({error: 'Uuups'})
            return
        }
        if (token) {
            response.json({token: token})
            return
        }
        auth.authenticate(userId, password, (error, token) => {
            if (error) {
                response.json({error: 'Uuups'})
                return
            }
            cache.set(userId, token, (error, insertions) => {
                if (error) {
                    response.json({error: 'Uuups'})
                    return
                }
                response.json({token: '1234asdf-56fg-789hjk'})
            })
        })
    })
    */
}

module.exports.default = authController
