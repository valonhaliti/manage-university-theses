import express from 'express';
import { compareThesisWithAll, getSimilarity } from '../controllers/compareTheses'

const router = express.Router();

router.get('/compareWithAll/:thesisId', compareThesisWithAll);
router.get('/getSimilarity/:thesisId', getSimilarity);

export default router;
