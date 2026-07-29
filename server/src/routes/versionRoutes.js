const express = require('express');
const { saveVersion, getVersionsByProject } = require('../controllers/versionController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.post('/', protect, saveVersion);
router.get('/project/:projectId', protect, getVersionsByProject);

module.exports = router;
