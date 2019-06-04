const chalk = require('chalk')
const goodRequest = {
    body: {
        userId: 'admin',
        password: '12345admin'
    }
}

const badRequest = {
    body: {
        userId: 'test',
        password: '12345admin'
    }
}

module.exports = (exercice) => {
    const auth = require('../../src/services/auth')
    const authenticate = auth.authenticate
    let spy = false
    auth.authenticate = function() {
        spy = true
        authenticate.apply(null, arguments)
    }

    executeExercice(exercice, goodRequest)
    // test correct path
    .then(data => {
        test('Test callback call', spy, true, 'Debes utilizar llamar la función auth.authenticate, pasándole userId, password y un callback')
        test('Test correct path', data, {token: '1234asdf-56fg-789hjk'}, 'Con usuario y password correctos debes llamar el método response.json({token: <token>})')
    })
    // test wrong path
    .then(() => {
        return executeExercice(exercice, badRequest)
    })
    .then((data) => {
        test(
            'Test wrong path',
            data,
            {error: "Usuario y/o contraseña incorrecto"},
            'Con usuario y password incorrectos debes llamar el método response.json({error: "Usuario y/o contraseña incorrecto"})'
        )
    })
    .catch(error => console.log(error.message))
}

function executeExercice(exercice, request) {
    const response = {}
    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => resolve('timeout'), 1000)
        response.json = (data) => {
            clearTimeout(timeout)
            resolve(data)
        }
        exercice(request, response)
    })
}

function test(name, actual, expected, definedMessage) {
    const assert = require('assert')
    const message = actual == 'timeout' ? 'Timeout: El test ha tardado demasiado tiempo' : definedMessage
    try {
        assert.deepStrictEqual(
            actual,
            expected,
            chalk.bold.red(name) + chalk.white(' ' + message)                
        )
        console.log(chalk.bold.green(name))
    } catch (error) {
        console.log(error.message)
    }
}
