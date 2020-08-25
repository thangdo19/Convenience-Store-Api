const { User, validateUser } = require('../models/User')
const { Op } = require('sequelize')
const _ = require('lodash')
const express = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
  const users = await User.findAll({ attributes: {
    exclude: ['createdAt', 'updatedAt']
  }})
  return res.json({ status: 200, data: users })
})

router.post('/', [validateUser], async (req, res) => {
  const userInDb = await User.findOne({ where: {
    [Op.or]: { phone: req.body.phone, email: req.body.email }
  }})
  if (userInDb) return res.json({ status: 400, message: 'User already registered' })
  // create a new user
  const user = await User.create(req.body)
  return res.json({ status: 201, data: user })
})

router.delete('/:id', async (req, res) => {
  const deletedCount = await User.destroy({ where: { id: req.params.id }})
  return res.json({ status: 200, deletedCount })
})

router.delete('/', async (req, res) => {
  if (!req.query.phone && !req.query.email) throw new Error('There\'s no phone or email provided')
  // define option to delete
  const option = (req.query.email) ? { email: req.query.email } : { phone: req.query.phone }
  // delete 
  const deletedCount = await User.destroy({ where: option })
  return res.json({ status: 200, deletedCount })
})

module.exports = router