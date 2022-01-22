const { transactionHistorie, product, user, categorie } = require("../models");
const { verifyToken } = require("../helpers/jwt");
const rupiahFormat = require("../utils/rupiahFormat");

class transactionController {
  static createTransaction = async (req, res) => {
    var { productId, quantity } = req.body;
    var totalPrice;
    var totalBalance
    quantity = Number(quantity);
    let encoded = verifyToken(req.headers.token);
    await user.findByPk(encoded.id).then(async cariBalance => {
      totalBalance = cariBalance.balance
      await product
        .findOne({
          where: { id: productId }
        })
        .then(async data => {
          let status = 201;
          if (!data) {
            status = 404;
            res.status(status).send("Product not found");
          } else if (data.stock < quantity) {
            status = 400;
            res.status(status).send("Quantity is more than existing stock!");
          }
          else if (totalBalance < quantity * data.price) {
            status = 400;
            res.status(status).send("Your balance is not enough!");
          }
          else {
            await product.update(
              {
                stok: data.stok - quantity
              },
              {
                where: { id: data.id }
              }
            );
            return product
              .findByPk(productId)
              .then(async data => {
                totalPrice = data.price * quantity;
                await user.update(
                  {
                    balance: totalBalance - totalPrice
                  },
                  {
                    where: {
                      id: encoded.id
                    }
                  }
                );
                return data;
              })
              .then(async data => {
                return await categorie.findByPk(data.CategoryId);
              })
              .then(async data => {
                return await categorie.update(
                  {
                    sold_product_amount: data.sold_product_amount + quantity
                  },
                  {
                    where: { id: data.id }
                  }
                );
              })
              .then(async () => {
                return await product.findByPk(productId);
              })
              .then(data => {
                let input = {
                  product_id: productId,
                  user_id: encoded.id,
                  quantity: quantity,
                  total_price: totalPrice
                };
                transactionHistorie.create(input);
                return data;
              })
              .then(data => {
                let output = {
                  message: "You have been successfully purchase the product",
                  transactionBill: {
                    total_price: rupiahFormat(totalPrice),
                    quantity: quantity,
                    product_name: data.title
                  }
                };
                res.status(201).send(output);
              });
          }
        })
        .catch(err => {
          let errCode = 500;
          if (err.name.includes("DatabaseError")) {
            console.log(err);
            errCode = 400;
          }
          console.log(err);
          res.status(errCode).json(err);
        });
    });
  };

  static getTransUser = (req, res) => {
    let encoded = verifyToken(req.headers.token);
    transactionHistorie
      .findAll({
        where: {
          user_id: encoded.id
        },
        include: [
          {
            model: product,
            attributes: ["id", "title", "price", "stok", "CategoryId"]
          }
        ]
      })
      .then(data => {
        let errCode = 200;
        data.map(item => {
          item.dataValues.total_price = rupiahFormat(
            item.dataValues.total_price
          );
          item.dataValues.product.dataValues.price = rupiahFormat(
            item.dataValues.product.dataValues.price
          );
        });
        if (!data) {
          errCode = 404;
          res.status(errCode).send("Transaction not found!");
        }
        res.status(errCode).json({ transactionHistories: data });
      })
      .catch(err => {
        let errCode = 500;
        if (err.name.includes("DatabaseError")) {
          console.log(err);
          errCode = 400;
        }
        console.log(err);
        res.status(errCode).json(err);
      });
  };

  static getTransAdmin = (req, res) => {
    transactionHistorie
      .findAll({
        include: [
          {
            model: product,
            attributes: ["id", "title", "price", "stok", "CategoryId"]
          },
          {
            model: user,
            attributes: ["id", "email", "balance", "gender", "role"]
          }
        ]
      })
      .then(data => {
        let errCode = 200;
        console.log(data);
        data.map(item => {
          item.dataValues.total_price = rupiahFormat(
            item.dataValues.total_price
          );
          item.dataValues.product.dataValues.price = rupiahFormat(
            item.dataValues.product.dataValues.price
          );
          item.dataValues.user.dataValues.balance = rupiahFormat(
            item.dataValues.user.dataValues.balance
          );
        });
        if (!data) {
          errCode = 404;
          res.status(errCode).send("Transaction not found!");
        }
        data.map(item => {
          if (item.dataValues.user.role == 1) {
            item.dataValues.user.role = "admin";
          } else {
            item.dataValues.user.role = "user";
          }
        });
        res.status(errCode).send({ transactionHistories: data });
      })
      .catch(err => {
        let errCode = 500;
        if (err.name.includes("DatabaseError")) {
          console.log(err);
          errCode = 400;
        }
        console.log(err);
        res.status(errCode).json(err);
      });
  };

  static getTransId = (req, res) => {
    transactionHistorie
      .findOne({
        where: { id: req.params.transactionId },
        include: {
          model: product,
          attributes: ["id", "title", "price", "stok", "CategoryId"]
        }
      })
      .then(data => {
        let errCode = 200;
        if (!data) {
          errCode = 404;
          res.status(errCode).send("Transaction not found!");
        }
        data.total_price = rupiahFormat(data.total_price);
        data.product.price = rupiahFormat(data.product.price);
        res.status(errCode).send({ transactionHistories: data });
      })
      .catch(err => {
        let errCode = 500;
        if (err.name.includes("DatabaseError")) {
          console.log(err);
          errCode = 400;
        }
        console.log(err);
        res.status(errCode).json(err);
      });
  };
}

module.exports = transactionController;
