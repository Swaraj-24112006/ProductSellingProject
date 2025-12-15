const express = require('express')
const cartController = require('../controllers/cart.controller')
const createAuthMiddleware = require('../middleware/auth.middleware')

const router = express.Router()

router.post('/items',createAuthMiddleware(['user']),cartController.addToCart)





module.exports = router