const Joi = require('joi')
const Sequelize = require('sequelize')

const sequelize = require('../db/connection')

const User = sequelize.define('User', {
  id: {
    type: Sequelize.INTEGER(11),
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING(255),
    allowNull: false
  },
  phone: {
    type: Sequelize.STRING(11),
    unique: true,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING(255),
    unique: true,
    allowNull: false
  },
  address: {
    type: Sequelize.STRING(255)
  }
})

function validateUser(req, res, next) {
  const schema = Joi.object({
    name: Joi.string().max(255),
    phone: Joi.string().max(11),
    email: Joi.string().email().max(255),
    email: Joi.string().max(255).optional()
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
  User,
  validateUser
}