const express = require('express');
const { submitRelease } = require('../controllers/distributionController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.post('/submit', protect, submitRelease);

module.exports = router;
