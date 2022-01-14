'use strict';
const { hashPassword } = require("../helpers/bcrypt");
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      user.hasMany(models.transactionHistorie, {foreignKey: 'user_id'})
    }
  };
  user.init({
    full_name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: "Full name is required"
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: "Email is required"
        },
        isEmail: {
          args: true,
          msg: "Email address is invalid"
        }
      },
      unique: {
        args: true,
        msg: "This email has been used, try another one"
      },
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: "Password is required"
        },
        len: {
          args: [6, 10],
          msg: "'password' length is 6-10"
        }
      }
    },
    gender: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: "Gender is required"
        },
        isIn: {
          args: [['Male', 'Female']],
          msg: "'gender' value should be either 'Female' or 'Male'"
        }
      }
    },
    role: {
      type: DataTypes.INTEGER,
      // values: ['admin', '2'],
      validate: {
        notEmpty: {
          args: true,
          msg: "Role is required"
        },
        isIn: {
          args: [[1, 2]],
          msg: "'role' value should be either 1 as admin or 2 as customer"
        }
      }
    },
    balance: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        notNull: {
          msg: "field balance is required"
        },
        isNumeric: {
          msg: "balance value should be number"
        },
        max: {
          args: [100000000],
          msg: "balance value cannot be greated than 100000000"
        },
        min: {
          args: [0],
          msg: "balance value cannot be lower than 0"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'user',
    hooks: {
      beforeCreate: function (user) {
        user.balance = 0
        user.role = 2
        user.password = hashPassword(user.password)
      },
    },
  });
  return user;
};