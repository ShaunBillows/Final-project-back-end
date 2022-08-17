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

// exports.addStock = async (req, res) => {
//   // updates user info
//   console.log("Request recieved by addStock.");
//   const stocks = req.user.stocks
//   const user = req.user.stocks 
//   const newStock = req.body.addStock
//   try {
//     let result
//     if (stocks.some( x => JSON.parse(x).stock === newStock.stock)) { 
//         // 1. if the new stock is in stocks increment the quantity 
//         const userStocks = user.map( el => JSON.parse(el))
//         const userStock = userStocks.find( el => el.stock === newStock.stock )
//         // update stock quantity
//         userStock.quantity = userStock.quantity + newStock.quantity
//         const updatedStocks = userStocks.map( el => el.stock === newStock.stock ? [ JSON.stringify(userStock)] : [JSON.stringify(el)] )
//         result = await User.updateOne({ username: req.user.username }, { stocks: updatedStocks })
//      } else { 
//         // 2. otherwise add the stock to stocks
//         console.log("Adding new stock");
//         result = await User.updateOne({ username: req.user.username }, { $addToSet: { stocks : [JSON.stringify(req.body.addStock)] } })
//         console.log(result);
//      }
//       res.status(200).send({ msg: "Request processed.", result });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({ err: error.message });
//   }
// }


exports.addStock = async (req, res) => {
    // updates user info
    console.log("Request recieved by addStock.");
    try {
  
      const stocks = req.user.stocks
      const newStock = req.body.addStock

      let result
      // 1. if the new stock is in stocks increase the quantity 
      if (stocks.some( x => JSON.parse(x).stock === req.body.addStock.stock)) { 
  
        const user = req.user.stocks
        const userStocks = user.map( el => JSON.parse(el))
        const userStock = userStocks.find( el => el.stock === newStock.stock )
        userStock.quantity = userStock.quantity + newStock.quantity
        const updatedStocks = userStocks.map( el => el.stock === newStock.stock ? [ JSON.stringify(userStock)] : [JSON.stringify(el)] )
  
        result = await User.updateOne({ username: req.user.username }, { stocks: updatedStocks })
        console.log(result)
        console.log(userStocks)

  
       } else { 
        // 2. otherwise add the stock to stocks
        console.log("Adding new stock");
        result = await User.updateOne({ username: req.user.username }, { $addToSet: { stocks : [JSON.stringify(req.body.addStock)] } })
        console.log(result);
        console.log(userStocks)
       }
  
  
      // console.log(object);
      // if (result) {
        // console.log(result)
        res.status(200).send({ msg: "Request processed.", result });
      // } else {
      //   throw new Error("No user found.")
      // }
    } catch (error) {
      console.log(error);
      res.status(500).send({ err: error.message });
    }
  }