const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('dotenv').config();

const app = express();

// connect to database
const db = require('./services/mongoose.service');
db();

// include all middleware
app.use(logger('dev'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
app.use(cookieParser());

// import and register all routes
const userRouter = require('./user/user.routes');
const webhookRouter = require('./webhhook/webhook.routes');

app.use('/webhook', webhookRouter);
app.use('/api/user', userRouter);

// handling get route for verification
// Accepts GET requests at the /webhook endpoint
app.get('/webhook', (req, res) => {
  
    /** UPDATE YOUR VERIFY TOKEN **/
    const VERIFY_TOKEN = "<YOUR_VERIFY_TOKEN>";
    
    // Parse params from the webhook verification request
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];
      
    // Check if a token and mode were sent
    if (mode && token) {
    
      // Check the mode and token sent are correct
      if (mode === 'subscribe' && token === process.env.VALIDATION_TOKEN) {
        
        // Respond with 200 OK and challenge token from the request
        console.log('WEBHOOK_VERIFIED');
        res.status(200).send(challenge);
      
      } else {
        // Responds with '403 Forbidden' if verify tokens do not match
        res.sendStatus(403);      
      }
    }
  });


module.exports = app;
