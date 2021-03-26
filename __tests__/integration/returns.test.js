const request = require('supertest');
const { Rental } = require('../../models/Rental');
const { User } = require('../../models/User');
const { Movie } = require('../../models/Movie');
const mongoose = require('mongoose');
const { subDays } = require('date-fns');

// POST /api/returns { customerId, movieId }

// return 401 if client is not logged in
// return 400 if customerId or movieId is not of type ID, not provided
// return 404 if either customer or movie doesn't exist
// return 404 if no rental found for this customer/movie
// return 400 if rental already processed

// return 200 if movie and customer exist and no rental found for this combination
  // set the return date
  // calculate the rental fee
  // add the movie back in stock, increment
  // return the rental

describe('/api/returns', () => {
  let server;
  let rental;
  let customerId;
  let movie;
  let movieId;
  let token;

  const exec = async () => {
    return await request(server)
      .post('/api/returns')
      .set('x-auth-token', token)
      .send({ customerId, movieId });
  };

  beforeEach(async () => {
    // populate rental in db
    server = require('../../index');
    customerId = mongoose.Types.ObjectId();
    movieId = mongoose.Types.ObjectId();

    movie = new Movie({
      _id: movieId,
      title: '12345',
      dailyRentalRate: 2,
      genre: { name: '12345' },
      numberInStock: 10,
    });
    await movie.save();

    rental = new Rental({
      customer: {
        _id: customerId,
        name: '12345',
        phone: '12345',
      },
      movie: {
        _id: movieId,
        title: '12345',
        dailyRentalRate: 2,
      },
    });
    token = new User().generateAuthToken();
    await rental.save();
  });

  afterEach(async () => {
    await server.close();
    // cleanup
    await Rental.deleteMany({});
    await Movie.deleteMany({});
  });

  test('should return 401 if client is not logged in', async () => {
    token = '';
    const res = await exec();
    expect(res.status).toBe(401);
  });

  test('should return 400 if customerId is not provided', async () => {
    customerId = '';
    const res = await exec();
    expect(res.status).toBe(400);
  });

  test('should return 400 if movieId is not provided', async () => {
    movieId = '';
    const res = await exec();
    expect(res.status).toBe(400);
  });

  test('should return 404 if no rental found for customer/movie', async () => {
    await Rental.deleteMany({});
    const res = await exec();
    expect(res.status).toBe(404);
  });

  test('should return 400 if return is already processed', async () => {
    rental.dateReturned = new Date();
    rental.save();
    const res = await exec();
    expect(res.status).toBe(400);
  });

  test('should set the returned date if input is valid', async () => {
    await exec();
    const rentalInDb = await Rental.findById(rental._id);
    const diff = new Date() - rentalInDb.dateReturned;
    expect(diff).toBeLessThan(10 * 1000); // 10s
  });

  test('should set the rental fee if input is valid', async () => {
    rental.dateOut = subDays(new Date(), 7);
    await rental.save();
    await exec();
    const rentalInDb = await Rental.findById(rental._id);
    expect(rentalInDb.rentalFee).toBe(14);
  });

  test('should increase the stock for the movie if input is valid', async () => {
    await exec();
    const movieInDb = await Movie.findById(movieId);
    expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1);
  });

  test('should return the rental if input is valid', async () => {
    const res = await exec();
    expect(Object.keys(res.body)).toEqual(
      expect.arrayContaining(['dateOut', 'dateReturned', 'rentalFee', 'customer', 'movie'])
    );
  });
});
