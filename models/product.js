'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  product.init({
    title: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notNull: {
          msg: "field 'title' is required"
        }
      }
    },
    price: {
      allowNull: false,
      type: DataTypes.INTEGER,
      validate: {
        notNull: {
          msg: "field 'price' is required"
        },
        isNumeric: {
          msg: "'price' value should be number"
        },
        min: {
          args: [0],
          msg: "'price' value cannot be lower than 0"
        },
        max: {
          args: [50000000],
          msg: "'price' value cannot be greater than 50000000"
        }
      }
    },
    stok: {
      allowNull: false,
      type: DataTypes.INTEGER,
      validate: {
        notNull: {
          msg: "field 'stock' is required"
        },
        isNumeric: {
          msg: "'stock' value should be number"
        },
        min: {
          args: [5],
          msg: "'stock' value cannot be lower than 5"
        }
      }
    },
    CategoryId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
  }, {
    sequelize,
    modelName: 'product',
  });
  return product;
};