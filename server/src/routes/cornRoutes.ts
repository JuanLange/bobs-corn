import express from 'express';
import { buyCorn, getPurchaseHistory } from '../controllers/cornController';

const router = express.Router();

// I define the routes for corn purchases
router.post('/buy', buyCorn);
router.get('/history', getPurchaseHistory);

export default router;
