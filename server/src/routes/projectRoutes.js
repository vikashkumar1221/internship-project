const express = require('express');
const {
  getProjects,
  createProject,
  getProjectById,
  updateProject,
  inviteCollaborator
} = require('../controllers/projectController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.route('/').get(protect, getProjects).post(protect, createProject);
router.route('/:id').get(protect, getProjectById).put(protect, updateProject);
router.route('/:id/collaborators').post(protect, inviteCollaborator);

module.exports = router;
