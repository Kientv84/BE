const express = require("express");
const router = express.Router();
const productController = require("../controllers/ProductController");
const { authMiddleWare } = require("../middleware/authMiddleware.js");

router.post("/create", productController.createProduct);
router.put("/update/:id", authMiddleWare, productController.updateProduct);
router.get("/product-details/:id", productController.getDetailsProduct);
router.delete("/delete/:id", authMiddleWare, productController.deleteProduct);
router.get("/get-all", productController.getAllProduct);
router.get("/get-all-search", productController.getAllSearch);
router.post("/delete-many", authMiddleWare, productController.deleteMany);
router.get("/get-all-type", productController.getAllType);
router.get("/get-all-branch", productController.getAllBranch);
router.get("/catalogsearch/result", productController.getAllsearchProducts);

module.exports = router;
