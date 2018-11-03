import express from 'express';
import { list } from "../controllers/keyword";

const router = express.Router();

router.get('/', list);


export default router;
