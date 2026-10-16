const express = require('express');
const {
  getProjects,
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
  addTrack,
  updateTrack,
  deleteTrack,
  inviteCollaborator
} = require('../controllers/projectController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.route('/')
  .get(protect, getProjects)
  .post(protect, createProject);

router.route('/:id')
  .get(protect, getProjectById)
  .put(protect, updateProject)
  .delete(protect, deleteProject);

router.route('/:id/tracks')
  .post(protect, addTrack);

router.route('/:id/tracks/:trackId')
  .put(protect, updateTrack)
  .delete(protect, deleteTrack);

router.route('/:id/collaborators')
  .post(protect, inviteCollaborator);

module.exports = router;
