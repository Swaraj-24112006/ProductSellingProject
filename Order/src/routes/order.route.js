const express = require('express')
const orderController = require('../controllers/order.controller')
const authMiddleware = require('../middleware/auth.middleware')


const router = express.Router()



router.post('/',authMiddleware(['user']),orderController.createOrder)

router.get('/me',authMiddleware(['user']),orderController.getMyOrders)

router.get('/:id',authMiddleware(['user']),orderController.getOrderById)

router.post('/cancel/:id',authMiddleware(["user"]),orderController.cancelOrder)

router.patch('/address/:id',authMiddleware(['user']),orderController.updateDeliveryAddress)

module.exports = router