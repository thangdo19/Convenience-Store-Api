'use strict';
const faker = require('faker')
const order_products = [...Array(100)].map((store_product)=>({
  orderId:parseInt(Math.floor(Math.random() *150) + 1), 
  productId:parseInt(Math.floor(Math.random() *150) + 1), 
  productAmount:parseInt(Math.floor(Math.random() *15)+1),
  createdAt:new Date(),
  updatedAt:new Date()
}))
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("order_products",order_products)
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('People', null, {})

     
  }
};
