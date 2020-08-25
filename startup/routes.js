const morgan = require('morgan')
const express = require('express')
// requires routes
const users = require('../routes/users')
// error handler middleware
const error = require('../middleware/error')
module.exports = function(app) {
  // middleware
  app.use(express.json())
  app.use(morgan('dev'))
  // routes
  app.use('/api/users', users)
  // last middleware to handle route's error
  app.use(error)
}