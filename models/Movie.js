const Joi = require('joi');
const mongoose = require('mongoose');
const { genreSchema } = require('./Genre');

// Validate the incoming client payload
const validateMovie = (movie) => {
  const schema = Joi.object({
    title: Joi.string().min(5).max(255).required(),
    genreId: Joi.objectId().required(),
    numberInStock: Joi.number().min(0).required(),
    dailyRentalRate: Joi.number().min(0).required(),
  });

  return schema.validate(movie);
};

const Movie = mongoose.model('Movie', new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minLength: 5,
    maxLength: 255,
  },
  genre: {
    type: genreSchema,
    required: true,
  },
  numberInStock: {
    type: Number,
    required: true,
    min: 0,
    max: 255,
  },
  dailyRentalRate: {
    type: Number,
    required: true,
    min: 0,
    max: 255,
  },
}));

module.exports = {
  Movie,
  validate: validateMovie,
};
