'use strict';
const faker = require('faker')
const stores = [...Array(50)].map((store)=>({
  name:faker.company.companyName(),
  address:faker.address.streetName(),
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
