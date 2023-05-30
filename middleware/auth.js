const auth = (req, res, next) => {
    if (req.session.user && req.url == '/session/login') {
        return res.redirect('/views/products')
    }
    next()
}

module.exports = {
    auth
}