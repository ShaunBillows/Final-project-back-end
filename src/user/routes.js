const { Router } = require('express');
const userRouter = Router();
const { createUser } = require('./controller');
const { hashPass } = require('../middleware');

userRouter.post('/user', hashPass, createUser)

module.exports = userRouter;