const { Router } = require('express')
const router = Router()
const Manager = require('../DAO/productManagerMongo/cartManagerM.js')

router.post('/', async (req, res) => {
    try {
        const test = await Manager.newCart()
        res.send({
            status: 'success',
            payload: test
        })
    } catch (error) {
        return console.log(`ERROR: ${error}`)
    }
})

router.get('/:cid', async (req, res) => {
    try {

        const { docs } = await Manager.getCarts(req.params)
        const [cart] = docs
        const viewCart = {
            pageTitle: `Carrito #${req.params.cid}`,
            renderCart: cart.products
        }

        res.render('cartView', viewCart)
    } catch (error) {
        return `ERROR: ${error}`
    }
})

//Agrega al carrito la cantidad de productos pasadas por Body.Pendiente a mañana
router.put('/:cid', async (req, res) => {
    try {
        const addProducts = await Manager.addProductInCart(req.body, req.params)

        if (!addProducts) {
            return res.status(404).send({
                status: "ERROR",
                mensaje: addProducts
            })
        }

        res.status(200).send({
            status: 'success',
            mensaje: addProducts
        })
    } catch (error) {
        return `ERROR: ${error}`
    }
})

//Si el carrito ya cuenta con el producto, incrementa su cantidad.
router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const incQuantity = await Manager.addProductInCart(req.body, req.params)

        res.send({
            status: 'success',
            payload: incQuantity
        })
    } catch (error) {
        return console.log(`ERROR: ${error}`)
    }
})

//Elimina todos los productos del carrito seleccionado
router.delete('/:cid', async (req, res) => {
    try {

        const delCart = await Manager.delCart(req.params)

        res.send({
            status: 'success',
            payload: delCart
        })
    } catch (error) {
        return console.log(`ERROR: ${error}`)
    }
})

//Elimina el producto seleccionado del carrito seleccionado
router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const delProductFromCart = await Manager.delCart(req.params)
        res.send({
            status: 'Eliminado correctamente',
            delProductFromCart
        })
    } catch (error) {
        return `ERROR: ${error}`
    }
})

module.exports = router