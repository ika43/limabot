const facebookService = require('../services/facebook.service');
const apiaiService = require('../services/apiai.service');
const cognitoService = require('../services/cognito.services');
const validator = require('validator');
const userService = require('../user/user.service');
const User = require('../user/user.model');


const handleMessage = async (event) => {
    if (event.postback) {
        if (event.postback.payload === 'start') {

            // send welcome text
            const user = await facebookService.getUserInfo(event.sender.id)
            facebookService.sendMarkSeen(event.sender.id);
            await facebookService.sendTypingOn(event.sender.id);
            facebookService.sendTextMessage(event.sender.id, `Hello ${user.first_name}, if you want to use our services please enter email address, so we can verified you.`)
        }
        if(event.postback.payload === 'CONTACT_INFO_PAYLOAD'){

            // send user info
            const user = await User.findOne({senderId: event.sender.id})
            facebookService.sendTextMessage(event.sender.id, `Firstname: ${user.firstname}\nLastname: ${user.lastname}`)
        }
    }
    if (event.message) {

        let sender_psid = event.sender.id;
        const user = await facebookService.getUserInfo(sender_psid)
        facebookService.sendMarkSeen(sender_psid);
        await facebookService.sendTypingOn(sender_psid);
        let text = event.message.text;
        if(validator.isEmail(text)) {
            try {

                // check if already exist
                const user = await User.findOne({senderId: sender_psid})
                if(user) return facebookService.sendTextMessage(sender_psid, `Sorry, but you already have an account.`)
                
                // create a new user
                const result = await cognitoService.signup(text, process.env.COGNITO_PASSWORD)
                facebookService.sendTextMessage(sender_psid, `Great ${user.first_name}, check your inbox and verified your account.`);
                await userService.create(user.first_name, user.last_name, text, sender_psid);
                return;
            } catch (e) {

                // catch mongo and cognito error
                facebookService.sendTextMessage(sender_psid, e.message);
                return
            }
        }
        let apiAiResponse = await apiaiService.sendToApiai(text, sender_psid);
        facebookService.sendTextMessage(sender_psid, apiAiResponse.result.fulfillment.speech);
        return;
    }
}



module.exports = {
    handleMessage
}