const express = require('express')
const orderController = require('../controllers/order.controller')
const authMiddleware = require('../middleware/auth.middleware')


const router = express.Router()



router.post('/',authMiddleware(['user']),orderController.createOrder)

module.exports = router