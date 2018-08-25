const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');
const ProductsController = require('../controllers/products');

const multer = require('multer');
const storage = multer.diskStorage({
    destination: function(req, file, callback) { 
        callback(null, './uploads/'); 
    },
    filename: function(req, file, callback) { 
        callback(null, Date.now() + file.originalname); 
    }
});
const upload = multer({ storage });


// Create
router.post('/', checkAuth, upload.single('productImage'), ProductsController.products_create);

// Read
router.get('/:productId', ProductsController.products_get);
router.get('/', ProductsController.products_get_all);

// Update
router.patch('/:productId', ProductsController.products_update);

// Delete
router.delete('/:productId', ProductsController.products_delete);

module.exports = router;
