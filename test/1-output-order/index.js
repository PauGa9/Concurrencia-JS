const chalk = require('chalk')

module.exports.test = (exercice) => (rawSolution, hasToShowSolution) => {
    const result = []
    const log = console.log
    const solution = rawSolution.length == 1 ? rawSolution[0].split(',').map(item => item.trim()) : rawSolution
    const checkMessage = hasToShowSolution ? 
        chalk.red('Lo siento, pero no es correcto! ') + 'La respuesta correcta es ' + chalk.bold(result.join(' ')): 
        chalk.red('Lo siento, pero no es correcto! ') + 'Si quieres ver la solución, ejecuta el comando ' + chalk.bold.italic('npm test <nombre-test> -s <solución>');
    
    new Promise((resolve) => {
        console.log(chalk.blue('Según entiendo, tu respuesta es ') + chalk.bold.blue(solution.join(' ')))
        console.log = (value) => {result.push(value)}
        exercice()
        setTimeout(resolve, 2000)
    })
    .then(() => {
        console.log = log
        const assert = require('assert')
        try {
            assert.deepStrictEqual(
                solution.map(item => Number(item)),
                result,
                checkMessage
            )
            console.log(chalk.bold.green('Es correcto!'))
        } catch (error) {
            console.log(error.message)
        }
    })
    .catch(error => console.log('Se ha producido un error: ' + error.message))
}
