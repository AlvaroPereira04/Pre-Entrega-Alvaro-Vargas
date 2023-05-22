const { cartModel } = require('../models/cartModel.js')

class CartManagerM {
    newCart = async () => {
        try {
            return await cartModel.create({
                products: []
            })
        } catch (error) {
            return `ERROR: ${error}`
        }
        //Crea un carrito nuevo con un array de productos vacios (de momento sin un usuario vinculado)
    }

    getCarts = async (params) => {
        try {
            return cartModel.paginate({ _id: params.cid }, {
                lean: true,
                populate: 'products.idProduct'
            })
        } catch (error) {
            return `ERROR: ${error}`
        }
        //Retorna los carritos según la query que se requiera, ya sea limit, cid y si no es ninguna de las dos, por defecto trae todos los carritos
    }

    addProductInCart = async (body, params) => {
        try {
            //Inserts recibe un array de productos llamado inserts con formato
            const { inserts, qty } = body

            //cid es el req.params que recibe el id del carrito
            const { cid, pid } = params

            //Revisa si el carrito existe y lo trae, si no, retorna un error
            const cartExists = await cartModel.findOne({ _id: cid })

            //Si existe, actualizar su cantidad

            //Si no trae productos, retorna un error
            if (!(inserts || qty)) {
                throw new Error(`No hay productos que ingresar`)
            }

            //Si el carrito no tiene productos
            if (cartExists.products.length === 0) {
                //Si no tenemos pid y no tenemos quantity que son params para actualizar unicamente la cantidad, pushea el carrito
                if (!pid && !qty) {
                    return await cartModel.updateOne({ _id: cid }, { $push: { products: inserts } })
                }
                //Si tenemos pid y tenemos quantity, retorna error, ya que no se puede actualizar la cantidad si no hay productos en el carrito
                throw new Error(`El carrito de compras está vacio`)
            }
            //Si params y body tienen las propiedades PID y QTY actualizan la cantidad de productos pasados por body en el producto params
            if (pid && qty) {
                return await cartModel.findOneAndUpdate({ _id: cid, "products.idProduct": pid }, { $inc: { "products.$.qty": qty } }, { new: true })
            }
            //Le di muchas vueltas intentando hacerlo con mongo, al final lo hice con JS, si el carrito de mongo YA tiene el ID del carrito pasado por req.body, suma la cantidad otorgada
            const update = cartExists.products.map(newProduct => {
                const updateValues = inserts.find(foo => foo.idProduct === newProduct.idProduct.toString())
                return updateValues ? { "idProduct": updateValues.idProduct, "qty": updateValues.qty + newProduct.qty } : newProduct
            })

            //Si no lo encuentra, agrega.
            const insert = inserts.filter(test => !cartExists.products.find(values => values.idProduct.toString() === test.idProduct))
            update.push(...insert)

            //Actualizamos el carrito de mongo según el nuevo array
            return cartModel.findOneAndUpdate({ _id: cid }, { $set: { products: update } }, { new: true })
        } catch (error) {
            return `ERROR: ${error}`
        }
    }
    //Si el carro buscado con el ID no tiene producto con el IDproducto proporcionado, ingresar 1, si ya tiene un producto con el ID proporcionado sumar 1 a la cantidad establecida

    delCart = async (params) => {
        try {
            //Destructuring de los params recibidos por req.params
            const { cid, pid } = params

            //destructuring del array del carrito
            //const cart = await cartModel.find({ _id: cid }) Si no funciona, descomentar esto lo arregla
            const cart = await cartModel.findOne({ _id: cid })

            if (pid) {
                //Localización de la posición del producto dentro del carrito
                //const indexProduct = cart[0].products.findIndex(test => test.idProduct.toString() === pid)Si no funciona, descomentar esto lo arregla
                const indexProduct = cart.products.findIndex(test => test.idProduct.toString() === pid)

                //Si no se encuentra el carrito, arroja error
                if (indexProduct === -1) {
                    throw new Error(`No se encontró el producto con el ID: ${cid}`)
                }

                //Actualizar el carrito con el operador $pull el cual remueve de un array las instancias encontradas según la condicion especificada 
                //https://www.mongodb.com/docs/v5.2/reference/operator/update/pull/

                return await cartModel.updateOne({ _id: cid }, { $pull: { products: { idProduct: pid } } })
            }
            //Si la URL no tiene un ID del producto como parametro, se elimina todos los productos del carrito con el ID especificado, conservado aún el carrito.
            return await cartModel.updateOne({ _id: cid }, { $pull: { products: {} } })
        } catch (error) {
            return `ERROR: ${error}`
        }
    }
}

module.exports = new CartManagerM()