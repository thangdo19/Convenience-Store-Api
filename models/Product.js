const Joi = require('joi')
const Sequelize = require('sequelize')

const sequelize = require('../db/connection')

const Product = sequelize.define('Product', {
  id: {
    type: Sequelize.INTEGER(11),
    primaryKey: true,
    autoIncrement: true
  },
  categoryId: {
    type: Sequelize.INTEGER(11)
  },
  name: {
    type: Sequelize.STRING(255),
    allowNull: false,
    unique: true
  },
  numberInStock: {
    type: Sequelize.INTEGER(11),
    defaultValue: 0,
    allowNull: false,
    validate: { min: 0 }
  }
}, { 
  tableName: 'products'
})

function validateProduct(req, res, next) {
  const schema = Joi.object({
    name: Joi.string().max(255),
    categoryId: Joi.number(),
    numberInStock: Joi.number().min(0)
  })
  // seek for error
  const { error } = schema.validate(req.body, {
    presence: (req.method !== 'PATCH') ? 'required' : 'optional',
    abortEarly: false
  })
  if (error) return res.json({ status: 400, message: error.message })
  // no validation error, pass to next middleware
  next()
}

module.exports = { Product, validateProduct }