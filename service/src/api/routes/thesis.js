import express from 'express';
import checkAuth from '../middleware/check-auth';
import multer from 'multer';
import { create, get, list, update, remove, downloadThesis, getByUser, listThesisByStatus } from '../controllers/thesis';

const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, './uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + file.originalname)
});
const upload = multer({ storage });

router.post('/', checkAuth, upload.single('thesisPDF'), create);
router.get('/:thesisId', get);
router.get('/byuser/:userId', getByUser);
router.get('/byStatus/:status/:from/:to', listThesisByStatus);
router.get('/', list);
router.put('/:thesisId', checkAuth, upload.single('thesisPDF'), update);
router.delete('/:thesisId', checkAuth, remove);
router.get('/download/:fileName', downloadThesis);

export default router;
