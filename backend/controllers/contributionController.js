const db = require('../config/db');

// Get contribution report for a team
const getTeamContribution = (req, res) => {
    const teamId = req.params.teamId;

    const sql = `
        SELECT
            u.id AS member_id,
            u.name AS member_name,
            COUNT(t.id) AS total_tasks,
            SUM(CASE WHEN t.status = 'done'
                THEN 1 ELSE 0 END) AS completed_tasks,
            SUM(CASE WHEN t.status = 'todo'
                THEN 1 ELSE 0 END) AS pending_tasks,
            SUM(CASE WHEN t.status = 'in_progress'
                THEN 1 ELSE 0 END) AS in_progress_tasks
        FROM team_members tm
        JOIN users u ON tm.member_id = u.id
        LEFT JOIN tasks t
            ON t.assigned_to = u.id
            AND t.team_id = tm.team_id
        WHERE tm.team_id = ?
        GROUP BY u.id, u.name
    `;

    db.query(sql, [teamId], (err, result) => {
        if (err) {
            return res.status(500).json({
                message: 'Error generating contribution report',
                error: err.message
            });
        }

        res.status(200).json(result);
    });
};

module.exports = {
    getTeamContribution
};
