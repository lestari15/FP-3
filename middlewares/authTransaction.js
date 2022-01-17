const jwt = require("jsonwebtoken");
const {transactionHistorie} = require('../models')
require('dotenv').config();

function authorizationTrans(req, res, next) {
  const authHeader = req.headers.token
  encoded = jwt.verify(authHeader, 'rahasia')
  if (authHeader == null) return res.status(401).send({
    message: 'Unauthorized',
    status: false
  })
  transactionHistorie.findAll({
    where: {user_id: authHeader.id}
  })
  .then(data => {
    if(data || encoded.role == 1) {
      next()
    } else {
      res.sendStatus(401).send({
        message: 'Unauthorized',
        status: false
      })
    }
  })
}
module.exports = {authorizationTrans};