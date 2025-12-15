const mongoose = require('mongoose')


const addressSchema=new mongoose.Schema(
    {
        street:String,
        city:String,
        state:String,
        zip:String,
        country:String,
        pincode:String
    }
)

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'product',
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                default: 1,
                min: 1
            },
            price: {
                amount: {
                    type: Number,
                    required: true
                },
                currency: {
                    type: String,
                    enum: ['USD', 'INR'],
                    default: 'INR'
                }
            }
        }
    ],
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Shipped', 'Cancel', 'Delivered']
    },
    totalprice: {
        amount: {
            type: Number,
            required: true
        },
        currency: {
            type: String,
            required: true,
            enum: ['USD', 'INR']
        }
    },
    shippingAddress: addressSchema,
},{timestamps:true})



const orderModel = new mongoose.model('order', orderSchema)

module.exports = orderModel;