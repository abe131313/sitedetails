// Importing the JSON Web Token (JWT) library to verify tokens
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Retrieve the token from the 'x-auth-token' header in the request
  const token = req.header('x-auth-token');

  // Check if there is no token present in the request header
  if (!token) {
    // If no token is found, send a 401 Unauthorized response with a message
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    // Verify the token using the secret key 'yirigaacluster321pittstreet'
    const decoded = jwt.verify(token, 'yirigaacluster321pittstreet'); // The same secret key used to generate the token

    // Attach the decoded user information to the request object
    req.user = decoded.user;

    // Move on to the next middleware or route handler
    next();
  } catch (err) {
    // If the token is invalid, send a 401 Unauthorized response with a message
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
