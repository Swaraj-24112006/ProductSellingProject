const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({

    userId : {
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'user'
    },
    items :[
        {
            productId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'product',
                required:true
            },
            quantity:{
                type:Number,
                required:true
            }
        }
    ]
},{timestamps:true})


const cartModel = new mongoose.model('cart',cartSchema);

module.exports= cartModel;