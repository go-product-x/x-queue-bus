//Require modules
const express = require('express')
const amqp = require('amqplib')

//Create an instance of express to export
let instance = express()

//Declare connection ENV vars
let url = process.env.CLOUDAMQP_URL

//A handler function that produces a message for the queue 'initial-transaction-task'
const produceTransactionForQueue = async (transaction) => {
    try {
        const conn = await amqp.connect(url)
        const channel = await conn.createChannel()
        const q = 'initial-transaction-task'
        let msg = JSON.stringify(transaction)

        await channel.assertQueue(q, { durable: true })

        await channel.sendToQueue(q, Buffer.from(msg), { persistent: true })

        console.log(" [x] Sent '%s'", msg)

        return channel.close()

    }
    catch (error) {
        console.warn(error)
    }
    finally {
        () => {
            conn.close()
        } 
    }
}

//Endpoint for 
instance.post('/transaction', (req, res, next) => {
    let transaction = req.body.data
    produceTransactionForQueue(transaction)
})

module.exports = instance
