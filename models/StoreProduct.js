const Joi = require('joi')
const Sequelize = require('sequelize')
const sequelize = require('../db/connection')

const StoreProduct = sequelize.define('StoreProduct', {
  id: {
    type: Sequelize.INTEGER(11),
    primaryKey: true,
    autoIncrement: true
  },
  storeId: {
    type: Sequelize.INTEGER(11),
  },
  productId: {
    type: Sequelize.INTEGER(11),
  },
}, { tableName: 'store_products' })

function validateStoreProduct(req, res, next) {
  const schema = Joi.object({
    storeId: Joi.number(),
    productId: Joi.number()
  })
  const { error } = schema.validate(req.body, {
    presence: (req.method !== 'PATCH') ? 'required' : 'optional',
    abortEarly: false
  })
  if (error) return res.json({ status: 400, message: error.message })
  next()
}

module.exports = {
  StoreProduct,
  validateStoreProduct
}