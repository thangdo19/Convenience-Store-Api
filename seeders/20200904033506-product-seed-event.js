'use strict';
const faker = require('faker')
const products = [...Array(100)].map((product)=>({
  categoryId:parseInt(Math.floor(Math.random() *50) + 1),
  name: faker.commerce.productName(),  
  numberInStock:parseInt(Math.floor(Math.random() *50) + 1), 
  createdAt:new Date(),
  updatedAt:new Date()
}))
module.exports = {
  up:  (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("products",products)
  },

  down:  (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('People', null, {})

     
  }
};
