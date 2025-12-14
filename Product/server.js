require('dotenv').config();
const app=require("./src/app");
const connectDB=require("./src/db/db")

connectDB();

app.listen(5173,()=>{
    console.log("Server Running at Port 5173")
})