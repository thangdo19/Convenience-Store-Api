const Sequelize = require('sequelize')
const Joi = require('joi')
const sequelize = require('../db/connection')

const OrderProduct = sequelize.define('OrderProduct', {
  id: {
    type: Sequelize.INTEGER(11),
    primaryKey: true,
    autoIncrement: true
  },
  orderId: { 
    type: Sequelize.INTEGER(11) 
  },
  productId: { 
    type: Sequelize.INTEGER(11) 
  },
  orderAmount: {
    type: Sequelize.INTEGER(11)
  }
}, { 
  tableName: 'order_products'
})

function validateOrderProducts(req, res, next) {
  const schema = Joi.object({
    orderId: Joi.number(),
    productId: Joi.number()
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
 OrderProduct,
  validateOrderProducts
}