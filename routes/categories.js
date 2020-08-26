const { Category, validateCategory } = require('../models/Category')
const { Op } = require('sequelize')
const _ = require('lodash')
const express = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
  const categories = await Category.findAll({ 
    attributes: {
      exclude: ['createdAt', 'updatedAt']
    }, 
    order: [
      ['id']
    ]
  })
  return res.json({ status: 200, data: categories })
})  

router.get('/:id', async (req, res) => {
  const category = await Category.findOne({ 
    where: { id: req.params.id }
  })
  if (!category) return res.json({ status: 404, message: 'Category not found' })

  return res.json({ status: 200, data: category })
})

router.post('/', [validateCategory], async (req, res) => {
  const category = await Category.create(req.body)
  return res.json({ status: 201, data: category })
})

router.patch('/:id', [validateCategory], async (req, res) => {
  const category = await Category.findOne({ where: { id: req.params.id }})
  if (!category) return res.json({ status: 404, message: 'Category not found'})
  // update
  const categoryAfterPatch = await category.update(req.body)
  return res.json({ status: 200, data: categoryAfterPatch })
})

router.delete('/:id', async (req, res) => {
  const category = await Category.findOne({ where: { id: req.params.id }})
  if (!category) return res.json({ status: 404, message: 'Category not found'})
  // delete
  const deletedCount = await Category.destroy({ where: { id: req.params.id }})
  return res.json({ status: 200, deletedCount })
})

module.exports = router