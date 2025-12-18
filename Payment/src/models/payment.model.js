const mongoose = require('mongoose')

const paymentSchema = new mongoose.Schema({
    order:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'order',
        required:true
    },
    paymentId:{
        type:String,
        required:true,
        unique:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    orderId:{  //Razorpay generated Order Id
        type:String,
        required:true
    },
    signature:{
        type:String
    },
    status:{
        type:String,
        enum : ['Pending','Completed','Failed'],
        default:'Pending'
    },
    price:{
        amount:{
            type:Number,
            required:true,
            min :0
        },
        currency:{
            type:String,
            enum:['USD','INR'],
            default:'INR'
        }
    }
},{timestamps:true})


const paymentModel = new mongoose.model('payment',paymentSchema)

module.exports = paymentModel