import express from 'express';
import { signUp, signIn, get, list, update, remove } from "../controllers/user";
import checkAuth from '../middleware/check-auth';

const router = express.Router();

router.post('/signup', signUp);
router.post('/login', signIn);
router.get('/', list);
router.get('/:userId', get);
router.put('/:userId', checkAuth, update);
router.delete('/:userId', checkAuth, remove);


export default router;

