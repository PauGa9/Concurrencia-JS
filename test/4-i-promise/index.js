const chalk = require('chalk')
const ERROR_TIMEOUT = 'ERROR_TIMEOUT'
const ERROR_NOT_PROMISE = 'ERROR_NOT_PROMISE'
var firstTest = true

function name(name) {
    const newLine = firstTest ? '' : '\n'
    console.log(newLine + chalk.bold.white(`#  ${name}`))
    firstTest = false
}

function test(exercice) {
    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(Error(ERROR_TIMEOUT)), 1500)
        const result = exercice()
        if (!result || !result.then) {
            reject(Error(ERROR_NOT_PROMISE))
            clearTimeout(timeout)
            return
        }

        result
            .then(resolve)
            .catch(reject)
            .then(() => clearTimeout(timeout))
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

function testCorrectPath(exercice) {
    name('Test correct path')
    const axios = require('axios')
    const originalAxios = axios.get
    axios.get = (url) => Promise.resolve({data: [{city: 'fake', name: 'fake'}, {city: 'Buffalo', name: 'The Brewery'}]})

    const fs = require('../../src/services/promiseFs')
    const writeFile = fs.writeFile
    let spyWriteFile
    fs.writeFile = (path, data) => {
        spyWriteFile = data
        return Promise.resolve()
    }

    return test(exercice)
    .then(() => {
        assertEqual(spyWriteFile, 'The Brewery', 'El array que le mandamos a writeFile tienen que estar filtrado')
        axios.get = originalAxios
        fs.writeFile = writeFile
        return exercice()
    })
    .catch((error) => {
        if (error.message == ERROR_TIMEOUT) {
            console.log(koMessage('El test ha tardado demasiado. Asegúrate de devolver una promesa'))
        }
        else if (error.message == ERROR_NOT_PROMISE) {
            console.log(koMessage('Asegúrate de devolver una promesa'))
        }
        else {
            console.log(koMessage(error.message))
        }
    })
}

module.exports = (exercice) => {
    // test correct path
    testCorrectPath(exercice)
}

const a = 'cmV0dXJuIGF4aW9zLmdldCh1cmwpCiAgICAudGhlbihyZXNwb25zZSA9PiB7CiAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmRhdGEuZmlsdGVyKGl0ZW0gPT4gaXRlbS5jaXR5ID09ICdCdWZmYWxvJykubWFwKGl0ZW0gPT4gaXRlbS5uYW1lKS5qb2luKCcKJykKICAgIH0pCiAgICAudGhlbihsaXN0ID0+IHsKICAgICAgICByZXR1cm4gcHJvbWlzZUZzLndyaXRlRmlsZShmaWxlUGF0aCwgbGlzdCkKICAgIH0pCiAgICAuY2F0Y2goKGVycm9yKSA9PiBjb25zb2xlLmxvZyhlcnJvcikp'
