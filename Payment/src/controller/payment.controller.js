const paymentModel = require('../models/payment.model');
const axios = require('axios');
require('dotenv').config();
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


async function createPayment(req, res) {
  const token = req.cookies.token || req.headers?.authorization?.split(' ')[1];

  try {
    const { id: orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({ message: "Order ID is required" });
    }

    const orderResponse = await axios.get(
      `http://localhost:3003/api/order/${orderId}`,
      {
        headers: {
          authorization: `Bearer ${token}`
        }
      }
    );

    const order = await razorpay.orders.create({
      amount: orderResponse.data.totalAmount * 100, // amount in the smallest currency unit
      currency: "INR",
      receipt: `receipt_order_${orderId}`,
    });

    console.log(orderResponse.data);

    const paymentdata = await paymentModel.create({
      orderId: orderId,
      razorpayOrderId: order.id,
      userId:req.user.id,
      price:{
        amount:order.amount/100,
        currency:order.currency
      },
      status: "Pending"
    })

    return res.status(200).json({
      success: true,
      address: orderResponse.data
    });



  } catch (err) {
    console.error("Payment Error:", err.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = { createPayment };

