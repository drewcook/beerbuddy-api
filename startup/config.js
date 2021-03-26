const config = require('config');

const setupConfig = () => {
  if (!config.get('VIDLY_APP_SECRET')) {
    throw new Error('FATAL ERROR: VIDLY_APP_SECRET is not defined.')
  };
};

module.exports = setupConfig;
