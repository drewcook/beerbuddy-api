const auth = require('../middleware/auth');
const checkAdmin = require('../middleware/checkAdmin');
const validate = require('../middleware/validate');
const validateObjectId = require('../middleware/validateObjectId');
const { Genre, validate: validateGenre } = require('../models/Genre');
const express = require('express');
const router = express.Router();

const notFoundMsg = 'The genre with the given ID was not found.';

// Get all genres
router.get('/', async (req, res) => {
  const genres = await Genre.find().sort({ name: 1 });
  res.send(genres);
});

// Get single genre
router.get('/:id', validateObjectId, async (req, res) => {
  const genre = await Genre.findById(req.params.id);
  if (!genre) return res.status(404).send(notFoundMsg);

  res.send(genre);
});

// Create genre
// authenticated endpoint
router.post('/', [auth, validate(validateGenre)], async (req, res) => {
  const genre = new Genre({
    name: req.body.name,
  });

  const result = await genre.save();
  res.send(result);
});

// Update genre
router.put('/:id', [auth, validate(validateGenre)], async (req, res) => {
  const { name } = req.body;
  const updatedGenre = await Genre.findByIdAndUpdate(req.params.id, {
    $set: { name },
  }, { new: true });

  if (!updatedGenre) return res.status(404).send(notFoundMsg);

  res.send(updatedGenre);
});

// Delete genre
// Must be an admin, use checkAdmin middleware
router.delete('/:id', [auth, checkAdmin], async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id);
  if (!genre) return res.status(404).send(notFoundMsg);

  res.send(genre);
});

module.exports = router;
