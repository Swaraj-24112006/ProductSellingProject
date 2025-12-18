const orderModel = require('../models/order.model')
const axios = require('axios')
const mongoose = require('mongoose')

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

        const responseaddress = await axios.get(`http://localhost:3000/api/auth/user/me/addresses`, {
            headers: {
                authorization: `Bearer ${token}`
            }
        })


        const useraddress = responseaddress.data.Address[0];


        const order = await orderModel.create({
            userId: req.user.id,
            items: items,
            status: "Pending",
            totalprice: {
                amount: totalAmount,
                currency: "INR"
            },
            shippingAddress: {
                street: useraddress.street,
                city: useraddress.city,
                state: useraddress.state,
                country: useraddress.country,
                zip: useraddress.zip,
                pincode: useraddress.pincode
            }
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


async function getMyOrders(req, res) {
    try {
        const userId =  req.user.id;

        const orders = await orderModel
            .find({ userId: userId })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            TotalOrder: orders.length,
            order:orders
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch orders"
        });
    }
}



async function getOrderById(req, res) {
    try {
        const orderId = req.params.id;
        const userId =  req.user.id;

        //  Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order ID"
            });
        }

        //  Find order (only if belongs to logged-in user)
        const order = await orderModel.findOne({
            _id: orderId,
            userId: userId
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        return res.status(200).json({
            success: true,
            order
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch order"
        });
    }
}


async function cancelOrder(req, res) {
    try {
        const orderId = req.params.id;
        const userId = req.user._id || req.user.id;

        //  Validate order ID
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order ID"
            });
        }

        //  Find order belonging to user
        const order = await orderModel.findOne({
            _id: orderId,
            userId: userId
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        //  Apply cancellation rules
        if (order.status === 'Cancel') {
            return res.status(400).json({
                success: false,
                message: "Order is already cancelled"
            });
        }

        if (!['pending', 'paid'].includes(order.status)) {
            return res.status(400).json({
                success: false,
                message: `Order cannot be cancelled once ${order.status}`
            });
        }

        //  Cancel order
        order.status = 'Cancel';
        order.cancelledAt = new Date();

        await order.save();

        return res.status(200).json({
            success: true,
            message: "Order cancelled successfully",
            order
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to cancel order"
        });
    }
}


async function updateDeliveryAddress(req, res) {
    try {
        const orderId = req.params.id;
        const userId =  req.user.id;

        const { street, city, state, zip, country, pincode } = req.body;

        //  Validate Order ID
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order ID"
            });
        }

        //  Find order belonging to user
        const order = await orderModel.findOne({
            _id: orderId,
            userId: userId
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        //  Business rule: allow update ONLY before payment
        if (order.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: "Delivery address can only be updated before payment"
            });
        }

        //  Update delivery address
        order.deliveryAddress = {
            street,
            city,
            state,
            zip,
            country,
            pincode
        };

        await order.save();

        return res.status(200).json({
            success: true,
            message: "Delivery address updated successfully",
            deliveryAddress: order.deliveryAddress
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to update delivery address"
        });
    }
}



module.exports = { createOrder, getMyOrders, getOrderById,cancelOrder,updateDeliveryAddress };
