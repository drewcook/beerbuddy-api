// This middleware will fire after authenticating, and check if the user is admin or not
const checkAdmin = (req, res, next) => {
  if (!req.user.isAdmin) return res.status(403).send('Access denied.');
  next();
};

module.exports = checkAdmin;
