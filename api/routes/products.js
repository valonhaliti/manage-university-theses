const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const db = require('../../dbconnection');


router.post('/', asyncHandler(async (req, res, next) => {
    const product = {
        name: req.body.name,
        price: req.body.price
    }
    const rows = await db.query('INSERT INTO products SET ?', product);
    product.id = rows.insertId;
    res.status(201).json({
        createdProduct: product
    });
}));


router.get('/:productId', asyncHandler(async (req, res, next) => {
    const id = req.params.productId;
    const rows = await db.query('SELECT * FROM products where id = ?', id);
    res.status(200).json({
        res: rows
    });
}));

router.get('/', asyncHandler(async (req, res, next) => {    
    const rows = await db.query('SELECT * FROM products');
    res.status(200).json({
        res: rows
    });
}));


router.patch('/:productId', asyncHandler(async (req, res, next) => {
    const updateProduct = {
        name: req.body.name,
        price: req.body.price
    }
    await db.query('UPDATE products SET ? WHERE id = ?', [updateProduct, req.params.productId]);
    updateProduct.id = req.param.productId;
    res.status(201).json({ updateProduct });
}));


router.delete('/:productId', asyncHandler(async (req, res, next) => {
    // FIXME: we should not delete from db, instead we should update (an attribute isdeleted for example)
    await db.query('DELETE FROM products WHERE id = ?', req.params.productId);
    res.status(201).json({ message: 'Successfully deleted!' });
}));

module.exports = router;
