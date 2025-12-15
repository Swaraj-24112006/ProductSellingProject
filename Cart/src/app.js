const express= require('express')
const cookie=require("cookie-parser")
const cartRoute = require('./routes/cart.route')


const app=express()

app.use(express.json())
app.use(cookie())

app.use('/api/cart',cartRoute);


module.exports=app;