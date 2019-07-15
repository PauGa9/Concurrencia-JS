const chalk = require('chalk')
var firstTest = true

const spyCalls = {orderMeat: 0, orderBread: 0, orderCondiments: 0, promiseAll: 0}
const ordersModule = require('../../src/services/order')
const originalOrderMeat = ordersModule.orderMeat
const originalOrderBread = ordersModule.orderBread
const originalOrderCondiments = ordersModule.orderCondiments
const originalPromiseAll = Promise.all
Promise.allSpy = Promise.all

ordersModule.orderMeat = () => {
    spyCalls['orderMeat']++
    return originalOrderMeat()
}

ordersModule.orderBread = () => {
    spyCalls['orderBread']++
    return originalOrderBread()
}

ordersModule.orderCondiments = () => {
    spyCalls['orderCondiments']++
    return originalOrderCondiments()
}

Promise.all = (promises) => {
    spyCalls['promiseAll']++
    return Promise.allSpy(promises)
}

function testCorrectPath(exercise) {
    name('Test correct path')

    return test(exercise)
    .then((result) => {
        assertEqual(
            result,
            [{id: `burguer`, info: '250gr'}, {id: `bread`, info: 'wholemeal'}, {id: `condiments`, info: 'lettuce, tomato, bbq-sauce'}],
            'La promesa que devuelve la función makeBurguer debe devolver un array con el resultado de orderMeat, orderBread y orderCondiments'
        )

        assertEqual(
            {orderMeat: spyCalls.orderMeat, orderBread: spyCalls.orderBread, orderCondiments: spyCalls.orderCondiments},
            {orderMeat: 1, orderBread: 1, orderCondiments: 1},
            'La función makeBurguer debe llamar una vez a las funciones del módulo orders'
        )

        assertEqual(
            spyCalls.promiseAll,
            1,
            'La función makeBurguer debe llamar a la función Promise.all'
        )
    })
    .catch(error => {
        console.log(koMessage(error.message))
    })
}

function name(name) {
    const newLine = firstTest ? '' : '\n'
    console.log(newLine + chalk.bold.white(`#  ${name}`))
    firstTest = false
}

function test(exercise) {
    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => resolve('timeout'), 1500)
        const exerciseResult = exercise()
        assertEqual(exerciseResult instanceof Promise, true, 'La función makeBurguer debe devolver una Promsesa')

        if ((exerciseResult instanceof Promise)) {
            exerciseResult.then((result) => {
                resolve(result)
                clearTimeout(timeout)
            })
        } else {
            clearTimeout(timeout)
        }
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

module.exports = (exercise) => {
    // test correct path
    testCorrectPath(exercise)
}
