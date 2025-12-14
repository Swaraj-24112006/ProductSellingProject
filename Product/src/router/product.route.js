const express = require('express')
const createAuthMiddleware = require('../middleware/auth.middleware')
const productController = require('../controller/product.controller')
const { validateProduct } = require('../validators/product.validator')

const router = express.Router();

router.post('/createproduct', createAuthMiddleware(["admin","seller"]), validateProduct, ...productController.createProduct)

router.get('/seller',productController.getMyProducts)

router.get('/getproducts',productController.getProducts)

router.post('/:id',productController.getproductbyid)

router.patch('/:id',productController.updateProduct)

router.delete('/:id',productController.deleteProduct)

module.exports = router;



module.exports = router;
