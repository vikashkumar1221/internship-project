const Version = require('../models/Version');

// @desc Save DAW State Version Snapshot (Git-style)
// @route POST /api/versions
exports.saveVersion = async (req, res) => {
  try {
    const { projectId, versionNumber, title, description, snapshotData, branchName } = req.body;

    const version = await Version.create({
      project: projectId,
      versionNumber: versionNumber || `v${Date.now().toString().slice(-4)}`,
      title,
      description,
      snapshotData,
      branchName: branchName || 'main',
      createdByUser: req.user.id
    });

    res.status(201).json({ success: true, data: version });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get Project Version Snapshots
// @route GET /api/versions/project/:projectId
exports.getVersionsByProject = async (req, res) => {
  try {
    const versions = await Version.find({ project: req.params.projectId })
      .populate('createdByUser', 'name avatar')
      .sort('-createdAt');
    res.status(200).json({ success: true, data: versions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
