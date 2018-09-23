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


router.post('/', checkAuth, upload.single('thesisPDF'), ThesisController.create);

router.get('/:thesisId', ThesisController.get);
router.get('/', ThesisController.list);

router.patch('/:thesisId', ThesisController.update);

router.delete('/:thesisId', ThesisController.delete);

module.exports = router;
