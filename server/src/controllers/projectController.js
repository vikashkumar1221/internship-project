const Project = require('../models/Project');
const Track = require('../models/Track');
const Collaborator = require('../models/Collaborator');
const User = require('../models/User');

// @desc Get All Projects for Current User
// @route GET /api/projects
exports.getProjects = async (req, res) => {
  try {
    const ownedProjects = await Project.find({ owner: req.user.id }).populate('owner', 'name avatar');
    const collaborations = await Collaborator.find({ user: req.user.id }).populate({
      path: 'project',
      populate: { path: 'owner', select: 'name avatar' }
    });

    const sharedProjects = collaborations.map((c) => c.project).filter(Boolean);

    res.status(200).json({
      success: true,
      data: {
        recent: ownedProjects,
        shared: sharedProjects
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Create New Project
// @route POST /api/projects
exports.createProject = async (req, res) => {
  try {
    const { title, description, genre, tempo, keySignature, timeSignature, tags, coverImage } = req.body;

    const project = await Project.create({
      title,
      description,
      genre: genre || 'Electronic',
      tempo: tempo || 120,
      keySignature: keySignature || 'C Major',
      timeSignature: timeSignature || '4/4',
      tags: tags || ['Beat', 'Demo'],
      coverImage,
      owner: req.user.id
    });

    // Create default tracks (Vocal, Synth, Bass, Drums)
    const defaultTracks = [
      { project: project._id, name: 'Vocals Lead', color: '#ec4899', order: 0 },
      { project: project._id, name: 'Synth Chords', color: '#6366f1', order: 1 },
      { project: project._id, name: 'Sub Bass', color: '#10b981', order: 2 },
      { project: project._id, name: 'Drum Loop', color: '#f59e0b', order: 3 }
    ];
    await Track.insertMany(defaultTracks);

    // Register owner as collaborator
    await Collaborator.create({
      project: project._id,
      user: req.user.id,
      role: 'Owner'
    });

    res.status(201).json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get Single Project Details with Tracks & Stems
// @route GET /api/projects/:id
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('owner', 'name avatar email');
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const tracks = await Track.find({ project: req.params.id }).sort('order');
    const collaborators = await Collaborator.find({ project: req.params.id }).populate('user', 'name avatar email');

    res.status(200).json({
      success: true,
      data: {
        project,
        tracks,
        collaborators
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Update Project Metadata
// @route PUT /api/projects/:id
exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Invite Collaborator to Project
// @route POST /api/projects/:id/collaborators
exports.inviteCollaborator = async (req, res) => {
  try {
    const { email, role } = req.body;
    const targetUser = await User.findOne({ email });

    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'No registered user found with this email' });
    }

    const existing = await Collaborator.findOne({ project: req.params.id, user: targetUser._id });
    if (existing) {
      return res.status(400).json({ success: false, message: 'User is already a collaborator on this project' });
    }

    const collab = await Collaborator.create({
      project: req.params.id,
      user: targetUser._id,
      role: role || 'Editor',
      invitedBy: req.user.id
    });

    const populatedCollab = await Collaborator.findById(collab._id).populate('user', 'name avatar email');

    res.status(201).json({ success: true, data: populatedCollab });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
