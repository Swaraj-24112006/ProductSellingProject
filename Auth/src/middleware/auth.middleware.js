const userModel = require('../models/user.model')
const jwt =  require('jsonwebtoken')

async function authentication(req,res,next){
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({message:"Invalid Credentials"})
    }

    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY);

        req.user=decoded

        next()

    }catch(err){
        return res.status(401).json({message:"Unauthorized"})
    }
}

module.exports = {authentication}