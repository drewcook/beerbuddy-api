const Joi = require('joi');

/*
  MongoDB ObjectId Notes:

  _id: 6039c3bef9a0bf8a3238e3e2

  12 bytes (24 chars)
    4 bytes: timestamp
    3 bytes: machine identifier
    2 bytes: process identifier
    3 bytes: counter

  1 byte = 8 bits
  2^8 = 256 numbers can be stored in one byte
  2^24 = 16M
  So ObjectIds are very unique! 1 in 16 million

  MongoDB Driver -> MongoDB
  Mongoose is an abstraction over MongoDB Driver, which creates the IDs
*/

const setupApiValidation = () => {
  Joi.objectId = require('joi-objectid')(Joi);
};

module.exports = setupApiValidation;
