const User = require('./model');
const jwt = require('jsonwebtoken');
const { trusted } = require('mongoose');

exports.createUser = async(req, res) => {
    try {
        const newUser = await User.create(req.body);
        const token = await jwt.sign({_id:newUser._id}, process.env.SECRET)
        res.send({msg: `new user created: ${newUser.username}.`, Token: token});
    } catch (error) {
        res.send({msg: `Error at CreateUser: ${error}`})
    };
};

exports.login = async (req, res) => {
    try {
        const user = await User.findOne({username: req.body.username});
        const token = await jwt.sign({_id:user._id}, process.env.SECRET)
        res.send({msg: `You have logged in successfully. Welcome, ${user.username}.`, token: token})
    } catch (error) {
        res.send({err: error});
    };
};

exports.updateEmail = async (req, res) => {
    try {
        await User.updateOne({username: req.user.username}, {email: req.body.newEmail} )
        res.send({msg: `User ${req.user.username} email updated.`, mailUpdated: true})
    } catch (error) {
        res.send({msg: `At updateEmail: ${error}`});
    };
};

exports.updatePassword = async(req, res) => {
    try {
        await User.updateOne({username: req.user.username}, {pass: req.body.newPass});
        res.send({msg: `User ${req.user.username} password updated.`, passUpdated: true})
    } catch (error) {
        res.send({msg: `At updatePass: ${error}`});
    };
};

exports.updateUsername = async(req, res) =>{
    try {
        await User.updateOne({username: req.user.username}, {username: req.body.newUsername});
        res.send({msg: `User ${req.user.username} username updated.`, emailUpdated: true})
    } catch (error) {
        res.send({msg: `At updateUsername: ${error}`})
    };
};

exports.updateMoney = async(req, res)=>{
    try {
        await User.updateOne({username: req.user.username}, {money: req.body.newMoney});
        res.send({msg: `User ${req.user.username} money updated.`, moneyUpdated: true});
    } catch (error) {
        res.send({msg: `At updateMoney: ${error}`})
    };
};

exports.deleteUser = async (req, res) => {
    try {
        await User.deleteOne({username: req.user.username})
        res.send({msg: `Delete successful: ${req.user.username}`, deleted: true})
    } catch (error) {
        res.send(`Error at deleteUser: ${error}`)
    };
};