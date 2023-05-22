const { Router } = require('express')
const router = Router()
const mongoManager = require('../DAO/productManagerMongo/productMMongo.js')

router.get('/', async (req, res) => {
    try {
        const { docs, totalPages, prevPage, nextPage, page, hasPrevPage, hasNextPage } = await mongoManager.getProduct(req.query)

        const prevUrl = req.originalUrl.endsWith("products") ? `/api/products?page=${prevPage}` : req.originalUrl.includes("page") ? req.originalUrl.replace(`page=${page}`, `page=${prevPage}`) : `${req.originalUrl}&page=${prevPage}`
        const nextUrl = req.originalUrl.endsWith("products") ? `/api/products?page=${nextPage}` : req.originalUrl.includes("page") ? req.originalUrl.replace(`page=${page}`, `page=${nextPage}`) : `${req.originalUrl}&page=${nextPage}`

        res.status(200).send({
            status: 'success',
            payload: docs,
            totalPages: totalPages,
            prevPage: prevPage,
            nextPage: nextPage,
            page: page,
            hasPrevPage: hasPrevPage,
            hasNextPage: hasNextPage,
            prevLink: hasPrevPage ? prevUrl : null,
            nextLink: hasNextPage ? nextUrl : null
        })
    } catch (error) {
        return res.status(500).send({
            status: 'error',
            payload: error
        })
    }
})

router.post('/:pid', async (req, res) => {
    try {
        console.log(req.params)
        console.log(req.body)
        res.send({
            status: 'success'
        })
    } catch (error) {
        return res.status(400).send({
            status: `ERROR`,
            error
        })
    }
})

/*'api/products/:pid'*/
/*POST api/products */

module.exports = router