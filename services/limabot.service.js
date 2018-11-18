const facebookService = require('../services/facebook.service');
const apiaiService = require('../services/apiai.service');
const userService = require('../user/user.service');
const User = require('../user/user.model');
const { logger } = require('../services/logger.service');


const handleMessage = async (event) => {
	if (event.postback) {
		if (event.postback.payload === 'START') {

			// send welcome text
			const user = await facebookService.getUserInfo(event.sender.id);

			// check if name end with vocal
			let lastChar = user.first_name.substr(user.first_name.length - 1);
			const vocal = ['a', 'e', 'i', 'o', 'u'];
			if (!vocal.includes(lastChar)) user.first_name = user.first_name + 'e';

			//check if user exists already
			if (await userService.exists(user.id)) {

				// send seen
				facebookService.sendMarkSeen(event.sender.id);

				// send welcome message
				await facebookService.sendTypingOn(event.sender.id);
				await facebookService.sendTextMessage(user.id, `Zdravo ${user.first_name}. Drago nam je da ste se vratili.`);
				return;
			} else {

				//log user and create user
				logger.info(user);
				await userService.create(user.first_name, user.last_name, user.id);

				// send seen
				facebookService.sendMarkSeen(event.sender.id);

				// send welcome message
				await facebookService.sendTypingOn(event.sender.id);
				facebookService.sendTextMessage(event.sender.id, `Zdravo ${user.first_name}, Limabot vam je na usluzi.`);

				//send tutorial message 
				await facebookService.sendTypingOn(event.sender.id);
				facebookService.sendTextMessage(event.sender.id, `Korisnički meni je sa Vaše donje leve strane.`);
				return;
			}
		}
		if (event.postback.payload === 'CONTACT_INFO') {

			// send seen
			facebookService.sendMarkSeen(event.sender.id);

			//send contact info message 
			await facebookService.sendTypingOn(event.sender.id);
			facebookService.sendTextMessage(event.sender.id, `Adresa 💇 salona: Nemanjina 14`);
			await facebookService.sendTypingOn(event.sender.id);
			facebookService.sendTextMessage(event.sender.id, `Broj ☎️ : 011/33 88 55`);
			return;
		}
	}
	if (event.message) {

		let sender_psid = event.sender.id;
		facebookService.sendMarkSeen(sender_psid);
		await facebookService.sendTypingOn(sender_psid);
		let text = event.message.text;


		// send to api ai
		let apiAiResponse = await apiaiService.sendToApiai(text, sender_psid);

		//then return response
		facebookService.sendTextMessage(sender_psid, apiAiResponse.result.fulfillment.speech);
		return;
	}
}

module.exports = {
	handleMessage
}