const express = require('express');
const { uploadStem, isolateStemsAI, getStemsByTrack } = require('../controllers/stemController');
const { protect } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

const router = express.Router();

router.post('/upload', protect, upload.single('audio'), uploadStem);
router.post('/ai-isolate', protect, isolateStemsAI);
router.get('/track/:trackId', protect, getStemsByTrack);

module.exports = router;
