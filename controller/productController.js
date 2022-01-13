const { product, categorie } = require("../models");
const { verifyToken } = require("../helpers/jwt");
const { comparePassword } = require("../helpers/bcrypt");
const rupiahFormat = require("../utils/rupiahFormat");

class productController {
  static async inputProduct(req, res) {
    const token = req.get("token");
    const userEncoded = verifyToken(token);
    if (userEncoded.role != 1) {
      res.status(403).json({
        message: "Your are not admin"
      });
    } else {
      await categorie.findByPk(req.body.CategoryId).then(async categor => {
        if (categor == null) {
          res.status(403).json({
            message: "Category not found"
          });
        } else {
          product
            .create(req.body)
            .then(result => {
              res.status(201).json({
                product: {
                  id: result.id,
                  title: result.title,
                  price: rupiahFormat(result.price),
                  stock: result.stock,
                  CategoryId: result.CategoryId,
                  updatedAt: result.updatedAt,
                  createdAt: result.createdAt
                }
              });
            })
            .catch(err => {
              res.status(500).json({
                message: err.errors[0].message
              });
            });
        }
      });
    }
  }

  static async showAllProduct(req, res) {
    product
      .findAll()
      .then(dataProduk => {
        dataProduk.forEach(product => {
          product.price = rupiahFormat(product.price);
        });
        res.status(201).json({
          products: dataProduk
        });
      })
      .catch(err => {
        res.status(500).json({
          message: "Terjadi kesalahan pada server"
        });
      });
  }

  static async editProduct(req, res) {
    const token = req.get("token");
    const userEncoded = verifyToken(token);
    if (userEncoded.role != 1) {
      res.status(403).json({
        message: "Your are not admin"
      });
    } else {
      product
        .update(req.body, {
          where: {
            id: req.params.id
          },
          returning: true
        })
        .then(updateProduck => {
          updateProduck[1][0].price = rupiahFormat(updateProduck[1][0].price);
          res.status(201).json({
            product: updateProduck[1][0]
          });
        })
        .catch(err => {
          res.status(500).json({
            message: "Terjadi kesalahan pada server"
          });
        });
    }
  }

  static async editCategoryId(req, res) {
    const token = req.get("token");
    const userEncoded = verifyToken(token);
    if (userEncoded.role != 1) {
      res.status(403).json({
        message: "Your are not admin"
      });
    } else {
      await categorie.findByPk(req.body.CategoryId).then(async categor => {
        if (categor == null) {
          res.status(403).json({
            message: "Category not found"
          });
        } else {
          product
            .update(req.body, {
              where: {
                id: req.params.id
              },
              returning: true
            })
            .then(updateProduck => {
              updateProduck[1][0].price = rupiahFormat(
                updateProduck[1][0].price
              );
              res.status(201).json({
                product: updateProduck[1][0]
              });
            })
            .catch(err => {
              res.status(500).json({
                message: "Terjadi kesalahan pada server"
              });
            });
        }
      });
    }
  }

  static async deleteProduct(req, res) {
    const token = req.get("token");
    const userEncoded = verifyToken(token);
    if (userEncoded.role != 1) {
      res.status(403).json({
        message: "Your are not admin"
      });
    }else {
      product.destroy({
        where: {id: req.params.id}
      }).then((result) => {
        if(!result) {
          res.status(500).json({ message: "Product does not exist" });
        }else {
          res.status(200).json({ message: "Your product has been successfully deleted" });
        }
      }).catch(err => {
        res.status(500).json({
          message: "Terjadi kesalahan pada server"
        });
      })
    }
  }
}

module.exports = productController;
