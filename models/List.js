const Joi = require('joi')
const mongoose = require('mongoose')

const validateList = list => {
	const schema = Joi.object({
		userId: Joi.objectId(),
		name: Joi.string().required().min(5).max(50),
		beerIds: Joi.array().items(Joi.string()),
		breweryIds: Joi.array().items(Joi.string()),
		dateCreated: Joi.date().greater('now'),
		dateLastModified: Joi.date().greater('now'),
	})

	return schema.validate(list)
}

const listSchema = new mongoose.Schema({
	userId: {
		type: String,
	},
	name: {
		type: String,
		required: true,
		trim: true,
		minLength: 5,
		maxLength: 50,
	},
	beerIds: {
		type: [String],
	},
	breweryIds: {
		type: [String],
	},
	dateCreated: {
		type: Date,
		default: Date.now(),
	},
	dateLastModified: {
		type: Date,
		default: Date.now(),
	},
})

const List = mongoose.model('List', listSchema)

module.exports = {
	List,
	validate: validateList,
}
