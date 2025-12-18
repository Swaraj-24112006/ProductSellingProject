const paymentModel = require('../models/payment.model');
const axios = require('axios');

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

    console.log(orderResponse.data);

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

