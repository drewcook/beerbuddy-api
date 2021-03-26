const { logger } = require('../startup/logging');

const logError = (err, req, res, next) => {
  // error
  // warning
  // info
  // verbose
  // debug
  // silly
  logger.error(err.message, { metadata: err.stack });
  res.status(500).send('Something failed.');
};

module.exports = logError;
