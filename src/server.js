require('./db/connection');
const express = require('express');
const userRouter = require('./user/routes');
const app = express();
const cors = require('cors')

app.use(express.json());
app.use(cors())
app.use(userRouter);

app.listen(5001, ()=>{
    console.log('listening on port 5001')
})