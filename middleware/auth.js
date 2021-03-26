const jwt = require('jsonwebtoken');
const config = require('config');

const auth = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).send('Access denied. No token provided.');

  try {
    // jwt.verify() will either return the payload or throw an error
    const decoded = jwt.verify(token, config.get('BEERBUDDY_APP_SECRET'));
    req.user = decoded;
    next();
  }
  catch (ex) {
    res.status(400).send('Invalid token provided.');
  }
};

module.exports = auth;
