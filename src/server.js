require("./db/connection");
const express = require("express");
const userRouter = require("./user/routes");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5001;

app.use(express.json());
app.use(cors());
app.use(userRouter);

app.listen(process.env.PORT || port, () => {
  console.log(`listening on port ${port}`);
});
