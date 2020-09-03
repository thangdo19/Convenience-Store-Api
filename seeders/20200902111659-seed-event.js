'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'contacts',
      [
        {
          realName: "DataTypes.STRING",
          address: "DataTypes.STRING",
          createdAt: new Date(),
          updatedAt: new Date()
        },
      ], {})
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('People', null, {})
  }
};
