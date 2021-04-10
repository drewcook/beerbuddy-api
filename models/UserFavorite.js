const Joi = require('joi')
const mongoose = require('mongoose')

const validateUserFavorite = favorite => {
	const schema = Joi.object({
		itemId: Joi.string().required(),
		name: Joi.string().required(),
		type: Joi.string().valid('beer', 'brewery', 'list'),
		dateAdded: Joi.date().greater('now'),
	})

	return schema.validate(favorite)
}

const userFavoriteSchema = new mongoose.Schema({
	itemId: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
		trim: true,
	},
	type: {
		type: String,
		enum: ['beer', 'brewery', 'list'],
		required: true,
	},
	dateAdded: {
		type: Date,
		default: Date.now(),
	},
})

const UserFavorite = mongoose.model('UserFavorite', userFavoriteSchema)

module.exports = {
	UserFavorite,
	validate: validateUserFavorite,
}
