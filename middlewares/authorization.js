const { user } = require("../models");

function userAuthorization(req, res, next) {
  const userId = req.params.id;
  const authenticationUser = res.locals.user;

  user.findOne({
    where: {
      id: userId
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).json({
          name: "Data not found",
          message: `User with id "${userId}" not found`
        });
      }
      if (user.id === authenticationUser.id) {
        return next();
      } else {
        return res.status(403).json({
          name: "Authorization error",
          message: `User with email "${authenticationUser.email}" does not have permission to access User with email "${user.email}"`
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