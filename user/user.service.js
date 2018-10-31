const User = require('./user.model');

exports.create = async (firstname, lastname, email, senderId) => {
    await new User({
        firstname,
        lastname,
        email,
        senderId,
        createdAt: Date.now()
    }).save()
}