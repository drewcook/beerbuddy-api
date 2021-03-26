const auth = require('../middleware/auth');
const checkAdmin = require('../middleware/checkAdmin');
const validate = require('../middleware/validate');
const express = require('express');
const router = express.Router();
const { Customer, validate: validateCustomer } = require('../models/Customer');

const notFoundMsg = 'The customer with the given ID was not found.';

router.get('/', async (req, res) => {
  const customers = await Customer.find().sort({ name: 1 });
  res.send(customers);
});

router.get('/:id', async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) return res.status(404).send(notFoundMsg);

  res.send(customer);
});

router.post('/', [auth, validate(validateCustomer)], async (req, res) => {
  const customer = new Customer({
    name: req.body.name,
    phone: req.body.phone,
    isGold: req.body.isGold,
  });

  try {
    const result = await customer.save();
    res.send(result)
  }
  catch (ex) {
    res.status(500).send(ex.errors);
  }
});

router.put('/:id', [auth, validate(validateCustomer)], async (req, res) => {
  const updated = await Customer.findByIdAndUpdate(req.params.id, {
    $set: {
      name: req.body.name,
      phone: req.body.phone,
      isGold: req.body.isGold,
    },
  }, { new: true });

  if (!updated) return res.status(404).send(notFoundMsg);

  res.send(updated);
});

router.delete('/:id', [auth, checkAdmin], async (req, res) => {
  const customer = await Customer.findByIdAndRemove(req.params.id);

  if (!customer) return res.status(404).send(notFoundMsg);

  res.send(customer);
});

module.exports = router;