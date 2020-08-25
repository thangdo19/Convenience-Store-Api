const { User } = require('../models/User')
const { UserOrder } = require('../models/UserOrder')
const { Order } = require('../models/Order')

module.exports = function() {
  // create relationship
  User.belongsToMany(Order, {
    through: UserOrder,
    as: "orders",
    foreignKey: "userId",
    otherKey: "orderId",
    onUpdate: "CASCADE",
    onDelete: "SET NULL"
  }),
  Order.belongsToMany(User, {
    through: UserOrder,
    as: "users",
    foreignKey: "orderId",
    otherKey: "userId",
    onUpdate: "CASCADE",
    onDelete: "SET NULL"
  })
}