const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { createOrder, listMyOrders, getMyOrder } = require('../controllers/orderController');

router.use(verifyToken);

router.post('/', createOrder);
router.get('/mine', listMyOrders);
router.get('/:id', getMyOrder);

module.exports = router;
