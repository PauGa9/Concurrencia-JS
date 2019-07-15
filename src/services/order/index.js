function orderMeat() {
    return new Promise((resolve, reject) => {
        const burguer = {id: `burguer`, info: '250gr'}
        setTimeout(() => resolve(burguer), 300)
    })
}

function orderBread() {
    return new Promise((resolve, reject) => {
        const bread = {id: `bread`, info: 'wholemeal'}
        setTimeout(() => resolve(bread), 300)
    })
}

function orderCondiments() {
    return new Promise((resolve, reject) => {
        const condiments = {id: `condiments`, info: 'lettuce, tomato, bbq-sauce'}
        setTimeout(() => resolve(condiments), 300)
    })
}

module.exports.orderMeat = orderMeat
module.exports.orderBread = orderBread
module.exports.orderCondiments = orderCondiments