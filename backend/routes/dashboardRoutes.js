const express = require('express');
const router = express.Router();

const { verifyToken } = require('../middleware/authMiddleware');
const { authorizeRole } = require('../middleware/roleMiddleware');

const {getGuideDashboard, getMemberDashboard} = require('../controllers/dashboardController');

// Guide Dashboard
router.get(
    '/guide',
    verifyToken,
    authorizeRole('guide'),
    getGuideDashboard
);


router.get(
    '/member',
    verifyToken,
    authorizeRole('member'),
    getMemberDashboard
);


module.exports = router;
