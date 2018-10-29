const request = require('request-promise')


const callSendAPI = (message_data) => {
    request({
        "uri": "https://graph.facebook.com/v2.6/me/messages",
        "qs": { "access_token": process.env.PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": message_data
    }, (err, res, body) => {
        if (!err) {
            console.log('message sent!')
        } else {
            console.error("Unable to send message:" + err);
        }
    });
}

const sendTypingOff = (recipientId) => {
    var messageData = {
        recipient: {
            id: recipientId
        },
        sender_action: "typing_off"
    };
    callSendAPI(messageData);
}

const sendTypingOn = (recipientId) => {
    var messageData = {
        recipient: {
            id: recipientId
        },
        sender_action: "typing_on"
    };
    return new Promise((resolve) => {
        setTimeout(() => { resolve(callSendAPI(messageData)) }, 1300)
    })
}

const sendTextMessage = (recipientId, messageText) => {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            text: messageText,
            metadata: "DEVELOPER_DEFINED_METADATA"
        }
    };
    callSendAPI(messageData);
}

const sendMarkSeen = (recipientId) => {

    var messageData = {
        recipient: {
            id: recipientId
        },
        sender_action: "mark_seen"
    };
    callSendAPI(messageData);
}


module.exports = {
    callSendAPI,
    sendTypingOff,
    sendTypingOn,
    sendTextMessage,
    sendMarkSeen
}