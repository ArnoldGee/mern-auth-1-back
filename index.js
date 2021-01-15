const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const chalkAnimation = require('chalk-animation');

const app = express();
const PORT = process.env.PORT || 5000;
const {MONGODB_CONNECTION_STRING} = process.env

// connect to mongodb atlas
mongoose.connect(
  MONGODB_CONNECTION_STRING,
  {useUnifiedTopology: true, useNewUrlParser: true},
  (err) => {
    if (err) throw err;
    console.log('Connection to MONGODB successful :)'); // Animation starts
  }
);

// add express middleware
app.use(express.json());
app.use(cors());

// set up routes middleware
app.use('/users', require('./routes/userRouter'))

// listen to port
app.listen(PORT, () => {
  chalkAnimation.rainbow('The server has started on port ' + PORT);
});