const express = require('express');
const { saveVersion, getVersionsByProject, restoreVersion } = require('../controllers/versionController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.post('/', protect, saveVersion);
router.get('/project/:projectId', protect, getVersionsByProject);
router.post('/:id/restore', protect, restoreVersion);

module.exports = router;
