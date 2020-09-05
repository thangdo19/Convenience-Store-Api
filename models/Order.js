const Joi = require('joi')
const Sequelize = require('sequelize')
const sequelize = require('../db/connection')

const Order = sequelize.define('Order', {
  id: {
    type: Sequelize.INTEGER(11),
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: Sequelize.INTEGER(11),
    allowNull: false
  },
  note: {
    type: Sequelize.STRING(255)
  },
  isPayed:{
    type:Sequelize.BOOLEAN(),
    defaultValue:false
  }

}, { 
  tableName: 'orders'
})

function validateOrder(req, res, next) {
  const schema = Joi.object({
    userId: Joi.number(),
    note: Joi.string().max(255).optional()
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
function validateOrderProductAddition(req, res, next) {
  const schema = Joi.object({
    productId: Joi.number(),
    orderId: Joi.number(),
    productAmount : Joi.number().integer().min(1)
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

module.exports = {
  Order,
  validateOrder,
  validateOrderProductAddition
}