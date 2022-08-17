const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../user/model');

exports.hashPass = async(req, res, next) => {
    try {
        if(req.body.newPass){
            req.body.newPass = await bcrypt.hash(req.body.newPass, 8);
        };
        if(req.body.pass){
            req.body.pass = await bcrypt.hash(req.body.pass, 8);
            next();
        } else {
            throw new Error('Missing password')
        }
    } catch (error) {
        res.status(500).send({ err: `Error at hashPass: ${error.message} `})
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
        res.status(500).send({msg: `Error at checkPass: ${error.message}`});
    };
};

exports.checkToken = async (req, res, next) => {
    try {
        if(req.header('Authorization')){
            const decodedToken = await jwt.verify(req.header('Authorization'), process.env.SECRET)
            req.user = await User.findById(decodedToken._id)
            if(req.user){
                next()
            } else {
                throw new Error('Invalid token.')
            }
        } else {
            throw new Error('Missing Token.')
        };
    } catch (error) {
        res.status(500).send({err: error.message})
    };
};