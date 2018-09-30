import express from 'express';
import { signUp, signIn, get, list } from "../controllers/user";


const router = express.Router();

router.post('/signup', signUp);
router.post('/login', signIn);
router.get('/', list);
router.get('/:userId', get);


export default router;

