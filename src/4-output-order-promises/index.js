const axios = require('axios')

const consoleOrder = () => {
    axios.get('https://www.google.com')
    .then(() => console.log(0))
    
    let thePromise = new Promise((resolve, reject) => {
        console.log(1)
        setTimeout(resolve, 500)
    })

    thePromise
    .then(() => {
        console.log(2)
        return Promise.reject(3)
    })
    .catch((number) => console.log(number))

    setTimeout(() => console.log(4), 1000)
    console.log(5)
}

module.exports.default = consoleOrder
