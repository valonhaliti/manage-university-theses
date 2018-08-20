const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const db = require('../../dbconnection');


router.post('/', asyncHandler(async (req, res, next) => {
    const order = {
        productId: req.body.productId,
        quantity: req.body.quantity
    }
    const rows = await db.query('INSERT INTO orders SET ?', order);
    order.id = rows.insertId;
    res.status(201).json({
        createdOrder: order
    });
}));


router.get('/:orderId', asyncHandler(async (req, res, next) => {
    const id = req.params.orderId;
    const rows = await db.query('SELECT * FROM orders where id = ?', id);
    res.status(200).json({
        res: rows
    });
}));

router.get('/', asyncHandler(async (req, res, next) => {    
    const rows = await db.query('SELECT * FROM orders');
    res.status(200).json({
        res: rows
    });
}));


router.patch('/:orderId', asyncHandler(async (req, res, next) => {
    const updateOrder = {
        productId: req.body.productId,
        quantity: req.body.quantity
    }
    await db.query('UPDATE orders SET ? WHERE id = ?', [updateOrder, req.params.orderId]);
    updateOrder.id = req.param.orderId;
    res.status(201).json({ updateOrder });
}));


router.delete('/:orderId', asyncHandler(async (req, res, next) => {
    // FIXME: we should not delete from db, instead we should update (an attribute isdeleted for example)
    await db.query('DELETE FROM orders WHERE id = ?', req.params.orderId);
    res.status(201).json({ message: 'Successfully deleted!' });
}));


module.exports = router;
