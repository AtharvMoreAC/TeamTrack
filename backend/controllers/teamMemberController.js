const db = require('../config/db');

// Add member to team
const addMember = (req, res) => {
    const { team_id, member_id } = req.body;

    console.log("Add Member Request:", req.body);

    if (!team_id || !member_id) {
        return res.status(400).json({
            message: "Team ID and Member ID are required",
            received: req.body
        });
    }

    const sql = `
        INSERT INTO team_members (team_id, member_id)
        VALUES (?, ?)
    `;

    db.query(sql, [team_id, member_id], (err, result) => {
        if (err) {
            console.log("Add Member Database Error:", err);

            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({
                    message: 'Member is already added to this team'
                });
            }

            return res.status(500).json({
                message: 'Error adding member',
                error: err.message,
                code: err.code
            });
        }

        console.log("Member Added Successfully:", result);

        res.status(201).json({
            message: 'Member added to team successfully!',
            id: result.insertId
        });
    });
};



 // Get all members of a team
const getTeamMembers = (req, res) => {

    const teamId = req.params.id;

    const sql = `
        SELECT users.id, users.name, users.email, users.role
        FROM team_members
        JOIN users ON team_members.member_id = users.id
        WHERE team_members.team_id = ?
    `;

    db.query(sql, [teamId], (err, result) => {

        if (err) {
            return res.status(500).json({
                message: 'Error fetching team members',
                error: err.message
            });
        }

        res.status(200).json({
            message: 'Team members fetched successfully!',
            members: result
        });
    });
};


// Remove member from team
const removeMember = (req, res) => {
    const teamId = req.params.teamId;
    const memberId = req.params.memberId;

    const sql = `
        DELETE FROM team_members
        WHERE team_id = ? AND member_id = ?
    `;

    db.query(sql, [teamId, memberId], (err, result) => {
        if (err) {
            return res.status(500).json({
                message: 'Error removing member',
                error: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Member not found in this team'
            });
        }

        res.status(200).json({
            message: 'Member removed from team successfully!'
        });
    });
};

module.exports = {
    addMember,
    getTeamMembers,
    removeMember
};