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


async function pushToQueue(queuename , data={}){
    if(!channel || !connection) {
        await connect();
    }

    await channel.assertQueue(queuename,{
        durable:true
    })

    channel.sendToQueue(queuename,Buffer.from(JSON.stringify(data)));
    
    console.log("Data Send to Queue");
}






module.exports = {connect , channel , connection}