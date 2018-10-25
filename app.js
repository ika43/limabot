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
app.use('/api/user', userRouter);

// include all middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


module.exports = app;
