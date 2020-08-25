const Sequelize = require('sequelize')

const sequelize = require('../db/connection')

const UserOrder = sequelize.define('UserOrder', {
  id: {
    type: Sequelize.INTEGER(11),
    primaryKey: true,
    autoIncrement: true
  },
  userId: { type: Sequelize.INTEGER(11) },
  orderId: { type: Sequelize.INTEGER(11) }
}, { 
  tableName: 'user_orders'
})

module.exports = { 
  UserOrder 
}