'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class categorie extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  categorie.init({
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Kolom ini harus diisi"
        },
      }
    },
    sold_product_amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Kolom ini harus diisi"
        },
        isInt: {
          msg: "Tipe data harus Integer!"
        }
      }
    }
  },
  {
    hooks: {
      beforeValidate: (categorie) => {
        if(categorie.sold_product_amount){
          categorie.sold_product_amount = categorie.sold_product_amount;
        }
        else {
          categorie.sold_product_amount = 0;
        }
      }
    },
    sequelize,
    modelName: 'categorie',
  });
  return categorie;
};