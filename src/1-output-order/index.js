const consoleOrder = () => {
    setTimeout(() => console.log(1), 0)
    console.log(2)
    const interval = setInterval(() => {
        console.log(3)
        setTimeout(() => {
            console.log(4)
        }, 500);

    }, 1000)
    setTimeout(() => {clearInterval(interval); console.log(5)}, 1100)
    console.log(6)
}

module.exports.default = consoleOrder