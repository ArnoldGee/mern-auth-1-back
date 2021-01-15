const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const auth = require('../middleware/auth');
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

    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
    res.status(200).send({
      msg: 'Login successful',
      token,
      user: {
        id: user._id,
        displayName: user.displayName,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({msg: 'Internal server error: ' + err.message});
  }
});

router.delete('/delete', auth, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.userId);
    if (!deletedUser) {
      res.status(400).json({
        msg: `No user with id ${req.userId} was registered in our database, so no user was deleted.`,
      });
    }
    res.status(200).json({
      msg: `User ${deletedUser.displayName} successfully deleted`,
      deletedUser,
    });
  } catch (err) {
    res.status(500).json({msg: 'Internal server error: ' + err.message});
  }
});

router.post('/tokenIsValid', async (req, res) => {
  try {
    const token = req.header('x-auth-token');
    if (!token) return res.status(200).json(false);
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) return res.status(200).json(false);
    const user = User.findById(verified.id);
    if (!user) return res.status(200).json(false);
    res.status(200).json(true);
  } catch (err) {
    res.status(500).json({msg: 'Internal server error: ' + err.message});
  }
});

module.exports = router;
