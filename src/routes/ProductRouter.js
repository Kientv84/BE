const express = require('express');
const router = express.Router();
const productController = require('../controllers/ProductController');
const { authMiddleWare, authUserMiddleWare } = require('../middleware/authMiddleware.js');
const Product = require('../models/ProductModel.js');

router.post('/create', productController.createProduct)
router.put('/update/:id', authMiddleWare, productController.updateProduct)
router.get('/get-details/:id', productController.getDetailsProduct)
router.delete('/delete/:id', authMiddleWare, productController.deleteProduct)
router.get('/get-all', productController.getAllProduct)
router.post('/delete-many', authMiddleWare, productController.deleteMany)
router.get('/get-all-type', productController.getAllType)

module.exports = router