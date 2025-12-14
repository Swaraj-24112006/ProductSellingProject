const express= require('express')
const cookie=require("cookie-parser")
const productRoute = require('./router/product.route')


const app=express()

app.use(express.json())
app.use(cookie())

app.use('/api/product',productRoute)


module.exports=app;