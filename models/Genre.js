const Joi = require('joi');
const mongoose = require('mongoose');

const validateGenre = (genre) => {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
  });

  return schema.validate(genre);
};

const genreSchema = new mongoose.Schema({
  name: {
    type: 'String',
    // enum: ['action', 'adventure', 'comedy', 'drama', 'documentary', 'horror', 'sci-fi', 'thriller'],
    required: true,
    minLength: 5,
    maxLength: 50,
  },
});

const Genre = mongoose.model('Genre', genreSchema);

module.exports = {
  Genre,
  genreSchema,
  validate: validateGenre,
};
