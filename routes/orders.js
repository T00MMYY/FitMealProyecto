const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/auth');
const { createOrder, listAllOrders, listMyOrders, getMyOrder } = require('../controllers/orderController');

router.use(verifyToken);

router.get('/all', requireRole(1), listAllOrders);
router.post('/', createOrder);
router.get('/mine', listMyOrders);
router.get('/:id', getMyOrder);

module.exports = router;
