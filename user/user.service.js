const User = require('./user.model');

exports.create = async (firstname, lastname, senderId) => {
    await new User({
        firstname,
        lastname,
        senderId,
        createdAt: Date.now()
    }).save()
}

exports.exists = async (senderId) => {

    const res = await User.aggregate([
        { $match: { senderId } }
    ])
    
    if (res.length > 0) return true;
    return false;
}