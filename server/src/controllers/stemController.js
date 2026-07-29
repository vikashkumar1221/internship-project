const Stem = require('../models/Stem');
const Track = require('../models/Track');
const { uploadFileToS3 } = require('../services/s3Service');
const { extractWaveformPeaks } = require('../services/ffmpegService');
const { separateStemsWithDemucs } = require('../services/demucsAiService');

// @desc Upload Audio Stem to Track
// @route POST /api/stems/upload
exports.uploadStem = async (req, res) => {
  try {
    const { trackId, projectId, name, stemCategory } = req.body;
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Audio file is required' });
    }

    const filePath = req.file.path;
    const fileMime = req.file.mimetype;

    // Upload to S3 Bucket
    const s3Key = `stems/${Date.now()}-${req.file.originalname}`;
    const fileUrl = await uploadFileToS3(filePath, s3Key, fileMime);

    // Extract Waveform Peak Array & Audio Duration
    const { duration, peaks } = await extractWaveformPeaks(filePath);

    const stem = await Stem.create({
      track: trackId,
      project: projectId,
      uploadedBy: req.user.id,
      name: name || req.file.originalname,
      fileUrl,
      s3Key,
      fileType: req.file.originalname.split('.').pop().toLowerCase(),
      duration,
      peaks,
      stemCategory: stemCategory || 'Custom'
    });

    res.status(201).json({ success: true, data: stem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Trigger AI Stem Isolation with Demucs
// @route POST /api/stems/ai-isolate
exports.isolateStemsAI = async (req, res) => {
  try {
    const { stemId } = req.body;
    const stem = await Stem.findById(stemId);
    const audioPath = stem ? stem.fileUrl : 'mock_audio.mp3';

    const isolatedStems = await separateStemsWithDemucs(audioPath);

    res.status(200).json({
      success: true,
      message: 'Demucs AI stem separation complete',
      data: isolatedStems
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get Stems for Track
// @route GET /api/stems/track/:trackId
exports.getStemsByTrack = async (req, res) => {
  try {
    const stems = await Stem.find({ track: req.params.trackId });
    res.status(200).json({ success: true, data: stems });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
