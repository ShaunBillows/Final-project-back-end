const User = require('./model');
const jwt = require('jsonwebtoken');

exports.createUser = async(req, res) => {
    try {
        const newUser = await User.create(req.body);
        const token = await jwt.sign({_id:newUser._id}, process.env.SECRET)
        res.send({msg: `new user created: ${newUser.uName}.`, Token: token});
    } catch (error) {
        console.log(error)
        res.send({msg: `Error at CreateUser: ${error}`})
    };
};