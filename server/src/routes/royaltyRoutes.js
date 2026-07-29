const express = require('express');
const { saveRoyaltySplit, getRoyaltySplit } = require('../controllers/royaltyController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.post('/', protect, saveRoyaltySplit);
router.get('/project/:projectId', protect, getRoyaltySplit);

module.exports = router;
