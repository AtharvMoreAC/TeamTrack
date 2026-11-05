const db = require('../config/db');

// Create Task (Guide only)
const createTask = (req, res) => {

    const {
        title,
        description,
        team_id,
        assigned_to,
        priority,
        due_date
    } = req.body;

    const created_by = req.user.id;

    const sql = `
        INSERT INTO tasks
        (title, description, team_id, assigned_to,
         priority, due_date, created_by)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [
        title,
        description,
        team_id,
        assigned_to,
        priority,
        due_date,
        created_by
    ], (err, result) => {

        if (err) {
            return res.status(500).json({
                message: 'Error creating task',
                error: err.message
            });
        }

        res.status(201).json({
            message: 'Task created successfully!',
            taskId: result.insertId
        });
    });
};


// Get all tasks
const getAllTasks = (req, res) => {

    const userId = req.user.id;
    const userRole = req.user.role;

    let sql;
    let values = [];

    // Guide can see tasks from their own teams only
    if (userRole === 'guide') {

        sql = `
            SELECT tasks.*
            FROM tasks
            JOIN teams ON tasks.team_id = teams.id
            WHERE teams.guide_id = ?
        `;

        values = [userId];

    }

    // Member can see only tasks assigned to them
    else if (userRole === 'member') {

        sql = `
            SELECT *
            FROM tasks
            WHERE assigned_to = ?
        `;

        values = [userId];

    }

    else {
        return res.status(403).json({
            message: 'Access denied'
        });
    }

    db.query(sql, values, (err, result) => {

        if (err) {
            return res.status(500).json({
                message: 'Error fetching tasks',
                error: err.message
            });
        }

        res.status(200).json({
            message: 'Tasks fetched successfully!',
            tasks: result
        });
    });
};


// Get task by ID
const getTaskById = (req, res) => {

    const taskId = req.params.id;
    const userId = req.user.id;
    const userRole = req.user.role;

    let sql = 'SELECT * FROM tasks WHERE id = ?';
    let values = [taskId];

    // Member can access only their assigned task
    if (userRole === 'member') {
        sql += ' AND assigned_to = ?';
        values.push(userId);
    }

    // Guide can access tasks from their own teams
    else if (userRole === 'guide') {
        sql = `
            SELECT tasks.*
            FROM tasks
            JOIN teams ON tasks.team_id = teams.id
            WHERE tasks.id = ? AND teams.guide_id = ?
        `;
        values = [taskId, userId];
    }

    db.query(sql, values, (err, result) => {

        if (err) {
            return res.status(500).json({
                message: 'Error fetching task',
                error: err.message
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                message: 'Task not found'
            });
        }

        res.status(200).json({
            message: 'Task fetched successfully!',
            task: result[0]
        });
    });
};


// Update task (Guide only)
const updateTask = (req, res) => {

    const taskId = req.params.id;
    const guideId = req.user.id;

    const {
        title,
        description,
        assigned_to,
        priority,
        due_date
    } = req.body;

    const sql = `
        UPDATE tasks
        JOIN teams ON tasks.team_id = teams.id
        SET tasks.title = ?,
            tasks.description = ?,
            tasks.assigned_to = ?,
            tasks.priority = ?,
            tasks.due_date = ?
        WHERE tasks.id = ?
        AND teams.guide_id = ?
    `;

    db.query(sql, [
        title,
        description,
        assigned_to,
        priority,
        due_date,
        taskId,
        guideId
    ], (err, result) => {

        if (err) {
            return res.status(500).json({
                message: 'Error updating task',
                error: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Task not found'
            });
        }

        res.status(200).json({
            message: 'Task updated successfully!'
        });
    });
};


// Delete task (Guide only)
const deleteTask = (req, res) => {

    const taskId = req.params.id;
    const guideId = req.user.id;

    const sql = `
        DELETE tasks
        FROM tasks
        JOIN teams ON tasks.team_id = teams.id
        WHERE tasks.id = ?
        AND teams.guide_id = ?
    `;

    db.query(sql, [taskId, guideId], (err, result) => {

        if (err) {
            return res.status(500).json({
                message: 'Error deleting task',
                error: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Task not found'
            });
        }

        res.status(200).json({
            message: 'Task deleted successfully!'
        });
    });
};


// Update task status
const updateTaskStatus = (req, res) => {

    const taskId = req.params.id;
    const { status } = req.body;

    const userId = req.user.id;
    const userRole = req.user.role;

    const validStatuses = ['todo', 'in_progress', 'done'];

    if (!validStatuses.includes(status)) {
        return res.status(400).json({
            message: 'Invalid status. Use todo, in_progress, or done.'
        });
    }

    let sql = `
        UPDATE tasks
        SET status = ?,
            completed_at = CASE
                WHEN ? = 'done' THEN CURRENT_TIMESTAMP
                ELSE NULL
            END
        WHERE id = ?
    `;

    let values = [status, status, taskId];

    // Member can update only their assigned tasks
    if (userRole === 'member') {
        sql += ' AND assigned_to = ?';
        values.push(userId);
    }

    db.query(sql, values, (err, result) => {

        if (err) {
            return res.status(500).json({
                message: 'Error updating task status',
                error: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Task not found or you are not assigned to it'
            });
        }

        res.status(200).json({
            message: 'Task status updated successfully!'
        });
    });
};


module.exports = {
    createTask,
    getAllTasks,
    getTaskById,
    updateTask,
    deleteTask,
    updateTaskStatus
};
