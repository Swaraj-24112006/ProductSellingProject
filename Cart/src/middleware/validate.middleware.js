const {body, validationResult} = require('express-validator')
const mongoose  = require('mongoose')

function ValidateResult (req,res,next){
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    next();
}

const validateAddItemCart = [
    body('productId')
        .isString()
        .withMessage("Product Id must be a String")
        .custom(value => mongoose.Types.ObjectId.isValid(value))
        .withMessage("Invalid Product Id Format"),
    body('quantity')
        .isInt({gt:0})
        .withMessage("Quantity should be a Integer greater than 0"),
    ValidateResult
]

module.exports = {validateAddItemCart}