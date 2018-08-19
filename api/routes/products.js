const express = require('express');
const router = express.Router();

const Database = require('../../dbconnection');
const db = new Database();
// FIXME: this should not be here

router.get('/', async (req, res, next) => {    
    try {
        const rows = await db.query('SELECT * FROM products');
        res.status(200).json({
            res: rows
        });
    } catch (err) {
        res.status(500).json({ err });
    }
});

router.post('/', async (req, res, next) => {
    const product = {
        name: req.body.name,
        price: req.body.price
    }
    try {
        const rows = await db.query('INSERT INTO products SET ?', product);
        product.id = rows.insertId;
        res.status(201).json({
            createdProduct: product
        });
    } catch (err) {
        res.status(500).json({ err });
    }
});

router.get('/:productId', async (req, res, next) => {
    const id = req.params.productId;
    try {
        const rows = await db.query('SELECT * FROM products where id = ?', id);
        res.status(200).json({
            res: rows
        });
    } catch (err) {
        res.status(500).json({ err });
    }
});

router.patch('/:productId', async (req, res, next) => {
    const updateProduct = {
        name: req.body.name,
        price: req.body.price
    }
    try {
        await db.query('UPDATE products SET ? WHERE id = ?', [updateProduct, req.params.productId]);
        updateProduct.id = req.param.productId;
        res.status(201).json({ updateProduct });
    } catch (err) {
        console.log(err);
        res.status(500).json({ err: 'error trying to update this product' });
    }
});


router.delete('/:productId', async (req, res, next) => {
    try {
        await db.query('DELETE FROM products WHERE id = ?', req.params.productId);
        res.status(201).json({ message: 'Successfully deleted!' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ err: 'error trying to delete this product' });
    }
});

module.exports = router;
