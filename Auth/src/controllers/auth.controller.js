const userModel = require('../models/user.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const redis = require("../db/redis")

async function registerUser(req, res) {
    const { username, email, password, fullname , role } = req.body;

    const isUserAlreadyExists = await userModel.findOne({
        $or: [
            { username },
            { email }
        ]
    })

    if (isUserAlreadyExists) {
        return res.status(409).json({ message: "Username or Email-ID already Exists" })
    }

    const user = await userModel.create({
        username: username,
        email: email,
        password: await bcrypt.hash(password, 10),
        fullname: fullname,
        role:role || "user"
    })


    const token = jwt.sign({
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role
    },
        process.env.JWT_SECRET_KEY
    )

    res.cookie("token",token,{
        httpOnly:true,
        secure : true,
        maxage : 24*60*60*1000
    })

    res.status(201).json({
        message:"User Registered ",
        user:{
            id:user._id,
            username:user.username,
            email:user.email,
            fullname:user.fullname,
            role:user.role
        }
    })


}


async function loginUser(req,res){
    const {username,email,passowrd} = req.body;

    const isUser = await userModel.findOne({ $or: [{username},{email}]}).select('+password')
    if(!isUser){
        return res.status(401).json({message:"Invalid Credentials"})
    }

    const isMatch = await bcrypt.compare(password,isUser.password);

    if(!isMatch){
        return res.status(401).json({message:"Invalid Credentials"})
    }

    const token = jwt.sign({
        id:isUser._id,
        username:isUser.username,
        email:isUser.email,
        role:isUser.role
    },process.env.JWT_SECRET_KEY)

    res.cookie("token",token,{
        httpOnly:true,
        secure:true,
        maxage:24*60*60*100
    })

    res.status(201).json({message:"Logged In Successfully"})
    
}

async function getCurrentUser(req,res){
    return res.status(201).json({
        message:"Current User Fetched Successively",
        user:req.user
    })
}


async function logout(req,res){
    const token = req.cookie.token;

    if(token){
        await redis.set(`blacklist:${token}`,'true','EX',24*60*60*1000)
    }

    res.clearCookie('token',{
        httpOnly:true,
        secure:true
    });

    res.status(201).json({
        message:"Logged Out User Successfully"
    })
}

async function getUserAddresses(req,res){
    const id=req.user._id;
    const user = await userModel.findById({id}).select('addresses');
    if(!user){
        return res.status(401).json({
            message:"User doesn't exists"
        })
    }

    return res.status(201).json({
        message:"User Addresses Fetched Successively",
        Address:user.addresses
    })

}

async function addUseraddress(req,res) {

    const id = req.user._id;

    const {street , city , state , zip , country , pincode } = req.body;

    const user = await userModel.findOneAndUpdate({_id:id},{
        $push:{
            addresses:{
                street,
                city,
                state,
                zip,
                country,
                pincode
            }
        }
    },{new:true})

    if(!user){
        return res.status(401).json({
            message:"User Not Found"
        })
    }

    return res.status(201).json({
        message:"User Address Updated Successively",
        addresses:user.addresses
    })
    
}


async function deleteUseraddress(req,res){
    const id = req.user._id;
    const addressid = req.params;

    const isAddressExists = await userModel.findById({_id:id,'addresses._id':addressid});

    if(!isAddressExists){
        return res.status(404).json({
            message:"Address Doesn't Exist"
        })
    }

    const user =  await userModel.findOneAndUpdate({_id:id},{
        $pull:{
            addresses:{_id:addressid}
        }
    },{new : true})

    const addressexist = user.addresses.some(addr=> addr._id.toString() === addressid)
    if(addressexist){
        return res.status(401).json({
            message:"Unsuccessfull Attempt to Delete the Address"
        })
    }

    return res.status(201).json({
        message:"Successfully Deleted the Address"
    })

}

module.exports = { registerUser,loginUser,getUserAddresses,getCurrentUser,logout,addUseraddress,deleteUseraddress }