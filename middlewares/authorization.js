const { user } = require("../models");
const {verifyToken} = require('../helpers/jwt'); 

function userAuthorization(req, res, next) {
  if (req.headers.token == null) return res.status(401).send({
    message: 'Unauthorized',
    status: false
  })
  let decoded = verifyToken(req.headers.token)
  user.findOne({
    where: {
      id: decoded.id
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).json({
          name: "Data not found",
          message: `User not found!`
        });
      }
      if (user.role === 1) {
        return next();
      } else {
        return res.status(403).json({
          name: "Authorization error",
          message: `User does not have permission to access`
        });
      }
    })
    .catch(err => {
      return res.status(500).json(err);
    })
}

module.exports = {
  userAuthorization
}