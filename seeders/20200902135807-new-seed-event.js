'use strict';
const faker = require('faker')
const bcrypt = require('bcrypt')
const users = [...Array(150)].map((user)=>({
  name: faker.name.firstName(),  
  phone: faker.phone.phoneNumber('0##########'),
  email: faker.internet.email(),
  password: bcrypt.hash(faker.internet.password(8),  bcrypt.genSalt(10)),
  address:faker.address.country(),
  createdAt:new Date(),
  updatedAt:new Date()
}))
module.exports = {
  up: (queryInterface, Sequelize) => {
    
    return queryInterface.bulkInsert("users",users)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('People', null, {})
  }
};
