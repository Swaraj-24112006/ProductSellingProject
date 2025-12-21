const express= require('express')
const cookie=require("cookie-parser")
const {connect}= require('./broker/broker')

connect();

const app=express()

app.use(express.json())
app.use(cookie())

// app.use('/api/cart',cartRoute);


module.exports=app;