const testName = getTestName(process.argv[2])
const args = process.argv.slice(3)

try {
    const exercice = require(`../src/${testName}`).default
    const test = require(`./${testName}`)
    test(exercice)
} catch (error) {
    console.error(error)
}

function getTestName(rawName) {
    const testId = rawName.split('-')[0]
    const testName = require('fs').readdirSync(__dirname)
        .find((dir) => RegExp(`^${testId}-.+$`).test(dir))
    return testName
}
