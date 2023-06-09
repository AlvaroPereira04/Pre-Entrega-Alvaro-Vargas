const { Router } = require('express')
const router = Router()
const mongoManager = require('../DAO/productManagerMongo/productMMongo.js')
const { auth } = require('../middleware/auth.js')

//const { ProductManager } = require('../DAO/productsManager/proManJSON.js')
//const path = './src/DAO/productsManager/data.json'
//const Manager = new ProductManager(path)


router.get('/products', auth, async (req, res) => {
    try {
        if (!req.session.user) {
            return res.redirect('/views/session/login')
        }
        const { first_name, last_name, rol } = req.session.user
        let { docs } = await mongoManager.getProduct({})
        const object = {
            title: "Tienda Online",
            docs,
            style: "home.css",
            first_name,
            last_name,
            rol
        }
        res.render('home', object)
    } catch (error) {
        return res.status(500).send(error)
    }
})
router.get('/products/:pid', async (req, res) => {
    try {
        const product = await mongoManager.getProduct(req.params)
        const object = {
            pageTitle: "producto",
            product,
            style: "home.css",
            script: "viewProducts.js"
        }
        res.status(200).render('productViews', object)
    } catch (error) {
        return res.status(400).send({
            status: `ERROR`,
            error
        })
    }
})

router.get('/session', auth, async (req, res) => {
    try {
        //falta poder cerrar sesión
        const renderSessionObj = {
            pageTitle: 'Sessions',
            script: 'sessions.js',
            style: 'sessions.css'
        }
        if (!req.session.user) {
            renderSessionObj.showLogin = true
            return res.render('session', renderSessionObj)
        }
        renderSessionObj.showLogin = false
        res.render('session', renderSessionObj)
    } catch (error) {
        if (error) {
            res.status(400).send({
                status: 'Error',
                payload: error
            })
        }
    }
})

router.get('/session/register', auth, (req, res) => {
    const renderRegisterObj = {
        title: 'registro',
        script: 'sessions.js',
        style: 'sessions.css'
    }
    if (req.session.user) {
        renderRegisterObj.showForm = false
        return res.render('register', renderRegisterObj)
    }
    renderRegisterObj.showForm = true
    res.status(200).render('register', renderRegisterObj)
})

router.get('/session/login', auth, (req, res) => {
    const renderLoginObj = {
        title: 'Login',
        script: 'sessions.js',
        style: 'sessions.css'
    }
    res.status(200).render('login', renderLoginObj)
})

router.get('/session/perfil', (req, res) => {
    const { first_name, last_name, age } = req.session.user
    const renderProfileObj = {
        title: 'Perfil',
        script: 'sessions.js',
        style: 'sessions.css',
        first_name,
        last_name,
        age
    }
    res.status(200).render('perfil', renderProfileObj)
})

module.exports = router