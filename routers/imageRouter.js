// routers/imageRouter.js
import express from 'express';
import { saveImage, getImage } from '../controllers/imageController.js';

const router = express.Router();

// POST /api/images/save
router.post('/save', saveImage);

// GET /api/images/:filename
router.get('/:filename', getImage);

export default router;