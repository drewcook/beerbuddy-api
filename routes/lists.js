const auth = require("../middleware/auth");
const validate = require("../middleware/validate");
const validateObjectId = require("../middleware/validateObjectId");
const { List, validate: validateList } = require("../models/List");
const { User } = require("../models/User");
const express = require("express");
const router = express.Router();

const notFoundMsg = "The list with the given ID was not found.";

// Get all lists
router.get("/", async (req, res) => {
	const lists = await List.find().sort({ name: 1 });
	res.send(lists);
});

// Get single list
router.get("/:id", validateObjectId, async (req, res) => {
	const list = await List.findById(req.params.id);
	if (!list) return res.status(404).send(notFoundMsg);

	res.send(list);
});

// Create list
// authenticated endpoint
router.post("/", auth, async (req, res) => {
	const list = new List({
		userId: req.body.userId,
		name: req.body.name,
		beerIds: req.body.beerIds,
		breweryIds: req.body.breweryIds,
		dateCreated: new Date(),
		dateLastModified: new Date(),
	});

	const result = await list.save();

	// add list to users's overall list
	const { listIds } = await User.findById(req.body.userId);
	await User.updateOne(
		{ _id: req.body.userId },
		{
			listIds: [...listIds, list._id],
		}
	);

	res.send(result);
});

// Update list
router.put("/:id", [auth, validate(validateList)], async (req, res) => {
	const { name } = req.body;
	const updatedList = await List.findByIdAndUpdate(
		req.params.id,
		{
			$set: { name },
		},
		{ new: true }
	);

	if (!updatedList) return res.status(404).send(notFoundMsg);

	res.send(updatedList);
});

// Delete list
// Must be an admin, use checkAdmin middleware
router.delete("/:id", auth, async (req, res) => {
	const list = await List.findByIdAndRemove(req.params.id);
	if (!list) return res.status(404).send(notFoundMsg);

	res.send(list);
});

// Get Lists based off of current user
router.get("/user/:id", auth, async (req, res) => {
	const user = await User.findById(req.params.id);
	if (!user)
		return res.status(404).send("The user with the given ID was not found.");

	let lists = [];
	for (const listId of user.listIds) {
		const list = await List.findById(listId);
		lists = [...lists, list];
	}

	res.send(lists);
});

module.exports = router;
