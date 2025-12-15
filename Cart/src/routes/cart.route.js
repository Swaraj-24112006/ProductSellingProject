const express = require('express')
const cartController = require('../controllers/cart.controller')
const createAuthMiddleware = require('../middleware/auth.middleware')
const validation = require('../middleware/validate.middleware')
const router = express.Router()

router.post('/items',createAuthMiddleware(['user']),validation.validateAddItemCart,cartController.addToCart)

router.patch('/items/:productId',createAuthMiddleware(['user']),cartController.updateCartItemQuantity)

router.get('/',createAuthMiddleware(['user']),cartController.getMyCart)

router.delete('/items/:productId',createAuthMiddleware(['user']),cartController.removeFromCart)

router.delete('/',createAuthMiddleware(['user']),cartController.clearCart)

module.exports = router