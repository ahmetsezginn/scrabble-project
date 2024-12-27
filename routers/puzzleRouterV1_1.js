import express from 'express';
import { generatePuzzle } from '../controllers/puzzleControllerV1_1.js';

const router = express.Router();

router.post('/', generatePuzzle);

export default router;