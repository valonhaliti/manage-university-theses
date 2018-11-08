import express from 'express';
import { search } from "../controllers/search";

const router = express.Router();

router.get('/', search);

export default router;
