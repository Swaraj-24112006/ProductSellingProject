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

async function subscribeQueue(queuename,callback){

    if(!channel || !connection) {
        await connect();
    }

    await channel.assertQueue(queuename,{
        durable:true
    })

    channel.consume(queuename,async (msg)=>{
        if(msg !== null){
            const data = JSON.parse(msg.content.toString());
            await callback(data);
            channel.ack(msg);
        }
    })

}






module.exports = {connect , channel , connection, pushToQueue}