module.exports = func => (req, res, next) => 
    promiseHooks.resolve(func(req, res, next)).catch(next)
