'use strict';
const faker = require('faker')
const store_products = [...Array(50)].map((store_product)=>({
  storeId:parseInt(Math.floor(Math.random() *49) + 1), 
  productId:parseInt(Math.floor(Math.random() *99) + 1), 
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
