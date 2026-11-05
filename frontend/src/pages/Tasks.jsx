import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Tasks() {
    const [tasks, setTasks] = useState([]);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    // Fetch Tasks
    const fetchTasks = async () => {
        try {
            setLoading(true);

            const response = await axios.get(
                "http://localhost:5000/api/tasks",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setTasks(response.data.tasks || []);
            setError("");
        } catch (err) {
            setError("Unable to load tasks. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    // Update Task Status
    const handleStatusChange = async (taskId, status) => {
        try {
            await axios.patch(
                `http://localhost:5000/api/tasks/${taskId}/status`,
                { status },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setMessage("Task status updated successfully!");
            setError("");

            fetchTasks();

            setTimeout(() => {
                setMessage("");
            }, 3000);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to update task status."
            );
            setMessage("");
        }
    };

    // Delete Task (Guide Only)
    const handleDelete = async (taskId) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this task?"
        );

        if (!confirmDelete) return;

        try {
            await axios.delete(
                `http://localhost:5000/api/tasks/${taskId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setMessage("Task deleted successfully!");
            setError("");

            fetchTasks();

            setTimeout(() => {
                setMessage("");
            }, 3000);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to delete task."
            );
            setMessage("");
        }
    };

    // Format Due Date
    const formatDate = (date) => {
        if (!date) return "Not set";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            timeZone: "UTC",
        });
    };

    return (
        <div className="tasks-container">

            {/* Page Header */}
            <div className="tasks-header">
                <div>
                    <h1>
                        {role === "member" ? "My Tasks" : "Task Management"}
                    </h1>

                    <p>
                        {role === "member"
                            ? "View and update your assigned tasks."
                            : "Manage and track your project tasks."}
                    </p>
                </div>

                {role === "guide" && (
                    <Link
                        to="/create-task"
                        className="create-task-btn"
                    >
                        + Create Task
                    </Link>
                )}
            </div>

            {/* Success Message */}
            {message && (
                <div className="success-message">
                    ✓ {message}
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="error-message">
                    ⚠ {error}
                </div>
            )}

            {/* Tasks Table */}
            <div className="tasks-table-container">

                {loading ? (
                    <div className="empty-tasks">
                        <h3>Loading tasks...</h3>
                        <p>Please wait while we fetch your tasks.</p>
                    </div>
                ) : tasks.length === 0 ? (
                    <div className="empty-tasks">
                        <h3>No tasks available</h3>
                        <p>
                            {role === "member"
                                ? "You don't have any tasks assigned yet."
                                : "Create a task to get your project started."}
                        </p>
                    </div>
                ) : (

                    <table className="tasks-table">

                        <thead>
                            <tr>
                                <th>Task</th>
                                <th>Description</th>
                                <th>Priority</th>
                                <th>Due Date</th>
                                <th>Status</th>
                                {role === "guide" && <th>Action</th>}
                            </tr>
                        </thead>

                        <tbody>
                            {tasks.map((task) => (
                                <tr key={task.id}>

                                    {/* Task Title */}
                                    <td className="task-title">
                                        {task.title}
                                    </td>

                                    {/* Task Description */}
                                    <td className="task-description">
                                        {task.description || "No description"}
                                    </td>

                                    {/* Priority Badge */}
                                    <td>
                                        <span
                                            className={`priority-badge ${task.priority}`}
                                        >
                                            {task.priority?.toUpperCase()}
                                        </span>
                                    </td>

                                    {/* Due Date */}
                                    <td>
                                        {formatDate(task.due_date)}
                                    </td>

                                    {/* Task Status */}
                                    <td>
                                        <select
                                            className={`status-select ${task.status}`}
                                            value={task.status}
                                            onChange={(e) =>
                                                handleStatusChange(
                                                    task.id,
                                                    e.target.value
                                                )
                                            }
                                        >
                                            <option value="todo">
                                                To Do
                                            </option>

                                            <option value="in_progress">
                                                In Progress
                                            </option>

                                            <option value="done">
                                                Done
                                            </option>
                                        </select>
                                    </td>

                                    {/* Guide Action */}
                                    {role === "guide" && (
                                        <td>
                                            <button
                                                className="task-delete-btn"
                                                onClick={() =>
                                                    handleDelete(task.id)
                                                }
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    )}

                                </tr>
                            ))}
                        </tbody>

                    </table>
                )}

            </div>

        </div>
    );
}

export default Tasks;
