// BreweryDB API endpoints
const axios = require('axios')
const auth = require('../middleware/auth')
const express = require('express')
const router = express.Router()
require('dotenv').config()
const BREWERYDB_API_HOST = process.env.BREWERYDB_API_HOST
const BREWERYDB_SANDBOX_API_HOST = process.env.BREWERYDB_SANDBOX_API_HOST
const BREWERYDB_API_KEY = process.env.BREWERYDB_API_KEY
const USE_SANDBOX_API = process.env.USE_SANDBOX_API

// Support for using the BreweryDB sandbox API instead
const BASE_URL = USE_SANDBOX_API === 'true' ? BREWERYDB_SANDBOX_API_HOST : BREWERYDB_API_HOST
const KEY_PARAM = USE_SANDBOX_API === 'true' ? '' : `?key=${BREWERYDB_API_KEY}`

// @desc Gets all beers
router.get('/beer', auth, async (req, res) => {
	const url = `${BASE_URL}/beers${KEY_PARAM}&p=${req.body.page}&withBreweries=y`
	const response = await axios.get(url)
	res.send(response.data)
})

// @desc Gets a beer by ID
router.get('/beer/:id', auth, async (req, res) => {
	const url = `${BASE_URL}/beer/${req.params.id}${KEY_PARAM}&withBreweries=y`
	const response = await axios.get(url)
	res.send(response.data)
})

// @desc Gets all breweries
router.get('/breweries', auth, async (req, res) => {
	const url = `${BASE_URL}/breweries${KEY_PARAM}&p=${req.body.page}&withLocations=y`
	const response = await axios.get(url)
	res.send(response.data)
})

// @desc Gets a brewery by ID
router.get('/brewery/:id', auth, async (req, res) => {
	const url = `${BASE_URL}/brewery/${req.params.id}${KEY_PARAM}&withLocations=y&withGuilds=y&withSocialAccounts=y`
	const response = await axios.get(url)
	res.send(response.data)
})

// @desc Gets all glassware types
router.get('/glassware', auth, async (req, res) => {
	const url = `${BASE_URL}/glassware${KEY_PARAM}`
	const response = await axios.get(url)
	res.send(response.data)
})

// @desc Gets both breweries and beers based off of a query
router.post('/search', auth, async (req, res) => {
	const url = `${BASE_URL}/search${KEY_PARAM}&q=${req.body.query}&p=${req.body.page}&withBreweries=y&withLocations=y`
	const response = await axios.get(url)
	res.send(response.data)
})

// @desc Gets all breweries based off of a brewery type
// 'macro', 'micro', 'brewpub', 'office', 'production', 'restaurant', 'tasting'
router.post('/filter/breweries', auth, async (req, res) => {
	const url = `${BASE_URL}/locations${KEY_PARAM}&locationType=${req.body.type}&p=${req.body.page}`
	const response = await axios.get(url)
	res.send(response.data)
})

// @desc Gets all breweries and beers based off of a country
// uses country ISO codes
router.post('/filter/location/countries', auth, async (req, res) => {
	const url = `${BASE_URL}/locations${KEY_PARAM}&countryIsoCode=${req.body.country}&p=${req.body.page}`
	const response = await axios.get(url)
	res.send(response.data)
})

// @desc Gets all breweries and beers based off of a US state
// uses state ISO codes
router.post('/filter/location/states', auth, async (req, res) => {
	const url = `${BASE_URL}/locations${KEY_PARAM}&region=${req.body.state}&p=${req.body.page}`
	const response = await axios.get(url)
	res.send(response.data)
})

module.exports = router
