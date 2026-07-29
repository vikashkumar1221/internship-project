const MarketplaceItem = require('../models/MarketplaceItem');
const Order = require('../models/Order');

// @desc Get All Beats / Stems on Marketplace
// @route GET /api/marketplace
exports.getMarketplaceItems = async (req, res) => {
  try {
    const { genre, search } = req.query;
    let query = {};
    if (genre && genre !== 'All') {
      query.genre = genre;
    }
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const items = await MarketplaceItem.find(query).populate('seller', 'name avatar').sort('-createdAt');
    res.status(200).json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Upload Beat / Stem Pack for Sale
// @route POST /api/marketplace
exports.createMarketplaceItem = async (req, res) => {
  try {
    const item = await MarketplaceItem.create({
      ...req.body,
      seller: req.user.id
    });
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Purchase Beat License
// @route POST /api/marketplace/purchase
exports.purchaseLicense = async (req, res) => {
  try {
    const { itemId, licenseType } = req.body;
    const item = await MarketplaceItem.findById(itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    let price = item.leasePrice;
    if (licenseType === 'Premium') price = item.premiumPrice;
    if (licenseType === 'Exclusive') price = item.exclusivePrice;

    const order = await Order.create({
      buyer: req.user.id,
      item: item._id,
      licenseType,
      amount: price,
      stripePaymentIntentId: `pi_mock_${Date.now()}`,
      status: 'Completed',
      downloadUrl: item.stemsZipUrl || item.previewAudioUrl
    });

    item.salesCount += 1;
    await item.save();

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
