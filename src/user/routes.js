const { Router } = require("express");
const userRouter = Router();
const {
  createUser,
  deleteUser,
  login,
  updateUser,
  updateCash,
  addStock,
  addHistory,
} = require("./controller");
const { hashPass, checkPass, checkToken } = require("../middleware");

userRouter.get("/login", checkToken, login);
userRouter.post("/login", checkPass, login);
userRouter.post("/user", hashPass, createUser);
userRouter.delete("/user", checkToken, deleteUser);
userRouter.patch("/user", checkToken, checkPass, updateUser);
userRouter.patch("/user/stocks", checkToken, addStock, updateCash, addHistory);

module.exports = userRouter;
