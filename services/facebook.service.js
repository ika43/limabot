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

const datetimeWebViewPicker = (id) => {
    const messageData = {
        "recipient": {
            id
        },
        "message": {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": [
                        {
                            "title": "Dobrodošli!",
                            "image_url": "https://www.luxlife.rs/chest/timg/1436373031_lux-life-trend-fancy-hamad-international-airport-aerodrom-savrsenstvo-luksuz-aerodrom-koji-ima-sve-salon-lepote-destinacije-avioni-qatar-izmedju-letova-avionom-pauza-99.jpg",
                            "subtitle": "Beauty Queen, salon koji osvaja!",
                            "buttons": [
                                {
                                    "type": "web_url",
                                    "url": "https://date-time-picker.herokuapp.com/",
                                    "title": "Odaberite datum!",
                                    "messenger_extensions": true,
                                }
                            ]
                        }
                    ]
                }
            }
        }
    }
    callSendAPI(messageData);
}

const sendQuickReply = (id, text, quick_replies) => {

    const messageData = {
        "recipient": {
            id
        },
        "message": {
            text,
            quick_replies
        }
    }
    callSendAPI(messageData);
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

const getUserInfo = async (userId) => {

    return new Promise((resolve, reject) => {
        request({
            uri: 'https://graph.facebook.com/v2.7/' + userId,
            qs: {
                access_token: process.env.PAGE_ACCESS_TOKEN
            }

        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {

                const user = JSON.parse(body);
                resolve(user);
            } else {
                reject(response.error);
            }

        });
    })
}


module.exports = {
    callSendAPI,
    sendTypingOff,
    sendTypingOn,
    sendTextMessage,
    sendMarkSeen,
    getUserInfo,
    sendQuickReply,
    datetimeWebViewPicker
}