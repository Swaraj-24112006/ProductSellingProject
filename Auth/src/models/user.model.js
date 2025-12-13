const mongoose =require('mongoose')

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

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        select:false
    },
    fullname:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['user','seller'],
        default:'user'
    },
    addresses:[addressSchema]
})

const userModel=new mongoose.model('user',userSchema);

module.exports=userModel;