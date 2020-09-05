'use strict';
const faker = require('faker')
const store_products = [...Array(100)].map((store_product)=>({
  storeId:parseInt(Math.floor(Math.random() *50) + 1), 
  productId:parseInt(Math.floor(Math.random() *150) + 1), 
  createdAt:new Date(),
  updatedAt:new Date()
}))
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("store_products",store_products)
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('People', null, {})

     
  }
};
