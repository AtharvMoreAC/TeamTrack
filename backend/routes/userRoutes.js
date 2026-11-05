const express = require('express');
const router = express.Router();

const db = require('../config/db');
const { verifyToken } = require('../middleware/authMiddleware');
const { authorizeRole } = require('../middleware/roleMiddleware');

// Get all registered users (Guide only)
router.get(
    '/',
    verifyToken,
    authorizeRole('guide'),
    (req, res) => {
        const sql = `
            SELECT id, name, email, role
            FROM users
            WHERE role = 'member'
        `;

        db.query(sql, (err, result) => {
            if (err) {
                return res.status(500).json({
                    message: 'Error fetching users',
                    error: err.message
                });
            }

            res.status(200).json({
                users: result
            });
        });
    }
);

module.exports = router;
