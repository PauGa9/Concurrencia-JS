function get(key, callback) {
    if (typeof callback != 'function') {
        return callback(Error(`callback has to be a function (in cache service)`))
    }

    if (key === 'admin') {
        return callback(null, null)
    }
    setTimeout(() => callback(null, '1234asdf-56fg-789hjk'), 150)
}

function set(key, value, callback) {
    setTimeout(() => callback(null, 1))
}

module.exports.get = get
module.exports.set = set
