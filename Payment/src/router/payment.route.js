const express = require('express')
const authMiddleware = require('../middleware/auth.middleware')
const paymentController = require('../controller/payment.controller')

const router = express.Router()


router.post('/requestSend/:id',authMiddleware(['user']),paymentController.createPayment)



module.exports = router;