const express = require('express');
const router = express.Router();
const productController = require('../controllers/ProductController');
const { authMiddleWare } = require('../middleware/authmiddleware.js');

router.post('/create', productController.createProduct)
router.put('/update/:id', authMiddleWare , productController.updateProduct)
router.get('/get-details/:id', productController.getDetailsProduct)
router.delete('/delete/:id', authMiddleWare, productController.deleteProduct)
router.get('/get-all', productController.getAllProduct)
router.delete('/delete-many', authMiddleWare, productController.deleteMany)

module.exports = router