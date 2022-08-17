const { Router } = require('express');
const userRouter = Router();
const { createUser, deleteUser, login, updateEmail, updatePassword, updateUsername, updateMoney,  } = require('./controller');
const { hashPass, checkPass, checkToken } = require('../middleware');

userRouter.post('/user', hashPass, createUser);
userRouter.delete('/user', checkPass, deleteUser);
userRouter.post('/login', checkPass, login);
userRouter.get('/login', checkToken, login);
userRouter.patch('/update-email', checkPass, updateEmail);
userRouter.patch('/update-pass', checkPass, hashPass, updatePassword);
userRouter.patch('/update-user', checkPass, updateUsername);
userRouter.patch('/update-money', checkToken, updateMoney);

module.exports = userRouter;