const morgan = require('morgan')
const winston = require('winston')
require('winston-mongodb')
require('express-async-errors')
require('dotenv').config()

const db = process.env.MONGODB_CONNECTION_STRING

const defaultTransports = [
	// - Write all logs with level `error` and below to `error.log`
	new winston.transports.File({
		level: 'error',
		filename: 'error.log',
		format: winston.format.combine(winston.format.colorize(), winston.format.json()),
	}),
	// - Write all warnings through Http
	new winston.transports.Http({
		level: 'warn',
		format: winston.format.json(),
	}),
	// - Write all logs with level `info` and below to `combined.log`
	new winston.transports.File({
		level: 'info',
		filename: 'combined.log',
		format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
	}),
	// - Addistionally, write all logs into our mongo db instance
	new winston.transports.MongoDB({
		level: 'error',
		db,
		options: {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		},
		collection: 'logs',
	}),
]

const logger = winston.createLogger({
	// If we're not in production then log to the `console` with the format:
	// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
	transports: [
		...defaultTransports,
		new winston.transports.Console({
			format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
		}),
	],
	exceptionHandlers: [
		...defaultTransports,
		// - Write all unhandled exception logs to `exceptions.log`
		new winston.transports.File({ filename: 'exceptions.log' }),
		new winston.transports.Console({
			format: winston.format.combine(winston.format.colorize(), winston.format.prettyPrint()),
		}),
	],
	rejectionHandlers: [
		...defaultTransports,
		// - Write all unhandled rejection logs to `rejections.log`
		new winston.transports.File({ filename: 'rejections.log' }),
		new winston.transports.Console({
			format: winston.format.combine(winston.format.colorize(), winston.format.prettyPrint()),
		}),
	],
})

const setupLogging = app => {
	// createLogger().rejectionHandlers isn't working, so for now...
	process.on('unhandledRejection', ex => {
		throw ex
	})

	// if (process.env.NODE_ENV !== 'production') {
	// Also add in morgan logging middleware
	app.use(morgan('tiny'))
	logger.info('Morgan enabled...')
	// }
}

module.exports = {
	setupLogging,
	logger,
}
