const express = require('express')
const cors = require('cors')
const logError = require('../middleware/logError')
const homepage = require('../routes/homepage')
const users = require('../routes/users')
const auth = require('../routes/auth')
const lists = require('../routes/lists')
const breweryDb = require('../routes/breweryDb')

const setupRoutes = app => {
	// Support CORS since our client will be at a different origin(s)
	const prodWhitelist = [
		'https://beerbuddy-web.herokuapp.com',
		'https://beerbuddy.io',
		'http://beerbuddy.io',
		'https://www.beerbuddy.io',
		'http://www.beerbuddy.io',
	]
	const devWhiteList = ['http://localhost:3000']
	const whitelist = process.env.NODE_ENV === 'production' ? prodWhitelist : devWhiteList
	const corsOptions = {
		origin: (origin, callback) => {
			const serverToServerRequest = !origin
			if (whitelist.indexOf(origin) !== -1 || serverToServerRequest) {
				callback(null, true)
			} else {
				callback(new Error(`Origin not allowed by CORS - ${origin}`))
			}
		},
		credentials: true,
	}
	app.use(cors(corsOptions))

	// Built-in Express middleware
	app.use(express.json()) // parses req.body
	// key=value&key=value, parses this and populates req.body in json
	app.use(express.urlencoded({ extended: true }))
	// uses a static folder for assets, and provides a route to view the assets
	// for example http://localhost:3000/public/readme.txt
	app.use(express.static('public'))

	// Setup API routes
	app.use('/', homepage)
	app.use('/api/users', users)
	app.use('/api/auth', auth)
	app.use('/api/lists', lists)
	app.use('/api/brewerydb', breweryDb)

	// Custom middleware functions, called in sequence
	// always define in separate file from index.js
	// Add in error handling middleware LAST after API middleware
	// We will use next(ex) in catch blocks to call this
	app.use(logError)
}

module.exports = setupRoutes
