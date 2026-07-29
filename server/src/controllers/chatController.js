const Message = require('../models/Message');

// @desc Get Messages for Project Chat & Audio Timeline Comments
// @route GET /api/chat/project/:projectId
exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ project: req.params.projectId })
      .populate('sender', 'name avatar')
      .populate('parentMessage')
      .sort('createdAt');
    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Post New Message / Audio Timeline Comment
// @route POST /api/chat
exports.sendMessage = async (req, res) => {
  try {
    const { projectId, content, audioTimestamp, parentMessage, attachments } = req.body;

    const message = await Message.create({
      project: projectId,
      sender: req.user.id,
      content,
      audioTimestamp: audioTimestamp || null,
      parentMessage: parentMessage || null,
      attachments: attachments || []
    });

    const populatedMsg = await Message.findById(message._id).populate('sender', 'name avatar');
    res.status(201).json({ success: true, data: populatedMsg });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
