const consoleOrder = () => {
    setTimeout(() => console.log(1), 0)
    console.log(add2(0))
    const interval = setInterval(() => {
        console.log(add(1))
        setTimeout(() => {
            console.log(4)
        }, 500);

    }, 1000)
    setTimeout(() => {clearInterval(interval); console.log(5)}, 1100)
    console.log(6)
}

const add2 = x => x + 2

module.exports.default = consoleOrder
