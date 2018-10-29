var apiai = require('apiai');
const app = apiai(process.env.CLIENT_ACCESS_TOKEN);

//send to api ai 
exports.sendToApiai = (text, sessionID) => {
    return new Promise((resolve, reject) => {
        const request = app.textRequest(text, {
            sessionId: sessionID
        });

        request.on('response', function (response) {
            resolve(response);
        });

        request.on('error', function (error) {
            reject(error);
        });
        request.end();
    })
}