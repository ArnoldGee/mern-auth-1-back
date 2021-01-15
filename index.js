const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const chalkAnimation = require('chalk-animation');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());










app.listen(PORT, () => {
  chalkAnimation.rainbow('The server has started on port ' + PORT);
});
