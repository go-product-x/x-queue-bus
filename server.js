//Require modules
//require('dotenv').config() //Uncomment for use in local environment
const express = require('express')
const bodyParser = require('body-parser')

//Instance of express
let app = express()

//Middlewares
app.use(bodyParser.json())

//Middlewares for various routes
app.use(require('./handlers/receive-initial-transaction.js'))

//Start the server to listen for requests
app.listen(process.env.PORT || 3000, () => {
    console.log("listening");
    
})
