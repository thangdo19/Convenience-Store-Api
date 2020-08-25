const { Order, validateOrder } = require('../models/Order')
const { User } = require('../models/User')
const { Op } = require('sequelize')
const _ = require('lodash')
const express = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
  const orders = await Order.findAll({ attributes: {
    exclude: ['createdAt', 'updatedAt']
  }})
  return res.json({ status: 200, data: orders })
})

router.get('/:id', async (req, res) => {
  const order = await Order.findOne({ 
    where: { id: req.params.id },
    include: {
      model: User,
      as: 'users',
      attributes: ['id', 'name', 'phone', 'address'],
      through: { attributes: [] }
    }
  })
  if (!order) return res.json({ status: 404, message: 'Order not found' })

  return res.json({ status: 200, data: order })
})

router.post('/', [validateOrder], async (req, res) => {
  const order = await Order.create(req.body)
  return res.json({ status: 201, data: order })
})

router.post('/:id', async (req, res) => {
  const order = await Order.findOne({ where: { id: req.body.id }})
  if (!order) return res.json({ status: 404, message: 'Order not found' })

  const user = await User.findOne({ where: { id: req.params.id }})
  if (!user) return res.json({ status: 404, message: 'User not found' })

  order.addUser(order.id, user.id)
  return res.json({ status: 200 })
})

// router.delete('/:id', async (req, res) => {
//   const deletedCount = await Order.destroy({ where: { id: req.params.id }})
//   return res.json({ status: 200, deletedCount })
// })

// router.delete('/', async (req, res) => {
//   if (!req.query.phone && !req.query.email) throw new Error('There\'s no phone or email provided')
//   // define option to delete
//   const option = (req.query.email) ? { email: req.query.email } : { phone: req.query.phone }
//   // delete 
//   const deletedCount = await Order.destroy({ where: option })
//   return res.json({ status: 200, deletedCount })
// })

module.exports = router