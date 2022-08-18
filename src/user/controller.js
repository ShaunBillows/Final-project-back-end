const User = require('./model');
const jwt = require('jsonwebtoken');

exports.createUser = async(req, res) => {
    try {
        if(req.body.username && req.body.pass && req.body.email){
            const newUser = await User.create(req.body);
            const token = await jwt.sign({_id:newUser._id}, process.env.SECRET)
            res.status(200).send({msg: `new user created: ${newUser.username}.`, Token: token});
        } else {
            throw new Error('Missing information: Please include username, password & email address.')
        };
    } catch (error) {
        res.status(500).send({err: `Error at CreateUser: ${error}`})
    };
};

exports.login = async (req, res) => {
    try {
        const user = await User.findOne({username: req.user.username});
        const token = await jwt.sign({_id:user._id}, process.env.SECRET)
        res.status(200).send({msg: `You have logged in successfully. Welcome, ${user.username}.`, token: token})
    } catch (error) {
        res.status(500).send({err: `Error at login: ${error.message}`});
    };
};

exports.updateEmail = async (req, res) => {
    try {
        if(req.body.newEmail){
            await User.updateOne({username: req.user.username}, {email: req.body.newEmail} )
            res.status(200).send({msg: `User ${req.user.username} email updated.`, emailUpdated: true})
        } else {
            throw new Error('Missing New Email.')
        }
    } catch (error) {
        res.status(500).send({err: `Error at updateEmail: ${error.message}`});
    };
};

exports.updatePassword = async(req, res) => {
    try {
        if(req.body.newPass){
            await User.updateOne({username: req.user.username}, {pass: req.body.newPass});
            res.status(200).send({msg: `User ${req.user.username} password updated.`, passUpdated: true})
        } else {
            throw new Error('Missing New Password.')
        };
    } catch (error) {
        res.status(500).send({err: `Error at updatePass: ${error.message}`});
    };
};

exports.updateUsername = async(req, res) =>{
    try {
        if(req.body.newUsername){
            await User.updateOne({username: req.user.username}, {username: req.body.newUsername});
            res.status(200).send({msg: `User ${req.user.username} username updated.`, userUpdated: true})
        } else {
            throw new Error('Missing New Username')
        };
    } catch (error) {
        res.status(500).send({msg: `At updateUsername: ${error.message}`})
    };
};

exports.updateCash = async(req, res)=>{
    try {
        if(req.body.newCash){
            await User.updateOne({username: req.user.username}, {cash: req.body.newCash});
            res.status(200).send({msg: `User ${req.user.username} cash updated.`, cashUpdated: true});
        } else {
            throw new Error('Missing New Cash Value.')
        }
    } catch (error) {
        res.status(500).send({msg: `At updateCash: ${error.message}`})
    };
};

exports.deleteUser = async (req, res) => {
    try {
        await User.deleteOne({username: req.user.username})
        res.status(200).send({msg: `Delete successful: ${req.user.username}`, deleted: true})
    } catch (error) {
        res.status(500).send({err: `Error at deleteUser: ${error.message}`})
    };
};

exports.addStock = async (req, res) => {
    // adds stocks to the user
    console.log("Request recieved by addStock.");
    try {
      let result
      if (req.user.stocks.some( x => JSON.parse(x).symbol === req.body.addStock.symbol )) { 
        // 1. if the new stock is in stocks, increment/decrement the quantity 
        console.log("Updating stocks.");
        const newStock = req.body.addStock
        const userStocks = req.user.stocks.map( el => JSON.parse(el))
        const updateStock = userStocks.find( el => el.symbol === newStock.symbol )
        updateStock.quantity = updateStock.quantity + newStock.quantity // update the quantity
        const updatedStocks = userStocks.map( el => el.symbol === newStock.symbol ? [ JSON.stringify(updateStock)] : [JSON.stringify(el)] )
        result = await User.updateOne({ username: req.user.username }, { stocks: updatedStocks })
        console.log(result)
        console.log(userStocks)
       } else { 
        // 2. otherwise push the new stock to stocks
        console.log("Adding new stock.");
        result = await User.updateOne({ username: req.user.username }, { $addToSet: { stocks : [JSON.stringify(req.body.addStock)] } })
        console.log(result);
       }
       if (!result) {
          throw new Error("Error adding stocks.")
       } else {
          res.status(200).send({ msg: "Request processed.", result });
       }
    } catch (error) {
      console.log(error);
      res.status(500).send({ err: error.message });
    }
  }
  