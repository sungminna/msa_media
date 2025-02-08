import express from 'express';
import multer from 'multer';
import s3Controller from '../controllers/s3Controller.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// S3 관련 엔드포인트
router.post('/upload', upload.single('file'), s3Controller.uploadFile);
router.get('/file', s3Controller.getFile);
router.delete('/file', s3Controller.deleteFile);

export default router