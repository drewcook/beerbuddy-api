const auth = require('../middleware/auth');
const checkAdmin = require('../middleware/checkAdmin');
const validate = require('../middleware/validate');
const { Movie, validate: validateMovie } = require('../models/Movie');
const { Genre } = require('../models/Genre');
const express = require('express');
const router = express.Router();

const notFoundMsg = 'The movie with the given ID was not found.';

// Get all movies
router.get('/', async (req, res) => {
  try {
    const movies = await Movie.find().sort({ name: 1 });
    return res.send(movies);
  }
  catch (ex) {
    for (field in ex.errors) {
      console.log(ex.errors[field].message);
    }
    return res.status(500).send(ex.errors);
  }
});

// Get single movie
router.get('/:id', async (req, res) => {
    const movie = await Movie.findById(req.params.id);

    if (!movie) return res.status(404).send(notFoundMsg);

    res.send(movie);
});

// Create movie
// Embedding Genre within the Movie as subdocument
router.post('/', [auth, validate(validateMovie)], async (req, res) => {
  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send('Invalid genre.');

  const movie = new Movie({
    title: req.body.title,
    // embedding, selectively set properties, not all
    genre: {
      _id: genre._id,
      name: genre.name,
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  });

  try {
    const result = await movie.save();
    return res.send(result);
  }
  catch (ex) {
    for (field in ex.errors) {
      console.log(ex.errors[field].message);
    }
    return res.status(500).send(ex.errors);
  }
});

// Update movie
router.put('/:id', [auth, validate(validateMovie)], async (req, res) => {
  try {
    const { title, genre } = req.body;
    const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, {
      $set: { title, genre },
    }, { new: true });

    if (!updatedMovie) return res.status(404).send(notFoundMsg);

    res.send(updatedMovie);
  }
  catch (ex) {
    for (field in ex.errors) {
      console.log(ex.errors[field].message);
    }
    return res.status(500).send(ex.errors);
  }
});

// Delete movie
router.delete('/:id', [auth, checkAdmin], async (req, res) => {
  try {
    const movie = await Movie.findByIdAndRemove(req.params.id);
    if (!movie) return res.status(404).send(notFoundMsg);

    res.send(movie);
  }
  catch (ex) {
    for (field in ex.errors) {
      console.log(ex.errors[field].message);
    }
    return res.status(500).send(ex.errors);
  }
});

module.exports = router;