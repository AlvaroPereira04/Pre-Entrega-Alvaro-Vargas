const { Router } = require('express')
const { UserManager } = require('../DAO/productManagerMongo/usersManagerM')
const { auth } = require('../middleware/auth')
const router = Router()
const manager = new UserManager()

router.post('/registro', async (req, res) => {
    try {
        await manager.addUser(req.body)
        res.redirect('/views/session/login')
    } catch (error) {
        if (error) {
            res.redirect('/views/session/registro')
        }
    }
})

router.post('/login', async (req, res) => {
    try {
        const logUser = await manager.loginUser(req.body)
        req.session.user = {
            first_name: logUser.first_name,
            last_name: logUser.last_name,
            age: logUser.age
        }
        if (logUser) {
            if (logUser.email === 'adminCoder@coder.com') {
                req.session.user.rol = 'admin'
                return res.redirect('/views/products')
            }
            req.session.user.rol = 'usuario'
            return res.redirect('/views/products')
        }
    } catch (error) {
        if (error) {
            res.redirect('/views/session/login')
        }
    }
})

router.post('/logout', async (req, res) => {
    try {
        req.session.destroy()
        res.redirect('/views/session/login')
    } catch (error) {
        return `ERROR: ${error}`
    }

})

module.exports = router