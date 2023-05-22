const { productModel } = require("../models/productModel.js");

class ProductManagerMongo {
    getProduct = async (request/*Recibe la req.query para su utilización*/) => {
        try {
            //Si la URL no recibe consulta alguna, regresa TODOS los documentos
            if (Object.keys(request).length === 0) {
                return await productModel.paginate({}, {
                    lean: true,
                    page: 1,
                    limit: 10
                })
            }
            //Si la URL tiene un query por párametro, la desestructuro para simplificar las consultas.
            const { limit = 10, page = 1, sort, pid, ...query } = request

            //Si el URL tiene un ID de producto, entonces lo busca
            if (pid) {
                return await productModel.findOne({ _id: pid }).lean()
            }
            const [queryKey] = Object.keys(query)
            const [queryValues] = Object.values(query)

            //Si no tiene consulta pero tiene todos los demás párametros
            if (!queryKey) {
                return await productModel.paginate({}, {
                    lean: true,
                    limit,
                    page,
                    sort: { price: sort }
                })
            }

            //Si la consulta a realizar es "disponibilidad"  o "categoria" se realiza la siguiente condición
            if (queryKey === 'status' || queryKey === 'category') {
                return await productModel.paginate({ [queryKey]: queryValues }, {
                    lean: true,
                    limit,
                    page,
                    sort: { price: sort }
                })
            }
            throw Error
        } catch (error) {
            return `ERROR: ${error}`
        }
    }
    updateProduct = async (pid, changes) => {
        try {
            if (!pid) {
                return `No se efectuaron los cambios porque no se entregó un ID`
            }
            if (!changes) {
                return `No se efectuaron los cambios porque no hay cambios`
            }
            return await productModel.updateOne({ _id: pid }, changes)
        } catch (error) {
            return `ERROR: ${error}`
        }
    }
    createProduct = async (product) => {
        try {
            if (!product) {
                return `No hay un producto para agregar.`
            }
            return await productModel.create(product)
        } catch (error) {
            return `ERROR: ${error}`
        }
    }
    deleteProduct = async (pid) => {
        try {
            if (!pid) {
                return `No hay ID para eliminar el producto.`
            }
            return await productModel.deleteOne({ _id: pid })
        } catch (error) {
            return `ERROR: ${error}`
        }
    }
}

module.exports = new ProductManagerMongo()