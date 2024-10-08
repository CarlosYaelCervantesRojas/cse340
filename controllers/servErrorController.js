const servErrorCont = {}

servErrorCont.throwServerError = async function(req, res, next) {
    const error = new Error()
    error.status = 500
    next(error)
}


module.exports = servErrorCont