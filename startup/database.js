const config = require('config');
const mongoose = require('mongoose');
const { logger } = require('../startup/logging');

const setupDb = () => {
  const db = config.get('MONGODB_CONNECTION_STRING');
  // Connect to the local mongoDB instance
  mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
    .then(() => logger.info(`Connected to ${db}...`));
};

module.exports = setupDb;
