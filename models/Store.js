const Joi = require('joi')
const Sequelize = require('sequelize')
const sequelize = require('../db/connection')

const Store = sequelize.define('Store', {
  id: {
    type: Sequelize.INTEGER(11),
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING(255),
    allowNull: false
  },
  address: {
    type: Sequelize.STRING(255),
    allowNull: false
  }
}, { tableName: 'stores' })

function validateStore(req, res, next) {
  const schema = Joi.object({
    address: Joi.string(255)
  })
  const { error } = schema.validate(req.body, {
    presence: (req.method !== 'PATCH') ? 'required' : 'optional',
    abortEarly: false
  })
  if (error) return res.json({ status: 400, message: error.message })
  next()
}

module.exports = {
  Store,
  validateStore
}