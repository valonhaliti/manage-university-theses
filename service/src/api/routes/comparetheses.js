import express from 'express';
import { compareThesisWithAll } from '../controllers/compareTheses'

const router = express.Router();

router.get('/comparewithall/:thesisId', compareThesisWithAll);

export default router;
