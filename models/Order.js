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
    type: Sequelize.INTEGER(11)
  },
  note: {
    type: Sequelize.STRING(255)
  }
}, { 
  tableName: 'orders'
})

function validateOrder(req, res, next) {
  const schema = Joi.object({
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

module.exports = {
  Order,
  validateOrder
}