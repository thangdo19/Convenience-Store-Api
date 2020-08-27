const { User } = require('../models/User')
const { OrderProduct } = require('../models/OrderProduct')
const { Order } = require('../models/Order')
const { Product } = require('../models/Product')
const { Category } = require('../models/Category')

module.exports = function() {
  // create relationship
  // Category - Product (1:N)
  Category.hasMany(Product, {
    as: 'products',
    foreignKey: 'categoryId',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
  })
  Product.belongsTo(Category, {
    as: 'category',
    foreignKey: 'categoryId'
  })
  // User - Order (1:N)
  User.hasMany(Order, {
    as: 'orders',
    foreignKey: 'userId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  Order.belongsTo(User, {
    as: 'user',
    foreignKey: 'userId'
  })
  // Order - Product (M:N)
  Order.belongsToMany(Product, {
    through: OrderProduct,
    as: "products",
    foreignKey: "orderId",
    otherKey: "productId",
    onUpdate: "CASCADE",
    onDelete: "SET NULL"
  }),
  Product.belongsToMany(Order, {
    through: OrderProduct,
    as: "orders",
    foreignKey: "productId",
    otherKey: "orderId",
    onUpdate: "CASCADE",
    onDelete: "SET NULL" 
  })
}