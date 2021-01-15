const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/userModel');

router.get('/test', (req, res) => {
  res.json({
    answer:
      'What an lovely day. But, alas, I am DEHYDRATION, so I need DRINCC. THANCC! But who give drincc? Still a mystery it is...',
  });
});

router.post('/register', async (req, res) => {
  try {
    const {email, password, repeatPassword} = req.body;
    let {displayName} = req.body;

    // check if you've actually received the data
    if (!email || !password || !repeatPassword) {
      return res.status(400).json({
        msg: 'not all fields have been received',
      });
    }
    if (password !== repeatPassword) {
      return res
        .status(400)
        .json({msg: 'Password and Repeat Password fields are different'});
    }
    // check is the password is at least 5 chars long
    if (password.length < 5) {
      return res.status(400).json({
        msg: `Password too short: ${password.length} characters long. Expected at least 5 characters long`,
      });
    }
    // check if there is already somebody with an account
    const existingUser = await User.findOne({email: email});
    if (existingUser) {
      return res
        .status(400)
        .json({msg: `User with email ${email} already exists`, existingUser});
    }

    // if the user hasn't specified any displayName, assign email to displayName
    if (!displayName) {
      displayName = email;
    }

    // hash the password so that evil hackers cannot steal it
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    console.log(passwordHash);

    // save the user to the database
    const newUser = new User({email, password: passwordHash, displayName});
    const savedUser = await newUser.save();
    res
      .status(200)
      .json({msg: `User ${displayName} was added to database`, savedUser});
  } catch (err) {
    res.status(500).json({msg: 'Internal server error: ' + err.message});
  }
});

router.post('/login', async (req, res) => {
  try {
    const {email, password} = req.body;
    // check if you've actually received the data
    if (!email || !password) {
      return res.status(400).json({
        msg: 'not all fields have been received',
      });
    }
    const user = await User.findOne({email});
    if (!user) {
      return res
        .status(400)
        .json({msg: `User with email ${email} doesn't exist`});
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({msg: `Incorrect password for user ${user.displayName}`});
    }

    res.status(200).send({msg: 'Login successful'});
  } catch (err) {
    res.status(500).json({msg: 'Internal server error: ' + err.message});
  }
});

module.exports = router;
