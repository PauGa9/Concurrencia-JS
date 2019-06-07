const chalk = require('chalk')
const goodRequest = {
    body: {
        userId: 'aaa',
        password: 'bbb'
    }
}

const spyCalls = {}
const cache = require('../../src/services/cache')
const originaCacheGet = cache.get
const originaCacheSet = cache.set
const auth = require('../../src/services/auth')
const originaAuth = auth.authenticate

const cacheGetTokenNull = (key, callback) => {
    spyCalls['cache.get']++
    if (typeof callback != 'function') {
        return callback(Error(`callback has to be a function (in cache.get)`))
    }
    setTimeout(() => callback(null, null), 50)
}
const mockCacheGetTokenNull = () => {
    cache.get = cacheGetTokenNull
    spyCalls['cache.get'] = 0
}

const cacheGetToken = (key, callback) => {
    spyCalls['cache.get']++
    if (typeof callback != 'function') {
        return callback(Error(`callback has to be a function (in cache.get)`))
    }
    setTimeout(() => callback(null, '1234asdf-56fg-789hjk'), 50)
}
const mockCacheGetToken = () => {
    cache.get = cacheGetToken
    spyCalls['cache.get'] = 0
}

const cacheGetError = (key, callback) => {
    spyCalls['cache.get']++
    if (typeof callback != 'function') {
        return callback(Error(`callback has to be a function (in cache.get)`))
    }
    setTimeout(() => callback(Error('')), 50)
}
const mockCacheGetError = () => {
    cache.get = cacheGetError
    spyCalls['cache.get'] = 0
}

const cacheSetToken = (key, value, callback) => {
    spyCalls['cache.set']++
    if (typeof callback != 'function') {
        return callback(Error(`callback has to be a function (in cache.get)`))
    }
    setTimeout(() => callback(null, 1), 50)
}
const mockCacheSetToken = () => {
    cache.set = cacheSetToken
    spyCalls['cache.set'] = 0
}

const cacheSetError = (key, value, callback) => {
    spyCalls['cache.set']++
    if (typeof callback != 'function') {
        return callback(Error(`callback has to be a function (in cache.get)`))
    }
    setTimeout(() => callback(Error('Error in cache.set')), 50)
}
const mockCacheSetError = () => {
    cache.set = cacheSetError
    spyCalls['cache.set'] = 0
}

const authToken = (userId, password, callback) => {
    spyCalls['auth']++
    if (typeof callback != 'function') {
        throw Error('callback has to be a function (in auth.authenticate)')
    }
    setTimeout(() => callback(null, '1234asdf-56fg-789hjk'), 150)
}
const mockAuthToken = () => {
    auth.authenticate = authToken
    spyCalls['auth'] = 0
}

const authError = (userId, password, callback) => {
    spyCalls['auth']++
    if (typeof callback != 'function') {
        throw Error('callback has to be a function (in auth.authenticate)')
    }
    setTimeout(() => callback(Error('wrong')), 150)
}
const mockAuthError = () => {
    auth.authenticate = authError
    spyCalls['auth'] = 0
}

module.exports = (exercice) => {
    // test correct path
    testCorrectPath(exercice)
    // test wrong path
    .then(() => testErrorInCacheGet(exercice))
    .then(() => testErrorInAuth(exercice))
    .then(() => testErrorInCacheSet(exercice))
    .then(() => console.log())
    .catch(error => console.log(error))
}

function testCorrectPath(exercice) {
    name('Test correct path')
    mockCacheGetToken()
    mockCacheSetToken()

    return test(exercice, goodRequest)
    .then((httpResponse) => {
        const actual = [httpResponse, spyCalls['cache.get'], spyCalls['cache.set']]
        assertEqual(actual, [{token: '1234asdf-56fg-789hjk'}, 1, 0], 'Token cacheado > response.json({token: <token>})')
    })
    .then(() => {
        mockCacheGetTokenNull()
        mockAuthToken()
        mockCacheSetToken()
        return test(exercice, goodRequest)
    })
    .then((httpResponse) => {
        const actual = [httpResponse, spyCalls['cache.get'], spyCalls['cache.set']]
        assertEqual(actual, [{token: '1234asdf-56fg-789hjk'}, 1, 1], 'Token no cacheado > usuario y password correctos > authenticate > cache.set > response.json({token: <token>})')
    })
}

function testErrorInCacheGet(exercice) {
    name('Test wrong path: error in cache.get')
    mockCacheGetError()
    mockAuthToken()

    return test(exercice, goodRequest)
        .then(data => {
            assertEqual(data, {error: 'Uuups'}, 'Cuando cache.get devuelve error, debes finalizar la petición http con response.json({error: "Uuups"})')
            assertEqual(spyCalls['auth'], 0, 'Cuando cache.get devuelve error, no deberías llamar auth.authenticate')
        })
}

function testErrorInAuth(exercice) {
    name('Test wrong path: error in auth')
    mockCacheGetTokenNull()
    mockCacheSetToken()
    mockAuthError()

    return test(exercice, goodRequest)
        .then(data => {
            assertEqual(data, {error: 'Uuups'}, 'Cuando usuario y/o contraseña son incorrectos, debes finalizar la petición http con response.json({error: "Uuups"})')
            assertEqual(spyCalls['cache.set'], 0, 'Cuando usuario y/o contraseña son incorrectos, no deberías llamar cache.set')
        })
}

function testErrorInCacheSet(exercice) {
    name('Test wrong path: error in cache.set')
    mockCacheGetTokenNull()
    mockCacheSetError()
    mockAuthToken()

    return test(exercice, goodRequest)
        .then(data => {
            assertEqual(data, {error: 'Uuups'}, 'Cuando cache.set devuelve un error, debes finalizar la petición http con response.json({error: "Uuups"})')
        })
}

var firstTest = true

function name(name) {
    const newLine = firstTest ? '' : '\n'
    console.log(newLine + chalk.bold.white(`#  ${name}`))
    firstTest = false
}

function test(exercice, request) {
    const response = {}
    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => resolve('timeout'), 1500)
        response.json = (data) => {
            clearTimeout(timeout)
            resolve(data)
        }
        exercice(request, response)
    })
}

function assertEqual(actual, expected, definedMessage) {
    const assert = require('assert')
    const message = actual == 'timeout' ? 'Timeout: El test ha tardado demasiado tiempo' : definedMessage
    try {
        assert.deepStrictEqual(
            actual,
            expected,
            koMessage(message)
        )
        console.log(okMessage(message))
    } catch (error) {
        console.log(error.message)
    }
}

const okMessage = (message) => assertionMessage(message, true)
const koMessage = (message) => assertionMessage(message, false)

function assertionMessage(message, ok) {
    if (!ok) {
        return chalk.red('    ko ') + chalk.white(' ' + message)
    }

    return chalk.green('    ok ') + chalk.white(' ' + message)
}

const aa = 'Y2FjaGUuZ2V0KHVzZXJJZCwgKGVycm9yLCB0b2tlbikgPT4gewogICAgICAgIGlmIChlcnJvcikgewogICAgICAgICAgICByZXNwb25zZS5qc29uKHtlcnJvcjogJ1V1dXBzJ30pCiAgICAgICAgICAgIHJldHVybgogICAgICAgIH0KICAgICAgICBpZiAodG9rZW4pIHsKICAgICAgICAgICAgcmVzcG9uc2UuanNvbih7dG9rZW46IHRva2VufSkKICAgICAgICAgICAgcmV0dXJuCiAgICAgICAgfQogICAgICAgIGF1dGguYXV0aGVudGljYXRlKHVzZXJJZCwgcGFzc3dvcmQsIChlcnJvciwgdG9rZW4pID0+IHsKICAgICAgICAgICAgaWYgKGVycm9yKSB7CiAgICAgICAgICAgICAgICByZXNwb25zZS5qc29uKHtlcnJvcjogJ1V1dXBzJ30pCiAgICAgICAgICAgICAgICByZXR1cm4KICAgICAgICAgICAgfQogICAgICAgICAgICBjYWNoZS5zZXQodXNlcklkLCB0b2tlbiwgKGVycm9yLCBpbnNlcnRpb25zKSA9PiB7CiAgICAgICAgICAgICAgICBpZiAoZXJyb3IpIHsKICAgICAgICAgICAgICAgICAgICByZXNwb25zZS5qc29uKHtlcnJvcjogJ1V1dXBzJ30pCiAgICAgICAgICAgICAgICAgICAgcmV0dXJuCiAgICAgICAgICAgICAgICB9CiAgICAgICAgICAgICAgICByZXNwb25zZS5qc29uKHt0b2tlbjogJzEyMzRhc2RmLTU2ZmctNzg5aGprJ30pCiAgICAgICAgICAgIH0pCiAgICAgICAgfSkKICAgIH0p'
