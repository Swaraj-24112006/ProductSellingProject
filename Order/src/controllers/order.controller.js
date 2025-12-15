const orderModel = require('../models/order.model')
const axios = require('axios')


async function createOrder(req,res){
    const user = req.user;
    const token = req.cookie.token || req.headers?.authorization?.split(' ')[1];

    try{
        
        const cart = await axios.post('http://localhost:3002/api/cart',{
            headers:{
                authorization:`Bearer${token}`
            }
        })

        if (!cart || cart.totalItems === 0) {
            return res.status(400).json({
                message: "Cart is empty"
            });
        }

        let totalAmount = 0;
        let currency = null;
        

    }catch(err){

    }
         

}



module.exports = {createOrder};
