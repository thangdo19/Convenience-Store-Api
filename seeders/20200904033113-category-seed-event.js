'use strict';
const faker = require('faker')
const categories = [...Array(50)].map((category)=>({
  name:faker.commerce.productMaterial(), 
  createdAt:new Date(),
  updatedAt:new Date()
}))
module.exports = {
  up:  (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("categories",categories)
  },

  down:  (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('People', null, {})

     
  }
};
