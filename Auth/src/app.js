const express= require('express')
const cookie=require("cookie-parser")

const authRoute=require('./routes/auth.route');

const app=express()

app.use(express.json())
app.use(cookie())


app.use('/',authRoute)

module.exports=app;