const express = require('express')
const amqp = require('amqplib')
let instance = express()
let url = process.env.CLOUDAMQP_URL

const produceTransactionForQueue = async (transaction) => {
    try {
        const conn = await amqp.connect(url)
        const channel = await conn.createChannel()
        const q = 'initial-transaction-task'
        let msg = JSON.stringify(transaction)

        await channel.assertQueue(q, { durable: true })

        await channel.sendToQueue(q, Buffer.from(msg), {persistent: true})

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

instance.post('/transaction', (req, res, next) => {
    let transaction = req.body.data
    produceTransactionForQueue(transaction)
})

module.exports = instance
