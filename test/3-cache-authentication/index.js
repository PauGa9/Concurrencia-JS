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
            assertEqual(data, {error: 'Error en cache'}, 'Cuando cache.get devuelve error, debes finalizar la petición http con response.json({error: "Error en cache"})')
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
            assertEqual(data, {error: 'Usuario y/o contraseña incorrecto'}, 'Cuando usuario y/o contraseña son incorrectos, debes finalizar la petición http con response.json({error: "Usuario y/o contraseña incorrecto"})')
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
            assertEqual(data, {error: 'Error en cache'}, 'Cuando cache.set devuelve un error, debes finalizar la petición http con response.json({error: "Error en cache"})')
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

const aa = 'Y2FjaGUuZ2V0KHVzZXJuYW1lLCAoZXJyb3IsIHRva2VuKSA9PiB7CiAgICBpZiAoZXJyb3IpIHsKICAgICAgICByZXNwb25zZS5qc29uKHtlcnJvcjogJ0Vycm9yIGVuIGNhY2hlJ30pCiAgICAgICAgcmV0dXJuCiAgICB9CiAgICBpZiAodG9rZW4pIHsKICAgICAgICByZXNwb25zZS5qc29uKHt0b2tlbjogdG9rZW59KQogICAgICAgIHJldHVybgogICAgfQogICAgYXV0aC5hdXRoZW50aWNhdGUodXNlcm5hbWUsIHBhc3N3b3JkLCAoZXJyb3IsIHRva2VuKSA9PiB7CiAgICAgICAgaWYgKGVycm9yKSB7CiAgICAgICAgICAgIHJlc3BvbnNlLmpzb24oe2Vycm9yOiAnVXN1YXJpbyB5L28gY29udHJhc2XDsWEgaW5jb3JyZWN0byd9KQogICAgICAgICAgICByZXR1cm4KICAgICAgICB9CiAgICAgICAgY2FjaGUuc2V0KHVzZXJuYW1lLCB0b2tlbiwgKGVycm9yLCBpbnNlcnRpb25zKSA9PiB7CiAgICAgICAgICAgIGlmIChlcnJvcikgewogICAgICAgICAgICAgICAgcmVzcG9uc2UuanNvbih7ZXJyb3I6ICdFcnJvciBlbiBjYWNoZSd9KQogICAgICAgICAgICAgICAgcmV0dXJuCiAgICAgICAgICAgIH0KICAgICAgICAgICAgcmVzcG9uc2UuanNvbih7dG9rZW46ICcxMjM0YXNkZi01NmZnLTc4OWhqayd9KQogICAgICAgIH0pCiAgICB9KQp9KQ=='
