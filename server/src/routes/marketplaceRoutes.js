const express = require('express');
const { getMarketplaceItems, createMarketplaceItem, purchaseLicense } = require('../controllers/marketplaceController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.get('/', getMarketplaceItems);
router.post('/', protect, createMarketplaceItem);
router.post('/purchase', protect, purchaseLicense);

module.exports = router;
