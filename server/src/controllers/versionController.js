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

// @desc Restore Project State from Version Snapshot
// @route POST /api/versions/:id/restore
exports.restoreVersion = async (req, res) => {
  try {
    const version = await Version.findById(req.params.id);
    if (!version) {
      return res.status(404).json({ success: false, message: 'Version snapshot not found' });
    }

    const Track = require('../models/Track');
    // If snapshot contains tracks array, restore track levels and settings
    if (version.snapshotData && Array.isArray(version.snapshotData.tracks)) {
      for (const trackSnapshot of version.snapshotData.tracks) {
        if (trackSnapshot._id) {
          await Track.findByIdAndUpdate(trackSnapshot._id, {
            volume: trackSnapshot.volume,
            pan: trackSnapshot.pan,
            isMuted: trackSnapshot.isMuted,
            isSoloed: trackSnapshot.isSoloed,
            name: trackSnapshot.name
          });
        }
      }
    }

    // Create a new snapshot recording the restore action
    const restoreRecord = await Version.create({
      project: version.project,
      versionNumber: `v${Date.now().toString().slice(-4)}`,
      title: `Restored to ${version.versionNumber} (${version.title})`,
      description: `Project state successfully rolled back to snapshot ${version.versionNumber}`,
      snapshotData: version.snapshotData,
      branchName: version.branchName || 'main',
      createdByUser: req.user.id
    });

    res.status(200).json({
      success: true,
      message: `Project restored to ${version.versionNumber}`,
      data: restoreRecord
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

