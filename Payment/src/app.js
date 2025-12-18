const express= require('express')
const cookie=require("cookie-parser")
const paymentrouter = require('./router/payment.route')


const app=express()

app.use(express.json())
app.use(cookie())


app.use('/api/payment',paymentrouter)



module.exports=app;