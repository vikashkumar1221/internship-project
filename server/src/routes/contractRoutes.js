const express = require('express');
const { generateContract, sendForESignature, getContractsByProject } = require('../controllers/contractController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.post('/generate', protect, generateContract);
router.post('/:id/send-esignature', protect, sendForESignature);
router.get('/project/:projectId', protect, getContractsByProject);

module.exports = router;
