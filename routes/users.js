const auth = require('../middleware/auth')
const validate = require('../middleware/validate')
const { User, validate: validateUser } = require('../models/User')
const { UserFavorite, validate: validateUserFavorite } = require('../models/UserFavorite')
const _ = require('lodash')
const bcrypt = require('bcrypt')
const express = require('express')
const router = express.Router()

const notFoundMsg = 'The user with the given ID was not found.'

router.get('/', async (req, res) => {
	const users = await User.find().sort('name')
	res.send(users)
})

// Get the current user
// we protect this by having a custom endpoint that uses the JWT to get the user payload
router.get('/me', auth, async (req, res) => {
	// rememver, we set req.user from our auth middleware
	// we will only hit this route handler if the middleware succeeds
	const user = await User.findById(req.user._id).select('-password')
	res.send(user)
})

// Create a new user
router.post('/', validate(validateUser), async (req, res) => {
	let user = await User.findOne({ email: req.body.email })
	if (user) return res.status(400).send('User already registered.')

	try {
		// Set the user, then assign it a hashed password before saving
		user = new User(_.pick(req.body, ['name', 'email', 'password']))
		const salt = await bcrypt.genSalt(10)
		const hash = await bcrypt.hash(user.password, salt)
		user.password = hash
		await user.save()

		const token = user.generateAuthToken()
		// Use prefix 'x-' for any custom headers we set within an application
		res.header('authorization', `Bearer ${token}`).send(_.pick(user, ['_id', 'name', 'email']))
	} catch (ex) {
		res.status(500).send(ex.errors)
	}
})

// Should mainly be used on User Profile page to globally update user
router.put('/:id', validate(validateUser), async (req, res) => {
	const { name, email, listIds, favoriteIds } = req.body
	const updatedUser = await User.findByIdAndUpdate(
		req.params.id,
		{
			$set: { name, email, listIds, favoriteIds },
		},
		{ new: true },
	)

	if (!updatedUser) return res.status(404).send(notFoundMsg)

	res.send(updatedUser)
})

// Get user favorites
router.get('/:id/favorites', auth, async (req, res) => {
	const user = await User.findById(req.params.id)
	if (!user) return res.status(404).send(notFoundMsg)

	res.send(user.favorites)
})

// Add a favorite item to the user
router.put('/:id/favorites', [auth, validate(validateUserFavorite)], async (req, res) => {
	const { itemId, name, type } = req.body
	const updatedUser = await User.findByIdAndUpdate(
		req.params.id,
		{
			$addToSet: { favorites: { itemId, name, type } },
		},
		{ new: true },
	)

	if (!updatedUser) return res.status(404).send(notFoundMsg)

	res.send(updatedUser.favorites.find(fav => fav.itemId === itemId))
})

// Remove a favorite item from the user
router.delete('/:id/favorites/:favoriteId', auth, async (req, res) => {
	const { id, favoriteId } = req.params
	const originalUser = await User.findByIdAndUpdate(id, {
		$pull: { favorites: { _id: favoriteId } },
	})

	if (!originalUser) return res.status(404).send(notFoundMsg)

	const itemDeleted = originalUser.favorites.filter(fav => fav._id.toString() === favoriteId)[0]

	res.send(itemDeleted)
})

module.exports = router
