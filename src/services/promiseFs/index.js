const fs = require('fs')
const util = require('util');

module.exports.writeFile = util.promisify(fs.writeFile)
