const { User, validateUser } = require('../models/User')
const { Op } = require('sequelize')
const _ = require('lodash')
const bcrypt = require('bcrypt')
const express = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
  const users = await User.findAll({ attributes: {
    exclude: ['createdAt', 'updatedAt', 'password']
  }})
  return res.json({ status: 200, data: users })
})

router.post('/', [validateUser], async (req, res) => {
  const userInDb = await User.findOne({ where: {
    [Op.or]: { phone: req.body.phone, email: req.body.email }
  }})
  if (userInDb) return res.json({ status: 400, message: 'User already registered' })
  // hash password
  req.body.password = await bcrypt.hash(req.body.password, await bcrypt.genSalt(10))
  // create a new user
  const user = await User.create(req.body)
  const userInShort = _.omit(user.get({ plain: true }), ['createdAt', 'updatedAt', 'password'])
  return res.json({ status: 201, data: userInShort })
})

router.patch('/:id', [validateUser], async (req, res) => {
  const user = await User.findOne({ where: {
    [Op.or]: { phone: req.body.phone, email: req.body.email }
  }})
  if (!user) return res.json({ status: 400, message: 'User not found' })
  // hash if has password
  if (req.body.password) {
    req.body.password = await bcrypt.hash(req.body.password, await bcrypt.genSalt(10))
  }
  // update the rest
  const newUser = await user.update(req.body)
  const newUserInShort = _.omit(newUser.get({ plain: true }), ['createdAt', 'updatedAt', 'password'])
  return res.json({ status: 200, data: newUserInShort })
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