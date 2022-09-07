const User = require('./model');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");

exports.createUser = async(req, res) => {
    try {
        if(!req.body.username && !req.body.pass && !req.body.email){
            throw new Error('Missing information: Please include username, password & email address.')
        };
        const newUser = await User.create(req.body);
        const token = await jwt.sign({_id:newUser._id}, process.env.SECRET)
        if (!token || !newUser) {
            throw new Error("An error occured when creating a new user.")
        }
        res.status(200).send({
            msg: `new user created: ${newUser.username}.`, 
            user: {
                username: newUser.username,
                email: newUser.email,
                cash: newUser.cash,
                stocks: newUser.stocks,
                history: newUser.history
            }, Token: token});
    } catch (error) {
        res.status(500).send({err: `Error at CreateUser: ${error}`})
    };
};

exports.login = async (req, res) => {
    try {
        const user = await User.findOne({username: req.user.username});
        const token = await jwt.sign({_id:user._id}, process.env.SECRET)
        if (!user || !token) {
            throw new Error("No user found.")
        }
        res.status(200).send({
            msg: `You have logged in successfully. Welcome, ${user.username}.`, 
            user: {
                username: user.username,
                email: user.email,
                cash: user.cash,
                stocks: user.stocks,
                history: user.history
            }, Token: token});
    } catch (error) {
        res.status(500).send({err: `Error at login: ${error.message}`});
    };
};

exports.updateUser = async (req, res) => {
    console.log("Request recieved by updateUser.");
    try {
      let result
      if (req.body.newPassword) {
        console.log("Patching password.");
        const newPassword = await bcrypt.hash(req.body.newPassword, 8)
        result = await User.updateOne({ username: req.user.username }, { password: newPassword })
      } else if (req.body.newEmail) {
        console.log("Patching email.");
        result = await User.updateOne({ username: req.user.username }, { email: req.body.newEmail })
      } else if (req.body.newUsername) {
        console.log("Patching username.");
        result = await User.updateOne({ username: req.user.username }, { username: req.body.newUsername })
      }
      if (!result) {
        throw new Error("Incorrect credentials.")
      }
      res.status(200).send({ msg: "Request processed.", result });
    } catch (error) {
      console.log(error);
      res.status(500).send({ err: error.message });
    }
  }

exports.deleteUser = async (req, res) => {
    try {
        const result = await User.deleteOne({username: req.user.username})
        if (!result) {
            throw new Error("Incorrect credentials.")
        }
        res.status(200).send({msg: `Delete successful: ${req.user.username}`, deleted: true})
    } catch (error) {
        res.status(500).send({err: `Error at deleteUser: ${error.message}`})
    };
};

exports.updateCash = async(req, res)=>{
    try {
        if(!req.body.newCash){
            throw new Error("Missing New Cash Value.")
        }
        const cash = to2dp(req.body.newCash)
        const result = await User.updateOne({username: req.user.username}, {cash: cash});
        if (!result) {
            throw new Error("An error occured whilst updating the user.")
        }
        res.status(200).send({msg: `User ${req.user.username} cash updated.`, cashUpdated: cash});
    } catch (error) {
        res.status(500).send({msg: `At updateCash: ${error.message}`})
    };
};

exports.addStock = async (req, res) => {
    try {
        if(!req.body.addStock.name && !req.body.addStock.symbol && !req.body.addStock.number){
            throw new Error('Missing value/s: name, symbol & number are required.')
        }
        if(typeof(req.body.addStock.number) !== 'number'){
            throw new Error('Stock quantity must be a number.')
        }
        const stocks = req.user.stocks
        const newStock = req.body.addStock
        let result;
                // 1. if the new stock is in stocks increase the quantity 
        if (stocks.some( x => x.name === req.body.addStock.name)) {
            const userStocks = req.user.stocks
            const userStock = userStocks.find( el => el.name === newStock.name )
            userStock.number = to2dp(userStock.number + newStock.number)
            let updatedStocks
            if (userStock.number > 0) {
                // a. if the quantity is greater than 0, update stocks                        
                updatedStocks = userStocks.map( el => el.name === newStock.name ? userStock : el )
            } else {
                // b. otherwise remove the stock
                updatedStocks = userStocks.filter( el => el !== userStock )
            }  
            result = await User.updateOne({ username: req.user.username }, { stocks: updatedStocks })
            req.user.stocks = updatedStocks;
        } else { 
        // 2. otherwise add the stock to stocks
        result = await User.updateOne({ username: req.user.username }, { $addToSet: { stocks : req.body.addStock } })
        req.user.stocks.push(req.body.addStock)
        }
        if (!result) {
            throw new Error("Incorrect credentials.")
        }
        res.status(200).send({ msg: "Request processed.", user: req.user });
    } catch (error) {
        console.log(error);
        res.status(500).send({ err: `Error at AddStock: ${error.message}`});
    }
}

exports.addHistory = async(req, res)=> {
    try {
        if(!req.body.symbol || !req.body.number || !req.body.price || typeof req.body.buy !== "boolean"){
            throw new Error('Missing field/s.')
        }
        const d = new Date()
        const transaction = {
            symbol: req.body.symbol,
            price: to2dp(req.body.price),
            quantity: to2dp(req.body.number),
            total: to2dp(req.body.number * req.body.price),
            buy: req.body.buy,
            timeStamp: `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`,
        }
        const result = await User.updateOne({username: req.user.username}, {$push: {history: transaction}})
        if (!result) {
            throw new Error("Unable to append transaction.")
        }
        res.status(200).send({msg:`History entry successfully added.`, transaction: transaction, user: req.user })
    } catch (error) {
        res.status(500).send({err: `Error at addHistory: ${error.message}`})
        console.log(error)
    }
}

const to2dp = (num) => {
    return parseFloat((Math.round((num) * 100) / 100).toFixed(2))
}
