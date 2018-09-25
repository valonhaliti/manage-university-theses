import express from 'express';
import checkAuth from '../middleware/check-auth';
import multer from 'multer';
import { create, get, list, update, remove } from '../controllers/thesis';

const router = express.Router();
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, './uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + file.originalname)
});
const upload = multer({ storage });

router.post('/', checkAuth, upload.single('thesisPDF'), create);
router.get('/:thesisId', get);
router.get('/', list);
router.patch('/:thesisId', checkAuth, update);
router.delete('/:thesisId', checkAuth, remove);

export default router;
