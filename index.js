const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const chalkAnimation = require('chalk-animation');

const app = express();
const PORT = process.env.PORT || 5000;
const {MONGODB_CONNECTION_STRING} = process.env

app.use(express.json());
app.use(cors());



mongoose.connect(
  MONGODB_CONNECTION_STRING,
  {useUnifiedTopology: true, useNewUrlParser: true},
  (err) => {
    if (err) throw err;
    console.log('Connection to MONGODB successful :)'); // Animation starts
  }
);

app.listen(PORT, () => {
  chalkAnimation.rainbow('The server has started on port ' + PORT);
});