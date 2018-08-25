const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');
const OrdersController = require('../controllers/orders');


// Create
router.post('/', checkAuth, OrdersController.orders_create);

// Read
router.get('/:orderId', OrdersController.orders_get);
router.get('/', OrdersController.orders_get_all);

// Update
router.patch('/:orderId', checkAuth, OrdersController.orders_update);

// Delete
router.delete('/:orderId', checkAuth, OrdersController.orders_delete);

module.exports = router;
