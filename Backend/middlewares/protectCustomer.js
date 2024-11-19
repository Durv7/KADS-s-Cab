const jwt = require('jsonwebtoken');
const User = require('../Models/user.model.js');


// Protect routes by verifying the JWT from the cookie
const protectCustomer = async (req, res, next) => {
  let token;
 
  

  // Check for JWT in cookies
  if (req.cookies.kads_token) {
    try {
      // Verify token
      token = req.cookies.kads_token;
      const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
      let id = decoded._id;
      // Get user from the token
      let user = await User.findById(id).select('-password');
      if(!user) return res.status(401).json({message:'Not authorized, token failed'})

      req.user = user;

      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed',
        err:error,
      });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protectCustomer };
