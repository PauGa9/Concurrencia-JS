function authenticate(userId, password, callback) {
    if (typeof callback != 'function') {
        throw Error('callback has to be a function (in auth.authenticate)')
    }

    const timeout = Math.floor((Math.random() * 200) + 100)
    setTimeout(() => {
        if (userId == 'admin' && password == '12345admin') {
            callback(null, '1234asdf-56fg-789hjk')
        } else {
            callback(Error('wrong'))
        }
    }, timeout)
}

module.exports.authenticate = authenticate
