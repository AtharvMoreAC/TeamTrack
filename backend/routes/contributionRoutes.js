const express = require('express');
const router = express.Router();

const { verifyToken } = require('../middleware/authMiddleware');
const { authorizeRole } = require('../middleware/roleMiddleware');

const {
    getTeamContribution
} = require('../controllers/contributionController');

// Get contribution report of a team
router.get(
    '/:teamId',
    verifyToken,
    authorizeRole('guide'),
    getTeamContribution
);

module.exports = router;
