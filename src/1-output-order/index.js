const consoleOrder = () => {
    console.log(add1(0))
    setTimeout(() => console.log(2), 0)
    console.log(3)
    const interval = setInterval(() => {
        console.log(add1(3))
        setTimeout(() => {
            console.log(5)
        }, 500);
    }, 1000)
    setTimeout(() => {clearInterval(interval); console.log(6)}, 1100)
    console.log(7)
}

const add1 = x => x + 1

module.exports.default = consoleOrder
