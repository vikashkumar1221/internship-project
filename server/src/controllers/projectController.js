const Project = require('../models/Project');
const Track = require('../models/Track');
const Collaborator = require('../models/Collaborator');
const User = require('../models/User');
const mongoose = require('mongoose');

// @desc Get All Projects for Current User
// @route GET /api/projects
exports.getProjects = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({
        success: true,
        data: {
          recent: [
            {
              _id: 'proj_demo_123',
              title: 'Midnight Synthwave Anthem',
              genre: 'Synthwave',
              tempo: 124,
              keySignature: 'F Minor',
              timeSignature: '4/4',
              description: '80s retro synthwave project featuring Jupiter analog chords and lead vocals.',
              coverImage: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600',
              owner: { name: 'Alex Rivera', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300' },
              tags: ['80s', 'Retrowave', 'Vocals', 'Analog Synth']
            },
            {
              _id: 'proj_demo_456',
              title: 'Cyberpunk Neon Underground',
              genre: 'Cyberpunk',
              tempo: 130,
              keySignature: 'A Minor',
              timeSignature: '4/4',
              description: 'Heavy industrial beat collaboration with distorted sub bass line.',
              coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600',
              owner: { name: 'Sarah Chen', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300' },
              tags: ['Cyberpunk', 'Bass', 'Industrial']
            }
          ],
          shared: []
        }
      });
    }
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

    if (mongoose.connection.readyState !== 1) {
      const mockProject = {
        _id: `proj_${Date.now()}`,
        title: title || 'New Demo Project',
        description: description || 'Collaborative DAW project',
        genre: genre || 'Electronic',
        tempo: tempo || 120,
        keySignature: keySignature || 'C Major',
        timeSignature: timeSignature || '4/4',
        tags: tags || ['Beat', 'Demo'],
        coverImage: coverImage || 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600',
        owner: req.user.id
      };
      return res.status(201).json({ success: true, data: mockProject });
    }

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
    if (mongoose.connection.readyState !== 1) {
      const mockProject = {
        _id: req.params.id,
        title: 'Midnight Synthwave Anthem',
        description: '80s inspired retro synthwave collaboration project with lush vocal hooks.',
        genre: 'Synthwave',
        tempo: 124,
        keySignature: 'F Minor',
        timeSignature: '4/4',
        tags: ['80s', 'Retrowave', 'Vocals', 'Analog Synth'],
        owner: { name: 'Alex Rivera', email: 'alex@studio.com', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300' }
      };
      const mockTracks = [
        { _id: 'track_1', project: req.params.id, name: 'Vocals Lead (Sarah)', color: '#ec4899', volume: 0, pan: 0, order: 0, stems: [] },
        { _id: 'track_2', project: req.params.id, name: 'Analog Jupiter Synth', color: '#6366f1', volume: -2, pan: -0.2, order: 1, stems: [] },
        { _id: 'track_3', project: req.params.id, name: 'Sub Bass 808', color: '#10b981', volume: -1, pan: 0, order: 2, stems: [] },
        { _id: 'track_4', project: req.params.id, name: 'Drum Machine Loop', color: '#f59e0b', volume: 0, pan: 0, order: 3, stems: [] }
      ];
      return res.status(200).json({
        success: true,
        data: {
          project: mockProject,
          tracks: mockTracks,
          collaborators: [
            { _id: 'collab_1', user: { name: 'Alex Rivera', email: 'alex@studio.com', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300' }, role: 'Owner' }
          ]
        }
      });
    }

const Stem = require('../models/Stem');

    const project = await Project.findById(req.params.id).populate('owner', 'name avatar email');
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const rawTracks = await Track.find({ project: req.params.id }).sort('order').lean();
    const stems = await Stem.find({ project: req.params.id }).lean();
    const tracks = rawTracks.map((t) => ({
      ...t,
      stems: stems.filter((s) => s.track && s.track.toString() === t._id.toString())
    }));
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
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({ success: true, data: { _id: req.params.id, ...req.body } });
    }
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Delete Project
// @route DELETE /api/projects/:id
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Verify ownership or admin
    if (project.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only project owner can delete project' });
    }

    await Track.deleteMany({ project: req.params.id });
    await Stem.deleteMany({ project: req.params.id });
    await Collaborator.deleteMany({ project: req.params.id });
    await project.deleteOne();

    res.status(200).json({ success: true, message: 'Project successfully deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Add Track to Project
// @route POST /api/projects/:id/tracks
exports.addTrack = async (req, res) => {
  try {
    const { name, color, volume, pan } = req.body;
    const count = await Track.countDocuments({ project: req.params.id });

    const track = await Track.create({
      project: req.params.id,
      name: name || `Audio Track ${count + 1}`,
      color: color || '#2c2420',
      volume: volume !== undefined ? volume : 0,
      pan: pan !== undefined ? pan : 0,
      order: count
    });

    res.status(201).json({ success: true, data: { ...track.toObject(), stems: [] } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Update Track Settings (Volume, Pan, Mute, Solo, Name)
// @route PUT /api/projects/:id/tracks/:trackId
exports.updateTrack = async (req, res) => {
  try {
    const track = await Track.findOneAndUpdate(
      { _id: req.params.trackId, project: req.params.id },
      req.body,
      { new: true }
    );
    if (!track) {
      return res.status(404).json({ success: false, message: 'Track not found' });
    }
    res.status(200).json({ success: true, data: track });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Delete Track from Project
// @route DELETE /api/projects/:id/tracks/:trackId
exports.deleteTrack = async (req, res) => {
  try {
    await Stem.deleteMany({ track: req.params.trackId });
    await Track.findByIdAndDelete(req.params.trackId);
    res.status(200).json({ success: true, message: 'Track deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Invite Collaborator to Project
// @route POST /api/projects/:id/collaborators
exports.inviteCollaborator = async (req, res) => {
  try {
    const { email, role } = req.body;

    if (mongoose.connection.readyState !== 1) {
      return res.status(201).json({
        success: true,
        data: {
          _id: `collab_${Date.now()}`,
          project: req.params.id,
          user: { name: email.split('@')[0], email, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300' },
          role: role || 'Editor'
        }
      });
    }

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
      role: role || 'Producer',
      invitedBy: req.user.id
    });

    const populatedCollab = await Collaborator.findById(collab._id).populate('user', 'name avatar email');

    res.status(201).json({ success: true, data: populatedCollab });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
