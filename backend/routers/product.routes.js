const { Router } = require("express");
const {
  getAllProducts,
  getOneProduct,
  addProduct,
  updateProduct,
  deleteProducts,
} = require("../controller/product");
const checkAdmin = require("../middleware/check-Admin");

const productRouter = Router();

productRouter.get("/get_all_products", getAllProducts);
productRouter.get("/get_one_product/:id", getOneProduct);
productRouter.post("/add_product", checkAdmin, addProduct);
productRouter.put("/update_product/:id", checkAdmin, updateProduct);
productRouter.delete("/delete_product/:id", checkAdmin, deleteProducts);

module.exports = productRouter;
