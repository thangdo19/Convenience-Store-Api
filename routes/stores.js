const { Store, validateStore } = require('../models/Store')
const express = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
  const stores = await Store
    .findAll({ attributes: { exclude: ['createdAt', 'updatedAt'] }})
  return res.json({ status: 200, data: stores })
})

module.exports = router