// This is custom middleware to handle validating against the Joi schema
// This takes in a validator fn that is unique the the schema tested
module.exports = (validator) => (req, res, next) => {
  const { error } = validator(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  next();
};
