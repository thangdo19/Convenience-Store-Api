'use strict';
const faker = require('faker')
const users = [...Array(100)].map((user)=>({
  name: faker.name.firstName(),  
  phone: faker.phone.phoneNumber(),
  email: faker.internet.email(),
  password:faker.internet.password(8),
  address:faker.address.country(),
  createdAt:new Date(),
  updatedAt:new Date()
}))
module.exports = {
  up: (queryInterface, Sequelize) => {
    
    return queryInterface.bulkInsert("users",users
      )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('People', null, {})
  }
};
