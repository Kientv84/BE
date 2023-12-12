const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/OrderController');
const { authUserMiddleWare, authMiddleWare } = require('../middleware/authMiddleware');

router.post('/create/:id', authUserMiddleWare, OrderController.createOrder)
router.get('/get-all-order/:id', authUserMiddleWare, OrderController.getAllDetailsOrder)
router.get('/get-details-order/:id', OrderController.getDetailsOrder)
router.delete('/cancel-order/:id', authUserMiddleWare, OrderController.cancelOrderDetails)
router.get('/get-all-order', authMiddleWare, OrderController.getAllOrder)
router.put('/update-delivery-state/:id', authMiddleWare, OrderController.updateDeliveryState)
router.put('/update-payment-state/:id', authMiddleWare, OrderController.updatePaymentState)
router.delete('/delete/:id', authMiddleWare, OrderController.deleteOrder)
router.post('/delete-many', authMiddleWare, OrderController.deleteMany)

module.exports = router