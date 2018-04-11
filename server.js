require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')

let app = express()

app.use(bodyParser.json())

app.use(require('./handlers/receive-initial-transaction.js'))

app.listen(process.env.PORT || 3000, () => {
    console.log("listening");
    
})
