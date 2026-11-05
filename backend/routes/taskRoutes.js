const express = require('express');
const router = express.Router();

const {
    createTask,
    getAllTasks,
    getTaskById,
    updateTask,
    deleteTask,
    updateTaskStatus
} = require('../controllers/taskController');

const { verifyToken } = require('../middleware/authMiddleware');
const { authorizeRole } = require('../middleware/roleMiddleware');

// Create task (Guide only)
router.post(
    '/',
    verifyToken,
    authorizeRole('guide'),
    createTask
);

// Get all tasks
router.get(
    '/',
    verifyToken,
    getAllTasks
);

// Get task by ID
router.get(
    '/:id',
    verifyToken,
    getTaskById
);

// Update task (Guide only)
router.put(
    '/:id',
    verifyToken,
    authorizeRole('guide'),
    updateTask
);

// Delete task (Guide only)
router.delete(
    '/:id',
    verifyToken,
    authorizeRole('guide'),
    deleteTask
);

// Update task status (Guide and Member)
router.patch(
    '/:id/status',
    verifyToken,
    updateTaskStatus
);

module.exports = router;
