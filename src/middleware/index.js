const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../user/model');

exports.hashPass = async(req, res, next) => {
    try {
        if(req.body.newPass){
            req.body.newPass = await bcrypt.hash(req.body.newPass, 8);
        };
        req.body.pass = await bcrypt.hash(req.body.pass, 8);
        next();
    } catch (error) {
        res.send({ err: `Error at hashPass: ${error} `})
    };
};

exports.checkPass = async(req, res, next) => {
    try {
        req.user = await User.findOne({username : req.body.username});
        if(req.user && await bcrypt.compare(req.body.pass, req.user.pass)===true) {
            next();
        } else {
            throw new Error('Incorrect credentials.');
        };
    } catch (error) {
        res.send({msg: `Error at checkPass: ${error}`, user: req.user});
    };
};

exports.checkToken = async (req, res, next) => {
    try {
        const decodedToken = await jwt.verify(req.header('Authorization'), process.env.SECRET)
        req.user = await User.findById(decodedToken._id)
        next()
    } catch (error) {
        res.send({err: error})
    };
};