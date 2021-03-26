const Joi = require('joi');
const mongoose = require('mongoose');
const { differenceInDays } = require('date-fns');

const validateRental = (rental) => {
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  });

  return schema.validate(rental);
};

const rentalSchema = new mongoose.Schema({
  // We may not want to use customerSchema and/or movieSchema
  // It could have 40 properties, so we create our own shema here.
  // We will populate this customer from customer data when POSTing.
  customer: {
    type: new mongoose.Schema({
      name: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 50,
      },
      isGold: {
        type: Boolean,
        default: false,
      },
      phone: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 50,
      },
    }),
    required: true,
  },
  movie: {
    type: new mongoose.Schema({
      title: {
        type: String,
        required: true,
        trim: true,
        minLength: 5,
        maxLength: 255,
      },
      dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255,
      },
    }),
    required: true,
  },
  dateOut: {
    type: Date,
    required: true,
    default: Date.now,
  },
  dateReturned: {
    type: Date
  },
  rentalFee: {
    type: Number,
    min: 0,
  },
});

// Create a static method to easily lookup the rental
// Cannot use arrow function to access 'this'
rentalSchema.statics.lookup = function({ customerId, movieId }) {
  return this.findOne({
    'customer._id': customerId,
    'movie._id': movieId,
  });
};

rentalSchema.methods.return = function() {
  // set return date
  this.dateReturned = new Date();

  // calculate rental fee
  // charge minimum 1 day if within 24 hours
  const rentalDays = differenceInDays(this.dateReturned, this.dateOut);
  this.rentalFee = rentalDays < 1 ? this.movie.dailyRentalRate : this.movie.dailyRentalRate * rentalDays;
};

const Rental = mongoose.model('Rental', rentalSchema);

module.exports = {
  Rental,
  validate: validateRental,
};
