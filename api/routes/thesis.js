const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');
const ThesisController = require('../controllers/thesis');

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
router.post('/', checkAuth, upload.single('thesisPDF'), ThesisController.thesis_create);

// Read
router.get('/:thesisId', ThesisController.thesis_get);
router.get('/', ThesisController.thesis_get_all);

// Update
router.patch('/:thesisId', ThesisController.thesis_update);

// Delete
router.delete('/:thesisId', ThesisController.thesis_delete);

module.exports = router;
