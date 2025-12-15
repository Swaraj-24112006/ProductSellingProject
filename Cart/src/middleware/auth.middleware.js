const jwt = require('jsonwebtoken')


function createAuthMiddleware (roles = ["user"]){

    return function authMiddleware(req,res,next){
        const token = req.cookies?.token || req.headers?.authorization?.split(' ')[1];

        if(!token){
            return res.this.status(404).json({
                message:"No Token Provided"
            })
        }

        try{
            const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY)

            if(!roles.includes(decoded.role)){
                return res.status(404).json({
                    message:"Forbidden Insufficient Permission"
                })
            }

            req.user = decoded;
            next()


        }catch(err){
            console.log("Invalid token provided");
        }

    }


}



module.exports = createAuthMiddleware;