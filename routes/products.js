const { Product, validateProduct } = require('../models/Product')
const { Category } = require('../models/Category')
const express = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
  // sort by a property, direction can be set to DESC to sort in descending order
  const orderBy = req.query.orderBy
  const direction = req.query.direction

  const products = await Product.findAll({ 
    attributes: { exclude: ['createdAt', 'updatedAt', 'categoryId'] },
    include: {
      model: Category,
      as: 'category',
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    },
    order: [
      (orderBy) ? ((direction) ? [orderBy, direction] : [orderBy]) : ['id']
    ]
  })
  return res.json({ status: 200, data: products })
})  

router.get('/:id', async (req, res) => {
  const product = await Product.findOne({ 
    where: { id: req.params.id }
  })
  if (!product) return res.json({ status: 404, message: 'Product not found' })
  return res.json({ status: 200, data: product })
})

router.post('/', [validateProduct], async (req, res) => {
  const product = await Product.create(req.body)
  return res.json({ status: 201, data: product })
})

router.patch('/:id', [validateProduct], async (req, res) => {
  const product = await Product.findOne({ where: { id: req.params.id }})
  if (!product) return res.json({ status: 404, message: 'Product not found'})
  // update
  const productAfterPatch = await product.update(req.body)
  return res.json({ status: 200, data: productAfterPatch })
})

router.delete('/:id', async (req, res) => {
  const product = await Product.findOne({ where: { id: req.params.id }})
  if (!product) return res.json({ status: 404, message: 'Product not found'})
  // delete
  const deletedCount = await Product.destroy({ where: { id: req.params.id }})
  return res.json({ status: 200, deletedCount })
})

module.exports = router