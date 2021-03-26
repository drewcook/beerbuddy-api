const Joi = require('joi');
const express = require('express');
const router = express.Router();
const { Rental } = require('../models/Rental');
const { Movie } = require('../models/Movie');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');

const validateReturn = (req) => {
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  });

  return schema.validate(req);
};

// Create a return
router.post('/', [auth, validate(validateReturn)], async (req, res) => {
  const { customerId, movieId } = req.body;
  const rental = await Rental.lookup({ customerId, movieId });
  if (!rental) return res.status(404).send('Rental not found');

  if (rental.dateReturned) return res.status(400).send('Return already processed');

  // handle the return side effects
  rental.return();

  await rental.save();

  // increase movie stock
  await Movie.updateOne({ _id: rental.movie._id }, {
    $inc: { numberInStock: 1 }
  });

  return res.send(rental);
});

module.exports = router;
