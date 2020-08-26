const morgan = require('morgan')
const express = require('express')
// requires routes
const users = require('../routes/users')
const orders = require('../routes/orders')
const categories = require('../routes/categories')
const products = require('../routes/products')
// error handler middleware
const error = require('../middleware/error')
module.exports = function(app) {
  // middleware
  app.use(express.json())
  app.use(morgan('dev'))
  // routes
  app.use('/api/users', users)
  app.use('/api/orders', orders)
  app.use('/api/categories', categories)
  app.use('/api/products', products)
  // last middleware to handle route's error
  app.use(error)
}