const Joi = require('joi')
const Sequelize = require('sequelize')

const sequelize = require('../db/connection')

const Category = sequelize.define('Category', {
  id: {
    type: Sequelize.INTEGER(11),
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING(255),
    allowNull: true,
    //unique: true
  }
}, { 
  tableName: 'categories'
})

function validateCategory(req, res, next) {
  const schema = Joi.object({ 
    name: Joi.string().max(255)
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
  Category,
  validateCategory
}