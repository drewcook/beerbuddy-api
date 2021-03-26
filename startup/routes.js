const express = require('express');
const homepage = require('../routes/homepage');
const genres = require('../routes/genres');
const movies = require('../routes/movies');
const customers = require('../routes/customers');
const rentals = require('../routes/rentals');
const users = require('../routes/users');
const auth = require('../routes/auth');
const returns = require('../routes/returns');
const logError = require('../middleware/logError');

const setupRoutes = (app) => {
  // Built-in Express middleware
  app.use(express.json()); // parses req.body
  // key=value&key=value, parses this and populates req.body in json
  app.use(express.urlencoded({ extended: true }));
  // uses a static folder for assets, and provides a route to view the assets
  // for example http://localhost:3000/public/readme.txt
  app.use(express.static('public'));

  // Setup API routes
  app.use('/', homepage);
  app.use('/api/genres', genres);
  app.use('/api/movies', movies);
  app.use('/api/customers', customers);
  app.use('/api/rentals', rentals);
  app.use('/api/users', users);
  app.use('/api/auth', auth);
  app.use('/api/returns', returns);

  // Custom middleware functions, called in sequence
  // always define in separate file from index.js
  // Add in error handling middleware LAST after API middleware
  // We will use next(ex) in catch blocks to call this
  app.use(logError);
};

module.exports = setupRoutes;
