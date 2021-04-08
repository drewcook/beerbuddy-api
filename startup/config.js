const config = require('config')

const setupConfig = () => {
	// TODO: use .env or generate an app secret and store it
	if (!config.get('BEERBUDDY_APP_SECRET')) {
		throw new Error('FATAL ERROR: BEERBUDDY_APP_SECRET is not defined.')
	}
}

module.exports = setupConfig
