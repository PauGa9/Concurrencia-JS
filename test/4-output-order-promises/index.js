const chalk = require('chalk')
const rawSolution = process.argv.slice(3)
const axios = require('axios')
axios.get = (url) => new Promise((resolve) => {
    setTimeout(resolve, 200)
})

const test = (exercice) => {
    const result = []
    const log = console.log
    const solution = rawSolution.length == 1 ? rawSolution[0].split(',').map(item => item.trim()) : rawSolution
    const checkMessage = chalk.red('Lo siento, pero no es correcto!')
    
    console.log(chalk.blue('Según entiendo, tu respuesta es ') + chalk.bold.blue(solution.join(' ')))

    const assert = require('assert')
        try {
            assert.deepStrictEqual(
                solution.map(item => Number(item)),
                [1,5,0,2,3,4],
                checkMessage
            )
            console.log(chalk.bold.green('Es correcto!'))
        } catch (error) {
            console.log(error.message)
        }
}

module.exports = test
