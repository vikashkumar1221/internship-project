const express = require('express');
const { getMessages, sendMessage } = require('../controllers/chatController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.get('/project/:projectId', protect, getMessages);
router.post('/', protect, sendMessage);

module.exports = router;
