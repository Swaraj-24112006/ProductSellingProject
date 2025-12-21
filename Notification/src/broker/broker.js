const amqplib = require('amqplib');

let channel,connection;

async function connect(){

    if(connection){
        return connection;
    }

    try{
        connection = await amqplib.connect(process.env.RABIT_URL);
        console.log("Connected To RABITMQ");
        channel= await connection.createChannel();
    }catch(err){
        console.error("Error in Connection: ",err);
    }

}







module.exports = {connect , channel , connection}