const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('dotenv').config();

const app = express();

// connect to database
const db = require('./services/mongoose.service');
db();

// import and register all routes
const userRouter = require('./user/user.routes');
const webhookRouter = require('./webhhook/webhook.routes');

app.use('/webhook', webhookRouter);
app.use('/api/user', userRouter);

// include all middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

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
