'use strict';
const faker = require('faker')
const store_products = [...Array(100)].map((store_product)=>({
  userId:parseInt(Math.floor(Math.random() *100) + 1), 
  note:faker.lorem.sentence(), 
  createdAt:new Date(),
  updatedAt:new Date()
}))
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("orders",store_products)
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('People', null, {})

     
  }
};
