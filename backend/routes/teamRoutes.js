const express = require('express');
const router = express.Router();

const { createTeam, getAllTeams, getTeamById, updateTeam, deleteTeam} = require('../controllers/teamController');
const { verifyToken } = require('../middleware/authMiddleware');
const { authorizeRole } = require('../middleware/roleMiddleware');

// Create Team (Guide only)
router.post(
    '/create',
    verifyToken,
    authorizeRole('guide'),
    createTeam
);


// Get all teams (Guide only)
router.get(
    '/',
    verifyToken,
    authorizeRole('guide'),
    getAllTeams
);


 // Get team by ID (Guide only)
router.get(
    '/:id',
    verifyToken,
    authorizeRole('guide'),
    getTeamById
);


 // Update team (Guide only)
router.put(
    '/:id',
    verifyToken,
    authorizeRole('guide'),
    updateTeam
);


 // Delete team (Guide only)
router.delete(
    '/:id',
    verifyToken,
    authorizeRole('guide'),
    deleteTeam
);



module.exports = router;