const express = require('express');
const router = express.Router();

const Database = require('../../dbconnection');
const db = new Database();

router.get('/', async (req, res, next) => {    
    try {
        const rows = await db.query('SELECT * FROM orders');
        res.status(200).json({
            res: rows
        });
    } catch (err) {
        res.status(500).json({ err });
    }
});

router.post('/', (req, res, next) => {
    const order = {
        productId: req.body.productId,
        quantity: req.body.quantity
    }
    res.status(201).json({
        message: 'Handling POST requests to /orders',
        order
    });
});

router.get('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    res.status(200).json({
        message: `Handling POST request to /orders/${id}!!`
    });
});

router.patch('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    res.status(200).json({
        message: `Handling POST request to /orders/${id}`
    });
});


router.delete('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    res.status(200).json({
        message: `Handling POST request to /orders/${id}`
    });
});



module.exports = router;
