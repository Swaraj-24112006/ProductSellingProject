const mongoose=require('mongoose')

async function connectDB() {
    try{
        await mongoose.connect(process.env.MONGOOSE_URL)
        console.log("Connected To DB")
    }catch(err){
        console.log("Could not connect to DB")
    }
}


module.exports=connectDB;