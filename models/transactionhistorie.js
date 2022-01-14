'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class transactionHistorie extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      transactionHistorie.belongsTo(models.user, {foreignKey: 'user_id'})
      transactionHistorie.belongsTo(models.product, {foreignKey: 'product_id'})
    }
  };
  transactionHistorie.init({
    product_id: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg: "Kolom ini harus diisi!"
        },
        isInt: {
          msg: "Tipe data harus Integer!"
        }
      }
    },
    user_id: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg: "Kolom ini harus diisi!"
        },
        isInt: {
          msg: "Tipe data harus Integer!"
        }
      }
    },
    quantity: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg: "Kolom ini harus diisi!"
        },
        isInt: {
          msg: "Tipe data harus Integer!"
        }
      }
    },
    total_price: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg: "Kolom ini harus diisi!"
        },
        isInt: {
          msg: "Tipe data harus Integer!"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'transactionHistorie',
  });
  return transactionHistorie;
};