const express = require('express');
const router = express.Router();
const productController = require('../controllers/ProductController');
const { authMiddleWare, authUserMiddleWare } = require('../middleware/authmiddleware.js');

router.post('/create', productController.createProduct)
router.put('/update/:id', authMiddleWare , productController.updateProduct)
router.get('/get-details/:id', productController.getDetailsProduct)
router.delete('/delete/:id', productController.deleteProduct)
router.get('/get-all', productController.getAllProduct)

module.exports = router