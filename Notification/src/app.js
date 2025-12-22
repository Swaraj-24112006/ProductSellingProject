const express = require('express')
const {sendEmail} = require('./email')
const { connect, subscribeQueue } = require('./broker/broker')

connect().then(() => {
    subscribeQueue("AUTH_NOTIFICATIONS_QUEUE", async (data) => {
        console.log("Data Received in Notification Service: ", data);
        if (data.type === "WELCOME_EMAIL") {
            await sendEmail(
                data.email,
                "Welcome to Our Service",
                `Hello ${data.username}, welcome to our service! We're glad to have you on board.`,
                `<h1>Hello ${data.username},</h1><p>Welcome to our service! We're glad to have you on board.</p>`
            );
        }

    });
})



const app = express()




module.exports = app