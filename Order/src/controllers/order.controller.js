const orderModel = require('../models/order.model')
const axios = require('axios')


async function createOrder(req, res) {
    const user = req.user;
    const token = req.cookies.token || req.headers?.authorization?.split(' ')[1];

    try {

        const cart = await axios.get('http://localhost:3002/api/cart/', {
            headers: {
                authorization: `Bearer ${token}`
            }
        })

        if (!cart || cart.totalItems === 0) {
            return res.status(400).json({
                message: "Cart is empty"
            });
        }

        // console.log("RAW cartResponse.data:", cart.data);
        // console.log("Is items array?", Array.isArray(cartResponse.data.items));



        let totalAmount = 0;
        const items = [];

        for (const item of cart.data.items) {

            const response = await axios.post(
                `http://localhost:3001/api/product/${item.productId}`
            );

            const product = response.data.product;
            const price = product.price;

            items.push({
                productId: item.productId,
                quantity: item.quantity,
                price: {
                    amount: price.amount,
                    currency: price.currency
                }
            });

            totalAmount += price.amount * item.quantity;
        }




        const order = await orderModel.create({
            userId: req.user.id,
            items: items,
            status: "Pending",
            totalprice: {
                amount: totalAmount,
                currency: "INR"
            },
            shippingAddress: {}
        })


        return res.status(201).json({
            message: 'Order Created Successfully',
            Order: order
        })




    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }


}



module.exports = { createOrder };
