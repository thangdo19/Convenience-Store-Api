const { User } = require('../models/User')
const { OrderProduct } = require('../models/OrderProduct')
const { Order } = require('../models/Order')
const { Product } = require('../models/Product')
const { Category } = require('../models/Category')
const { Permission } = require('../models/Permission')
const { PermissionDetail } = require('../models/PermissionDetail')
const { UserPermission } = require('../models/UserPermission')

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
  // Permission - PermissionDetail (1:1)
  Permission.hasOne(PermissionDetail, {
    as: 'permissionDetail',
    foreignKey: 'permissionId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  PermissionDetail.belongsTo(Permission, {
    as: 'permission',
    foreignKey: 'permissionId'
  }),
  // User - Permission (M:N)
  User.belongsToMany(Permission, {
    through: UserPermission,
    as: 'permissions',
    foreignKey: 'userId',
    otherKey: 'permissionId',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
  }),
  Permission.belongsToMany(User, {
    through: UserPermission,
    as: 'users',
    foreignKey: 'permissionId',
    otherKey: 'userId',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
  })
}