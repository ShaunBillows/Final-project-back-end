const bcrypt = require('bcryptjs');

exports.hashPass = async(req, res, next) => {
    try {
        // const pass = req.body.password; //grab value
        // const hashedPass = await bcrypt.hash(pass, 8); //hash value
        // req.body.password = hashedPass; //re-store value
        req.body.pass = await bcrypt.hash(req.body.pass, 8); //Does all of the above at once.
        next();
    } catch (error) {
        console.log(error)
        res.send({ err: `Error at hashPass: ${error} `})
    };
};