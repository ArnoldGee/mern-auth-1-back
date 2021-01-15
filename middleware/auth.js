const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    const token = req.header('x-auth-token');


    if (!token)
      return res
        .status(401)
        .json({msg: 'No authentication token provided, auth denied'});
    
    // we  check if the user has provided a correct token
    const verified = jwt.verify(token, process.env.JWT_SECRET)
    if(!verified) return res
      .status(401)
      .json({msg: 'Token verification failed, auth denied'});


    // we add a new parameter to the request
    req.userId = verified.id

    next();
  } catch (err) {
    res.status(500).json({msg: 'Internal server error: ' + err.message});
  }
};

module.exports = auth;