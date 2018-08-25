const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const db = require('../../dbconnection');


router.post('/', asyncHandler(async (req, res, next) => {
    const product = {
        name: req.body.name,
        price: req.body.price,
        is_deleted: 0
    }
    const rows = await db.query('INSERT INTO products SET ?;', product);
    product.id = rows.insertId;
    res.status(201).json({ createdProduct: product });
}));


router.get('/:productId', asyncHandler(async (req, res, next) => {
    const id = req.params.productId;
    const rows = await db.query('SELECT * FROM products WHERE is_deleted = 0 AND id = ?;', id);
    if (rows && rows.length > 0)
        res.status(200).json({ res: rows });
    else
        res.status(404).json({ message: 'product not found' });
}));

router.get('/', asyncHandler(async (req, res, next) => {    
    const rows = await db.query('SELECT * FROM products WHERE is_deleted = 0;');
    res.status(200).json({ res: rows });
}));


router.patch('/:productId', asyncHandler(async (req, res, next) => {
    const updateProduct = {
        name: req.body.name,
        price: req.body.price,
        is_deleted: 0
    }
    await db.query('UPDATE products SET ? WHERE id = ?;', [updateProduct, req.params.productId]);
    updateProduct.id = req.param.productId;
    res.status(201).json({ updateProduct });
}));


router.delete('/:productId', asyncHandler(async (req, res, next) => {
    await db.query('UPDATE products SET is_deleted = 1 WHERE id = ?;', req.params.productId);
    res.status(201).json({ message: 'Successfully deleted!' });
}));

module.exports = router;
