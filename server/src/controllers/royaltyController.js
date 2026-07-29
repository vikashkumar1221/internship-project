const RoyaltySplit = require('../models/RoyaltySplit');

// @desc Save / Update Project Royalty Splits
// @route POST /api/royalty
exports.saveRoyaltySplit = async (req, res) => {
  try {
    const { projectId, contributors } = req.body;

    // Validate percentage sum equals 100%
    const total = contributors.reduce((acc, c) => acc + (parseFloat(c.percentage) || 0), 0);
    if (Math.round(total) !== 100) {
      return res.status(400).json({ success: false, message: `Total split percentage must equal 100%. Current sum: ${total}%` });
    }

    let split = await RoyaltySplit.findOne({ project: projectId });
    if (split) {
      split.contributors = contributors;
      split.totalPercentage = total;
      await split.save();
    } else {
      split = await RoyaltySplit.create({
        project: projectId,
        contributors,
        totalPercentage: total
      });
    }

    res.status(200).json({ success: true, data: split });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get Royalty Splits for Project
// @route GET /api/royalty/project/:projectId
exports.getRoyaltySplit = async (req, res) => {
  try {
    const split = await RoyaltySplit.findOne({ project: req.params.projectId }).populate('contributors.user', 'name email avatar');
    res.status(200).json({ success: true, data: split });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
