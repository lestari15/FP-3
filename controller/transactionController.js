const { transactionHistorie, product, user, categorie } = require('../models');
const { verifyToken } =  require('../helpers/jwt');
const user = require('../models/user');
const { inputProduct } = require('./productController');

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
                 total_price: product.price,
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
}
