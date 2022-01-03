'use strict';
const { hashPassword } = require("../helpers/bcrypt");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    let arr = [
      {
        full_name: "Lestari",
        email: "lestari@gmail.com",
        password: hashPassword("lestari123"),
        gender: "Female",
        role: 'admin',
        balance: 1000000,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        full_name: "Lestaro",
        email: "lestaro@gmail.com",
        password: hashPassword("lestari123"),
        gender: "Male",
        role: 'customer',
        balance: 1500000,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ];
    await queryInterface.bulkInsert("users", arr);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("users", null);
  }
};
