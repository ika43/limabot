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
app.get('/webhook', function (req, res) {
    if (req.query['hub.mode'] === 'subscribe' &&
        req.query['hub.verify_token'] === process.env.VALIDATION_TOKEN) {
        console.log("Validating webhook");
        res.status(200).send(req.query['hub.challenge']);
    } else {
        console.error("Failed validation. Make sure the validation tokens match.");
        res.sendStatus(403);
    }
});


module.exports = app;
