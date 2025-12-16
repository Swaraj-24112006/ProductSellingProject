const express= require('express')
const cookie=require("cookie-parser")
const orderRoute = require('./routes/order.route')


const app=express()

app.use(express.json())
app.use(cookie())


app.use('/api/order',orderRoute);



module.exports=app;