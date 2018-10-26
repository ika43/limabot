const express = require('express');
const router = express.Router();
const controller = require('./webhook.controller');

router.post('/', controller.getMessage);

module.exports = router;