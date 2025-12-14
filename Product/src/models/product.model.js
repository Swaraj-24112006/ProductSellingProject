const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    currency: {
        type: String,
        enum: ['USD', "INR"],
        required: true
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    images: [{
        url: { type: String },
        thumbnail: { type: String },
        id: { type: String }
    }]

})

const productModel = new mongoose.model('product',productSchema)

module.exports = productModel