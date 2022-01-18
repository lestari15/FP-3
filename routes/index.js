const route = require("express").Router();
const authentication = require("../middlewares/authentication");
const { userAuthorization } = require("../middlewares/authorization");
const { authorizationTrans } = require('../middlewares/authTransaction')
const userController = require("../controller/userController");
const productController = require("../controller/productController");
const categoryController = require('../controller/categoryController');
const transactionController = require('../controller/transactionController')


route.get("/", (req, res) => {
  res.json({
    page: "home",
  });
});


// user
route.post("/users/register", userController.register);
route.post("/users/login", userController.login);

route.put("/users/:id", authentication, userController.update);
route.delete("/users/:id", authentication, userController.delete);
route.patch("/users/:id", authentication, userController.topUp);

route.post("/products", authentication, userAuthorization, productController.inputProduct);
route.get("/products", authentication, productController.showAllProduct);
route.put("/products/:id", authentication, userAuthorization, productController.editProduct);
route.patch("/products/:id", authentication, userAuthorization, productController.editCategoryId);
route.delete("/products/:id", authentication, userAuthorization, productController.deleteProduct);


route.post('/categories', authentication, userAuthorization, categoryController.createCategory);
route.get('/categories', authentication, userAuthorization, categoryController.getCatergories);
route.patch('/categories/:categoryId', authentication, userAuthorization, categoryController.updateCategory);
route.delete('/categories/:categoryId', authentication, userAuthorization, categoryController.deleteCategory);

route.post('/transactions', authentication, transactionController.createTransaction);
route.get('/transactions/user', authentication, transactionController.getTransUser);
route.get('/transaction/admin', authentication, userAuthorization, transactionController.getTransAdmin);
route.get('/transaction/:transactionId', authentication, authorizationTrans, transactionController.getTransId);
module.exports = route

// npx sequelize model:generate --name product --attributes title:string, price:number, stok:number, CategoryId:number