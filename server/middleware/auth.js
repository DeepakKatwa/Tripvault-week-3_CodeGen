// REFERENCE ONLY — you likely already have this from Week 1.
// If your existing middleware/auth.js sets req.user differently
// (e.g. req.user._id instead of req.user.id), keep YOUR version
// and just make sure tripController.js below matches it.

const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // decoded should contain { id: userId } from when the token was signed at login
    req.user = { id: decoded.id };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Not authorized, token invalid or expired' });
  }
};

module.exports = protect;
