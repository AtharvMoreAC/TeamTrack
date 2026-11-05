const db = require('../config/db');

// Guide Dashboard
const getGuideDashboard = (req, res) => {
    const guideId = req.user.id;

    const sql = `
        SELECT
            COUNT(DISTINCT teams.id) AS total_teams,
            COUNT(tasks.id) AS total_tasks,
            SUM(CASE WHEN tasks.status = 'done'
                THEN 1 ELSE 0 END) AS completed_tasks,
            SUM(CASE WHEN tasks.status = 'todo'
                THEN 1 ELSE 0 END) AS pending_tasks,
            SUM(CASE WHEN tasks.status = 'in_progress'
                THEN 1 ELSE 0 END) AS in_progress_tasks,
            SUM(CASE
                WHEN tasks.due_date < CURDATE()
                AND tasks.status != 'done'
                THEN 1 ELSE 0
            END) AS overdue_tasks
        FROM teams
        LEFT JOIN tasks ON teams.id = tasks.team_id
        WHERE teams.guide_id = ?
    `;

    db.query(sql, [guideId], (err, result) => {
        if (err) {
            return res.status(500).json({
                message: 'Error fetching guide dashboard',
                error: err.message
            });
        }

        res.status(200).json(result[0]);
    });
};


 // Member Dashboard
const getMemberDashboard = (req, res) => {
    const memberId = req.user.id;

    const sql = `
        SELECT
            COUNT(*) AS total_tasks,
            SUM(CASE WHEN status = 'done'
                THEN 1 ELSE 0 END) AS completed_tasks,
            SUM(CASE WHEN status = 'todo'
                THEN 1 ELSE 0 END) AS pending_tasks,
            SUM(CASE WHEN status = 'in_progress'
                THEN 1 ELSE 0 END) AS in_progress_tasks,
            SUM(CASE
                WHEN due_date < CURDATE()
                AND status != 'done'
                THEN 1 ELSE 0
            END) AS overdue_tasks
        FROM tasks
        WHERE assigned_to = ?
    `;

    db.query(sql, [memberId], (err, result) => {
        if (err) {
            return res.status(500).json({
                message: 'Error fetching member dashboard',
                error: err.message
            });
        }

        res.status(200).json(result[0]);
    });
};


module.exports = {
    getGuideDashboard,
    getMemberDashboard
};
