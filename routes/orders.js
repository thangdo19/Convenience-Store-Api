const { Order, validateOrder, validateOrderProductAddition } = require('../models/Order')
const { User } = require('../models/User')
const { Product } = require('../models/Product')
const sequelize = require('../db/connection')
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
    include: [{
      model: User,
      as: 'user',
      attributes: ['id', 'name', 'phone', 'address'],
    }, {
      model: Product,
      as: 'products',
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      // through: { attributes: [] }
    }
    ],
    attributes: { exclude: ['createdAt', 'updatedAt' ]}
  })
  if (!order) return res.json({ status: 404, message: 'Order not found' })
  console.log(order.OrderProduct)
  return res.json({ status: 200, data: order })
})

router.post('/', [validateOrder], async (req, res) => {
  const order = await Order.create(req.body)
  return res.json({ status: 201, data: order })
})

router.post('/newProduct', [validateOrderProductAddition], async (req, res) => {
  const order = await Order.findOne({ where: { id: req.body.orderId }})
  if (!order) return res.json({ status: 404, message: 'Order not found' })

  // check for stocks
  const product = await Product.findOne({ where: { id: req.body.productId }})
  if (product.numberInStock < req.body.productAmount) return res.json({
    status: 400,
    message: `Product ${product.name} is currently not having enough stock`
  })

  const transaction = await sequelize.transaction()
  try {
    // add to order
    await order.addProduct(req.body.productId, { 
      transaction: transaction,
      through: { productAmount: req.body.productAmount }
    })
    // reduce stock
    await Product.update({ numberInStock: (product.numberInStock - req.body.productAmount) }, {
      transaction: transaction,
      where: { id: product.id }
    })
    await transaction.commit()
    return res.json({ status: 200 })
  }
  catch (err) {
    console.log(err)
    await transaction.rollback()
    return res.json({ status: 400, message: err.message })
  }
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