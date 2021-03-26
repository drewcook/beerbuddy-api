 const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { Rental, validate: validateRental } = require('../models/Rental');
const { Customer } = require('../models/Customer');
const { Movie } = require('../models/Movie');
const Fawn = require('fawn');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

Fawn.init(mongoose);

// Get list of rentals
router.get('/', async (req, res) => {
  try {
    const rentals = await Rental.find().sort({ dateOut: -1 });
    return res.send(rentals);
  }
  catch (ex) {
    return res.status(500).send(ex.errors);
  }
});

// Create new rental
router.post('/', [auth, validate(validateRental)], async (req, res) => {
  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(404).send('Customer with given ID not found.');

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(404).send('Movie with given ID not found.');

  if (movie.numberInStock === 0) return res.status(400).send('Movie is not in stock.');

  const rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
      isGold: customer.isGold,
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
  });

  try {
    // Use Fawn to setup transactions
    // Require both tasks to complete before succeeding
    // See: Two Phase Commits
    await Fawn.Task()
      .save('rentals', rental)
      .update('movies', { _id: movie._id }, {
        $inc: { numberInStock: -1 }
      })
      .run()
      .then(results => res.send(rental));
  }
  catch (ex) {
    res.status(500).send(`Something went wrong: ${ex.errors}`);
  }
});

module.exports = router;
