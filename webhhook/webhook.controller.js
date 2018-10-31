const apiaiService = require('../services/apiai.service');
const facebookService = require('../services/facebook.service');
const limabotService = require('../services/limabot.service');


// all messages come from this route
exports.getMessage = async (req, res) => {

    // get data
    const data = req.body;
    // Make sure this is a page subscription
    let body = req.body;

    // Check the webhook event is from a Page subscription
    if (body.object === 'page') {

        // Iterate over each entry - there may be multiple if batched
        body.entry.forEach(async function (entry) {

            // Get the webhook event. entry.messaging is an array, but 
            // will only ever contain one event, so we get index 0
            let webhook_event = entry.messaging[0];

            // handle all messages
            limabotService.handleMessage(webhook_event);
        });

        // Return a '200 OK' response to all events
        res.status(200).send('EVENT_RECEIVED');

    } else {
        // Return a '404 Not Found' if event is not from a page subscription
        res.sendStatus(404);
    }
    res.send();
}