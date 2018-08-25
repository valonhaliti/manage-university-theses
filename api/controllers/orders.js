const asyncHandler = require('../utils/asyncHandler');
const db = require('../../dbconnection');

exports.orders_create = asyncHandler(async (req, res, next) => {
    console.log(req.body);
    const order = {
        productId: req.body.productId,
        quantity: req.body.quantity,
        is_deleted: 0
    }
    const rows = await db.query('INSERT INTO orders SET ?;', order);
    order.id = rows.insertId;
    return res.status(201).json({ createdOrder: order });
});

exports.orders_get_all = asyncHandler(async (req, res, next) => {    
    const rows = await db.query('SELECT * FROM orders WHERE is_deleted = 0;');
    return res.status(200).json({ res: rows });
});

exports.orders_get = asyncHandler(async (req, res, next) => {
    const id = req.params.orderId;
    const rows = await db.query('SELECT * FROM orders WHERE is_deleted = 0 AND id = ?;', id);
    return res.status(200).json({ res: rows });
});

exports.orders_update = asyncHandler(async (req, res, next) => {
    const updateOrder = {
        productId: req.body.productId,
        quantity: req.body.quantity,
        is_deleted: 0
    }
    await db.query('UPDATE orders SET ? WHERE id = ?;', [updateOrder, req.params.orderId]);
    updateOrder.id = req.param.orderId;
    return res.status(201).json({ updateOrder });
});

exports.orders_delete = asyncHandler(async (req, res, next) => {
    await db.query('UPDATE orders SET is_deleted = 1 WHERE id = ?;', req.params.orderId);
    return res.status(201).json({ message: 'Successfully deleted!' });
})
