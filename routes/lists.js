const auth = require('../middleware/auth')
const validate = require('../middleware/validate')
const validateObjectId = require('../middleware/validateObjectId')
const { List, validate: validateList } = require('../models/List')
const { User } = require('../models/User')
const express = require('express')
const router = express.Router()

const notFoundMsg = 'The list with the given ID was not found.'

// Get all lists
router.get('/', auth, async (req, res) => {
	const lists = await List.find().sort({ name: 1 })
	res.send(lists)
})

// Get single list
router.get('/:id', validateObjectId, async (req, res) => {
	const list = await List.findById(req.params.id)
	if (!list) return res.status(404).send(notFoundMsg)

	res.send(list)
})

// Create list
// authenticated endpoint
router.post('/', auth, async (req, res) => {
	const list = new List({
		userId: req.body.userId,
		name: req.body.name,
		beerIds: req.body.beerIds,
		breweryIds: req.body.breweryIds,
		dateCreated: new Date(),
		dateLastModified: new Date(),
	})

	const result = await list.save()

	// add list to users's overall list
	const { listIds } = await User.findById(req.body.userId)
	await User.updateOne(
		{ _id: req.body.userId },
		{
			listIds: [...listIds, list._id],
		},
	)

	res.send(result)
})

// Update list
router.put('/:id', [auth, validate(validateList)], async (req, res) => {
	const { name, beerIds, breweryIds } = req.body
	const updatedList = await List.findByIdAndUpdate(
		req.params.id,
		{
			$set: { name, beerIds, breweryIds },
		},
		{ new: true },
	)

	if (!updatedList) return res.status(404).send(notFoundMsg)

	res.send(updatedList)
})

// Delete list
// TODO: Must be a list that belongs to user making request
router.delete('/:id', auth, async (req, res) => {
	const list = await List.findByIdAndRemove(req.params.id)
	if (!list) return res.status(404).send(notFoundMsg)

	res.send(list)
})

// Get lists based off of current user
router.get('/user/:id', auth, async (req, res) => {
	const lists = await List.find({ userId: req.params.id })
	console.log('got lists from db', { lists })
	res.send(lists)
})

module.exports = router
