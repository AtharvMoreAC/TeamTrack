import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function MemberDashboard() {
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:5000/api/dashboard/member",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setDashboard(response.data);
            } catch (error) {
                console.error("Dashboard Error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, [token]);

    if (loading) {
        return <h2 className="dashboard-loading">Loading Dashboard...</h2>;
    }

    if (!dashboard) {
        return (
            <div className="dashboard-container">
                <h2>Unable to load dashboard</h2>
                <p>Please log in again and try.</p>
            </div>
        );
    }

    // Read values returned by the backend
    const totalTasks = Number(dashboard.total_tasks) || 0;
    const completedTasks = Number(dashboard.completed_tasks) || 0;
    const pendingTasks = Number(dashboard.pending_tasks) || 0;
    const inProgressTasks = Number(dashboard.in_progress_tasks) || 0;
    const overdueTasks = Number(dashboard.overdue_tasks) || 0;

    // Calculate task completion percentage
    const progress =
        totalTasks > 0
            ? Math.round((completedTasks / totalTasks) * 100)
            : 0;

    return (
        <div className="dashboard-container">

            <h1>Member Dashboard</h1>

            <p className="dashboard-subtitle">
                Welcome! Track your tasks and project progress here.
            </p>

            {/* Task Summary Cards */}
            <div className="dashboard-stats">

                <div className="stat-card">
                    <h3>Total Tasks</h3>
                    <p>{totalTasks}</p>
                </div>

                <div className="stat-card completed-card">
                    <h3>Completed</h3>
                    <p>{completedTasks}</p>
                </div>

                <div className="stat-card pending-card">
                    <h3>Pending</h3>
                    <p>{pendingTasks}</p>
                </div>

                <div className="stat-card progress-card">
                    <h3>In Progress</h3>
                    <p>{inProgressTasks}</p>
                </div>

            </div>

            {/* Task Progress */}
            <div className="member-progress">

                <div className="progress-info">
                    <strong>My Task Progress</strong>
                    <span>{progress}% Completed</span>
                </div>

                <div className="progress-bar">
                    <div
                        className="progress-fill"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>

                <p>
                    {completedTasks} out of {totalTasks} tasks completed
                </p>

            </div>

            {/* Overdue Tasks */}
            {overdueTasks > 0 && (
                <div className="member-overdue">
                    ⚠️ You have {overdueTasks} overdue task(s).
                    Please check your tasks.
                </div>
            )}

            {/* Quick Actions */}
            <div className="dashboard-actions">

                <Link
                    to="/member-tasks"
                    className="dashboard-action-btn"
                >
                    View My Tasks
                </Link>

                <Link
                    to="/member-phases"
                    className="dashboard-action-btn secondary"
                >
                    View Project Phases
                </Link>

            </div>

        </div>
    );
}

export default MemberDashboard;
