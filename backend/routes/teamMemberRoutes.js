const express = require('express');
const router = express.Router();

const { addMember, getTeamMembers, removeMember} = require('../controllers/teamMemberController');

const { verifyToken } = require('../middleware/authMiddleware');
const { authorizeRole } = require('../middleware/roleMiddleware');

// Add member to team (Guide only)
router.post(
    '/add',
    verifyToken,
    authorizeRole('guide'),
    addMember
);


 // Get members of a team (Guide only)
router.get(
    '/:id',
    verifyToken,
    authorizeRole('guide'),
    getTeamMembers
);


// Remove member from team
router.delete(
    '/:teamId/:memberId',
    verifyToken,
    authorizeRole('guide'),
    removeMember
);


module.exports = router;
