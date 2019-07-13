// const axios = require('axios')
// const promiseFs = require('../services/promiseFs')
// const filePath = `${__dirname}/../../test.txt`
// const url = 'https://api.openbrewerydb.org/breweries?by_state=new_york'

 function aa() {
    /** Añade código aquí */
    var p1 = new Promise(function(resolve, reject){
        resolve(1)
    })
    setTimeout(function(){
      console.log("will be executed at the top of the next Event Loop")
    },0)
    p1.then(function(value){
      console.log("p1 fulfilled")
    })
    setTimeout(function(){
      console.log("will be executed at the bottom of the next Event Loop")
    },0)
}

aa()
