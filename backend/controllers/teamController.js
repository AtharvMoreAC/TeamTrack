const db = require("../config/db");

// ================= CREATE TEAM =================
const createTeam = (req, res) => {
    const { team_name, project_title, deadline } = req.body;
    const guide_id = req.user.id;

    if (!team_name || !project_title) {
        return res.status(400).json({
            message: "Team name and project title are required"
        });
    }

    const sql = `
        INSERT INTO teams (team_name, project_title, guide_id, deadline)
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [team_name, project_title, guide_id, deadline || null],
        (err, result) => {
            if (err) {
                return res.status(500).json({
                    message: "Error creating team",
                    error: err.message
                });
            }

            res.status(201).json({
                message: "Team created successfully!",
                teamId: result.insertId
            });
        }
    );
};

// ================= GET ALL TEAMS =================
const getAllTeams = (req, res) => {
    const guide_id = req.user.id;

    const sql = "SELECT * FROM teams WHERE guide_id = ?";

    db.query(sql, [guide_id], (err, result) => {
        if (err) {
            return res.status(500).json({
                message: "Error fetching teams",
                error: err.message
            });
        }

        res.status(200).json({
            message: "Teams fetched successfully!",
            teams: result
        });
    });
};

// ================= GET TEAM BY ID =================
const getTeamById = (req, res) => {
    const teamId = req.params.id;
    const guide_id = req.user.id;

    const sql = `
        SELECT * FROM teams
        WHERE id = ? AND guide_id = ?
    `;

    db.query(sql, [teamId, guide_id], (err, result) => {
        if (err) {
            return res.status(500).json({
                message: "Error fetching team",
                error: err.message
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                message: "Team not found"
            });
        }

        res.status(200).json({
            message: "Team fetched successfully!",
            team: result[0]
        });
    });
};

// ================= UPDATE TEAM =================
const updateTeam = (req, res) => {
    const teamId = req.params.id;
    const guide_id = req.user.id;

    const { team_name, project_title, deadline } = req.body;

    const sql = `
        UPDATE teams
        SET team_name = ?, project_title = ?, deadline = ?
        WHERE id = ? AND guide_id = ?
    `;

    db.query(
        sql,
        [team_name, project_title, deadline || null, teamId, guide_id],
        (err, result) => {
            if (err) {
                return res.status(500).json({
                    message: "Error updating team",
                    error: err.message
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Team not found or unauthorized"
                });
            }

            res.status(200).json({
                message: "Team updated successfully!"
            });
        }
    );
};

// ================= DELETE TEAM =================
const deleteTeam = (req, res) => {
    const teamId = req.params.id;
    const guide_id = req.user.id;

    const sql = `
        DELETE FROM teams
        WHERE id = ? AND guide_id = ?
    `;

    db.query(sql, [teamId, guide_id], (err, result) => {
        if (err) {
            return res.status(500).json({
                message: "Error deleting team",
                error: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Team not found or unauthorized"
            });
        }

        res.status(200).json({
            message: "Team deleted successfully!"
        });
    });
};

module.exports = {
    createTeam,
    getAllTeams,
    getTeamById,
    updateTeam,
    deleteTeam
};
