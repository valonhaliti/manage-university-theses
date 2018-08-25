const asyncHandler = require('../utils/asyncHandler');
const db = require('../../dbconnection');

exports.products_create = asyncHandler(async (req, res, next) => {
    const product = {
        name: req.body.name,
        price: req.body.price,
        product_image: req.file.path,
        is_deleted: 0
    }
    const rows = await db.query('INSERT INTO products SET ?;', product);
    product.id = rows.insertId;
    return res.status(201).json({ createdProduct: product });
})

exports.products_get = asyncHandler(async (req, res, next) => {
    const id = req.params.productId;
    const rows = await db.query('SELECT * FROM products WHERE is_deleted = 0 AND id = ?;', id);
    if (rows && rows.length > 0)
        return res.status(200).json({ res: rows });
    else
        return res.status(404).json({ message: 'product not found' });
});

exports.products_get_all = asyncHandler(async (req, res, next) => {    
    const rows = await db.query('SELECT id, name, price, product_image FROM products WHERE is_deleted = 0;');
    const response = {
        count: rows.length,
        rows
    }
    return res.status(200).json(response);
});

exports.products_update = asyncHandler(async (req, res, next) => {
    const updateProduct = {
        name: req.body.name,
        price: req.body.price,
        is_deleted: 0
    }
    await db.query('UPDATE products SET ? WHERE id = ?;', [updateProduct, req.params.productId]);
    updateProduct.id = req.param.productId;
    return res.status(201).json({ updateProduct });
})

exports.products_delete = asyncHandler(async (req, res, next) => {
    await db.query('UPDATE products SET is_deleted = 1 WHERE id = ?;', req.params.productId);
    return res.status(201).json({ message: 'Successfully deleted!' });
})




