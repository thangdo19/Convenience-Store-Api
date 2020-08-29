const { Order, validateOrder, validateOrderProductAddition } = require('../models/Order')
const { User } = require('../models/User')
const { Product } = require('../models/Product')
const { OrderProduct } = require('../models/OrderProduct')
const { Category } = require('../models/Category')
const sequelize = require('../db/connection')
const express = require('express')
const router = express.Router()

// get all orders
router.get('/', async (req, res) => {
  const orders = await Order.findAll({ attributes: {
    exclude: ['createdAt', 'updatedAt']
  }})
  return res.json({ status: 200, data: orders })
})

// get order by specify id
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
  return res.json({ status: 200, data: order })
})

// create an order without any product
router.post('/', [validateOrder], async (req, res) => {
  const order = await Order.create(req.body)
  return res.json({ status: 201, data: order })
})

// add a product for order
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

// edit a product inside of an order (edit productAmount of product)
router.patch('/product', [validateOrderProductAddition], async (req, res) => {
  // check for existence of Order & OrderProduct
  const orderProduct = await OrderProduct.findOne({ where: {
    productId: req.body.productId,
    orderId: req.body.orderId
  }})
  if (!orderProduct) res.json({
    status: 404,
    message: 'Order not found or Order does not contain that Product'
  })
  // take product currently in the store
  const storeProduct = await Product.findOne({ where: { id: req.body.productId }})
  // calculate total product amount of that product
  const totalStoreProductAmount = orderProduct.productAmount + storeProduct.numberInStock
  // check for stocks
  if (totalStoreProductAmount < req.body.productAmount) return res.json({
    status: 400,
    message: `Product ${storeProduct.name} is currently not having enough stock`
  })
  // create transaction for update order & store product amount
  const transaction = await sequelize.transaction()
  try {
    await orderProduct.update({ productAmount: req.body.productAmount }, { transaction: transaction })
    await storeProduct.update({ numberInStock: (totalStoreProductAmount - req.body.productAmount) }, { transaction: transaction })
  }
  catch(err) {
    console.log(err)
    await transaction.rollback()
    return res.json({ status: 404, message: `Transaction failed: ${err.message}` })
  }
  // take order to response
  const order = await Order.findOne({ 
    where: { id: req.body.orderId },
    include: {
      model: Product,
      as: 'products',
      where: { id: req.body.productId },
      attributes: { exclude: ['createdAt', 'updatedAt', 'categoryId'] },
      through: { attributes: ['id', 'productAmount'] },
      include: {
        model: Category,
        as: 'category',
        attributes: { exclude: ['createdAt', 'updatedAt'] }
      }
    }
  })
  // commit transaction & response
  await transaction.commit()
  return res.json({ status: 200, data: await order.reload() })
})

// edit order, find order by specify id
router.patch('/:id', [validateOrder], async (req, res) => {
  const order = await Order.findOne({ where: { id: req.params.id }})
  if (!order) return res.json({ status: 404, message: 'Order not found' })

  const updatedOrder = await order.update(req.body)
  return res.json({ status: 200, data: updatedOrder })
})

// delete an order by id
router.delete('/:id', async (req, res) => {
  const deletedCount = await Order.destroy({ where: { id: req.params.id }})
  return res.json({ status: 200, deletedCount })
})

module.exports = router