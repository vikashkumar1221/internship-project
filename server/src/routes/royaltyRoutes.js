const express = require('express');
const { saveRoyaltySplit, getRoyaltySplit, downloadSplitSheetPDF } = require('../controllers/royaltyController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.post('/', protect, saveRoyaltySplit);
router.get('/project/:projectId', protect, getRoyaltySplit);
router.get('/project/:projectId/pdf', protect, downloadSplitSheetPDF);

module.exports = router;
