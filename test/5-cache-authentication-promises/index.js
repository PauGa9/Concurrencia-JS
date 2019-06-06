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

const cacheGetTokenNull = (key) => {
    spyCalls['cache.get']++
    return new Promise(resolve => setTimeout(() => resolve(null), 50))
}
const mockCacheGetTokenNull = () => {
    cache.get = cacheGetTokenNull
    spyCalls['cache.get'] = 0
}

const cacheGetToken = (key) => {
    spyCalls['cache.get']++
    return new Promise(resolve => setTimeout(() => resolve('1234asdf-56fg-789hjk'), 50))
}
const mockCacheGetToken = () => {
    cache.get = cacheGetToken
    spyCalls['cache.get'] = 0
}

const cacheGetError = (key) => {
    spyCalls['cache.get']++
    return new Promise((resolve, reject) => setTimeout(() => reject(Error('Error during cache.get')), 50))
}
const mockCacheGetError = () => {
    cache.get = cacheGetError
    spyCalls['cache.get'] = 0
}

const cacheSetToken = (key, value, callback) => {
    spyCalls['cache.set']++
    return new Promise(resolve => setTimeout(() => resolve(1), 50))
}
const mockCacheSetToken = () => {
    cache.set = cacheSetToken
    spyCalls['cache.set'] = 0
}

const cacheSetError = (key, value) => {
    spyCalls['cache.set']++
    return new Promise((resolve, reject) => setTimeout(() => reject(Error('Error in cache.set')), 50))
}
const mockCacheSetError = () => {
    cache.set = cacheSetError
    spyCalls['cache.set'] = 0
}

const authToken = (userId, password) => {
    spyCalls['auth']++
    return new Promise(resolve => setTimeout(() => resolve('1234asdf-56fg-789hjk'), 150))
}
const mockAuthToken = () => {
    auth.authenticate = authToken
    spyCalls['auth'] = 0
}

const authError = (userId, password) => {
    spyCalls['auth']++
    return new Promise((resolve, reject) => setTimeout(() => reject(Error('wrong')), 150))
}
const mockAuthError = () => {
    auth.authenticate = authError
    spyCalls['auth'] = 0
}

module.exports = (exercise) => {
    // test correct path
    testCorrectPath(exercise)
    // test wrong path
    .then(() => testErrorInCacheGet(exercise))
    .then(() => testErrorInAuth(exercise))
    .then(() => testErrorInCacheSet(exercise))
    .then(() => console.log())
    .catch(error => console.log(error))
}

function testCorrectPath(exercise) {
    name('Test correct path')
    mockCacheGetToken()
    mockCacheSetToken()

    return test(exercise, goodRequest)
    .then((httpResponse) => {
        const actual = [httpResponse, spyCalls['cache.get'], spyCalls['cache.set']]
        assertEqual(actual, [{token: '1234asdf-56fg-789hjk'}, 1, 0], 'Token cacheado > response.json({token: <token>})')
    })
    .then(() => {
        mockCacheGetTokenNull()
        mockAuthToken()
        mockCacheSetToken()
        return test(exercise, goodRequest)
    })
    .then((httpResponse) => {
        const actual = [httpResponse, spyCalls['cache.get'], spyCalls['cache.set']]
        assertEqual(actual, [{token: '1234asdf-56fg-789hjk'}, 1, 1], 'Token no cacheado > usuario y password correctos > authenticate > cache.set > response.json({token: <token>})')
    })
}

function testErrorInCacheGet(exercise) {
    name('Test wrong path: error in cache.get')
    mockCacheGetError()
    mockAuthToken()

    return test(exercise, goodRequest)
        .then(data => {
            assertEqual(data, {error: 'Uuups'}, 'Cuando cache.get devuelve error, debes finalizar la petición http con response.json({error: "Uuups"})')
            assertEqual(spyCalls['auth'], 0, 'Cuando cache.get devuelve error, no deberías llamar auth.authenticate')
        })
}

function testErrorInAuth(exercise) {
    name('Test wrong path: error in auth')
    mockCacheGetTokenNull()
    mockCacheSetToken()
    mockAuthError()

    return test(exercise, goodRequest)
        .then(data => {
            assertEqual(data, {error: 'Uuups'}, 'Cuando usuario y/o contraseña son incorrectos, debes finalizar la petición http con response.json({error: "Uuups"})')
            assertEqual(spyCalls['cache.set'], 0, 'Cuando usuario y/o contraseña son incorrectos, no deberías llamar cache.set')
        })
}

function testErrorInCacheSet(exercise) {
    name('Test wrong path: error in cache.set')
    mockCacheGetTokenNull()
    mockCacheSetError()
    mockAuthToken()

    return test(exercise, goodRequest)
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

function test(exercise, request) {
    const response = {}
    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => resolve('timeout'), 1500)
        response.json = (data) => {
            clearTimeout(timeout)
            resolve(data)
        }
        exercise(request, response)
    })
}

function assertEqual(actual, expected, definedMessage) {
    const assert = require('assert')
    const message = actual[0] == 'timeout' ? 'Timeout: El test ha tardado demasiado tiempo' : definedMessage
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

const aa = 'Y2FjaGUuZ2V0KHVzZXJJZCkKICAgIC50aGVuKChkYXRhKSA9PiB7CiAgICAgICAgaWYgKGRhdGEpIHsKICAgICAgICAgICAgdG9rZW4gPSBkYXRhCiAgICAgICAgICAgIHJldHVybgogICAgICAgIH0KCiAgICAgICAgcmV0dXJuIGF1dGguYXV0aGVudGljYXRlKHVzZXJJZCwgcGFzc3dvcmQpCiAgICB9KQogICAgLnRoZW4oKGRhdGEpID0+IHsKICAgICAgICBpZiAoZGF0YSkgewogICAgICAgICAgICB0b2tlbiA9IGRhdGEKICAgICAgICAgICAgcmV0dXJuIGNhY2hlLnNldCh1c2VySWQsIGRhdGEpCiAgICAgICAgfQogICAgfSkKICAgIC50aGVuKCgpID0+IHsKICAgICAgICByZXNwb25zZS5qc29uKHt0b2tlbn0pCiAgICB9KQogICAgLmNhdGNoKChlcnJvcikgPT4gewogICAgICAgIHJlc3BvbnNlLmpzb24oe2Vycm9yOiAnVXV1cHMnfSkKICAgIH0p'
