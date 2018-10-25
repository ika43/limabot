const User = require('./user.model');

exports.list = async (req, res) => {

    const users = await User.find();
    return res.json({
        users
    })
}