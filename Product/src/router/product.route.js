const express = require('express')
const createAuthMiddleware = require('../middleware/auth.middleware')
const { createProduct } = require('../controller/product.controller')
const { validateProduct } = require('../validators/product.validator')

const router = express.Router();

router.post('/createproduct', createAuthMiddleware(["admin","seller"]), validateProduct, ...createProduct)

module.exports = router;



module.exports = router;
