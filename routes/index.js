const route = require("express").Router();
// const authentication = require("../middlewares/authentication");
// const { userAuthorization, photoAuthorization, sosialMediaAuthorization, commentAuthorization } = require("../middlewares/authorization");
const userController = require("../controller/userController");
 
 
route.get("/", (req, res) => {
  res.json({
    page: "home",
  });
});
 
 
// user
route.post("/users/register", userController.register);
route.post("/users/login", userController.login);

module.exports = route