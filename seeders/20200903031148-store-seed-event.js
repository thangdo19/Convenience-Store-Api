'use strict';
const faker = require('faker')
const stores = [...Array(100)].map((store)=>({
  name:faker.name.title(),
 address:faker.company.companyName(),
  createdAt:new Date(),
  updatedAt:new Date()
}))
module.exports = {
  up:  (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("stores",stores)
  },

  down:  (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('People', null, {})
  }
};
