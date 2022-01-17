const { transactionHistorie, product, user, categorie } = require('../models');
const { verifyToken } =  require('../helpers/jwt');
const user = require('../models/user');
const rupiahFormat = require('../utils/rupiahFormat');

class transactionController {
  static createTransaction = (req, res) => {
    let { productId, quantity } = req.body;
    product.findOne({
      where: { title: productId}
    })
    .then(product => {
      let status = 201;
      encoded = verifyToken(res.headers.token);
        if (!product) {
          status = 404;
          res.status(status).send('Product not found');
        }
        else if(product.stock < quantity) {
          status = 400;
          res.status(status).send('Quantity is more than existing stock!')
        }
        else if(encoded.balance < product.price) {
          status = 400;
          res.status(status).send('Your balance is not enough!')
        }
        else {
          return product.decrement('stock', {by: quantity})
          .then(() => {
            return user.findById(encoded.id)
          })
          .then((user) => {
            return user.decrement('balance', {by: product.price})
          })
          .then(() => {
            return categorie.findById(product.CategoryId)
          })
          .then((categorie) => {
            return categorie.increment('sold_product_amount', { by: quantity})
          })
          .then(() => {
            input = {
              product_id: productId,
              user_id: encoded.id,
              quantity: quantity,
              total_price: data.price
            }
            return transactionHistorie.create(input)
          })
          .then((data) => {
             let output = { 
               message: 'You have been successfully purchase the product',
               transactionBill: {
                 total_price: rupiahFormat(product.price),
                 quantity: quantity,
                 product_name: product.product_name
                 }
            }
            res.status(status).send(output)
          })
          .catch(err => {
            let errCode = 500;
             if (err.name.includes("DatabaseError")) {
                console.log(err);
                errCode = 400;
             }
               res.status(errCode).json(err);
          })
        }
    })
    .catch(err => {
      let errCode = 500;
        if (err.name.includes("DatabaseError")) {
          console.log(err);
          errCode = 400;
        }
        res.status(errCode).json(err);
    })
  }

  static getTransUser = (req, res) => {
    let encoded = verifyToken(req.headers.token);
    transactionHistorie.findAll({
      where: {
        user_id: encoded.id
      },
      include: [
        {
          model: product,
          attributes: ['id', 'title', 'price', 'stock', 'CategoryId']
        }
      ]
    })
    .then(data => {
      let errCode = 200;
      data.product.price = rupiahFormat(data.product.price);
      if (!data) {
        errCode = 404;
        res.status(errCode).send('Transaction not found!');
      }
      res.status(errCode).send({transactionHistories: data});
    })
    .catch(err => {
      let errCode = 500;
        if (err.name.includes("DatabaseError")) {
          console.log(err);
          errCode = 400;
        }
        res.status(errCode).json(err);
    })
  }

  static getTransAdmin = (req, res) => {
    let encoded = verifyToken(req.headers.token);
    transactionHistorie.findAll({
      include: [
        {
          model: product,
          attributes: ['id', 'title', 'price', 'stock', 'CategoryId']
        },
        {
          model: user,
          attributes: ['id', 'email', 'balance', 'gender', 'role']
        }
      ]
    })
    .then(data => {
      let errCode = 200;
      data.product.price = rupiahFormat(data.product.price);
      if (!data) {
        errCode = 404;
        res.status(errCode).send('Transaction not found!');
      }
      if (data.user.role == 1) {
        data.user.role = 'admin'
      } else {
        data.user.role = 'user'
      }
      res.status(errCode).send({transactionHistories: data});
    })
    .catch(err => {
      let errCode = 500;
        if (err.name.includes("DatabaseError")) {
          console.log(err);
          errCode = 400;
        }
        res.status(errCode).json(err);
    })
  }

  getTransId = (req, res) => {
    let encoded = req.headers.token;
    transactionHistorie.findById({
      where: {id: req.params.transactionId},
      include: {
        model: product,
        attributes: ['id', 'title', 'price', 'stock', 'CategoryId']
      }
    })
    .then(data => {
      let errCode = 200;
      data.product.price = rupiahFormat(data.product.price);
      if (!data) {
        errCode = 404;
        res.status(errCode).send('Transaction not found!');
      }
      res.status(errCode).send({transactionHistories: data});
    })
    .catch(err => {
      let errCode = 500;
        if (err.name.includes("DatabaseError")) {
          console.log(err);
          errCode = 400;
        }
        res.status(errCode).json(err);
    })
  }
}
