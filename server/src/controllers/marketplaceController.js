const MarketplaceItem = require('../models/MarketplaceItem');
const Order = require('../models/Order');
const mongoose = require('mongoose');

// @desc Get All Beats / Stems on Marketplace
// @route GET /api/marketplace
exports.getMarketplaceItems = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({
        success: true,
        data: [
          {
            _id: 'beat_1',
            title: 'Midnight Synthwave Beat',
            genre: 'Synthwave',
            bpm: 124,
            key: 'F Minor',
            leasePrice: 29,
            premiumPrice: 79,
            exclusivePrice: 299,
            coverImage: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600',
            seller: { name: 'Alex Rivera', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300' }
          },
          {
            _id: 'beat_2',
            title: 'Cyber Dark Traps',
            genre: 'Trap',
            bpm: 140,
            key: 'C Minor',
            leasePrice: 35,
            premiumPrice: 89,
            exclusivePrice: 349,
            coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600',
            seller: { name: 'Sarah Chen', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300' }
          }
        ]
      });
    }
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
