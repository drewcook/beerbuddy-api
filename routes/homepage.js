const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
	res.writeHead(301, { Location: process.env.BEERBUDDY_CLIENT_HOST })
	res.end()
})

module.exports = router
