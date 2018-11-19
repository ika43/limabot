const facebookService = require('../services/facebook.service');

const handleQuickReply = async (event) => {

  //handle answer no or yes
  if (event.message.text === 'Ne') {
    await facebookService.sendMarkSeen(event.sender.id);
    await facebookService.sendTypingOn(event.sender.id);
    await facebookService.sendTextMessage(event.sender.id, 'U redu, limabot Vam je na usluzi.');
    return
  } else if (event.message.text === 'Da') {
    await facebookService.sendMarkSeen(event.sender.id);
    await facebookService.sendTypingOn(event.sender.id);
    console.log(event);
    await facebookService.datetimeWebViewPicker(event.sender.id);
    return
  }
}

module.exports = {
  handleQuickReply
}