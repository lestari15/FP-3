const route = require("express").Router();
const authentication = require("../middlewares/authentication");
const { userAuthorization } = require("../middlewares/authorization");
const userController = require("../controller/userController");
const productController = require("../controller/productController");


route.get("/", (req, res) => {
  res.json({
    page: "home",
  });
});


// user
route.post("/users/register", userController.register);
route.post("/users/login", userController.login);

// authentication middleware
route.use(authentication);

// user authorization middleware
route.use("/users/:id", userAuthorization);

route.put("/users/:id", userController.update);
route.delete("/users/:id", userController.delete);
route.patch("/users/:id", userController.topUp);

route.post("/products", productController.inputProduct);
route.get("/products", productController.showAllProduct);
route.put("/products/:id", productController.editProduct);
route.patch("/products/:id", productController.editCategoryId);
route.delete("/products/:id", productController.deleteProduct);

module.exports = route

// npx sequelize model:generate --name product --attributes title:string, price:number, stok:number, CategoryId:number