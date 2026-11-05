import { useState, useEffect } from "react";
import axios from "axios";

function GuideDashboard() {
    const [dashboard, setDashboard] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await axios.get(
                    "http://localhost:5000/api/dashboard/guide",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setDashboard({
                    total_teams: Number(response.data.total_teams) || 0,
                    total_tasks: Number(response.data.total_tasks) || 0,
                    completed_tasks: Number(response.data.completed_tasks) || 0,
                    pending_tasks: Number(response.data.pending_tasks) || 0,
                    in_progress_tasks: Number(response.data.in_progress_tasks) || 0,
                    overdue_tasks: Number(response.data.overdue_tasks) || 0,
                });

            } catch (err) {
                setError("Failed to load guide dashboard.");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    if (loading) {
        return (
            <div className="dashboard-loading">
                <h2>Loading Dashboard...</h2>
            </div>
        );
    }

    if (error || !dashboard) {
        return (
            <div className="dashboard-container">
                <h2>{error || "Unable to load dashboard."}</h2>
                <p>Please log in again and try.</p>
            </div>
        );
    }

    // Calculate task completion percentage
    const progress =
        dashboard.total_tasks > 0
            ? Math.round(
                (dashboard.completed_tasks / dashboard.total_tasks) * 100
            )
            : 0;

    return (
        <div className="dashboard-container">

            {/* Dashboard Heading */}
            <div className="guide-dashboard-header">
                <h1>Guide Dashboard</h1>
                <p>Monitor your teams, tasks, and project progress.</p>
            </div>

            {/* Dashboard Statistics */}
            <div className="dashboard-cards">

                <div className="dashboard-card teams-card">
                    <h3>Total Teams</h3>
                    <p>{dashboard.total_teams}</p>
                </div>

                <div className="dashboard-card tasks-card">
                    <h3>Total Tasks</h3>
                    <p>{dashboard.total_tasks}</p>
                </div>

                <div className="dashboard-card completed-card">
                    <h3>Completed</h3>
                    <p>{dashboard.completed_tasks}</p>
                </div>

                <div className="dashboard-card pending-card">
                    <h3>Pending</h3>
                    <p>{dashboard.pending_tasks}</p>
                </div>

                <div className="dashboard-card progress-card">
                    <h3>In Progress</h3>
                    <p>{dashboard.in_progress_tasks}</p>
                </div>

                <div className="dashboard-card overdue-card">
                    <h3>Overdue</h3>
                    <p>{dashboard.overdue_tasks}</p>
                </div>

            </div>

            {/* Overall Task Progress */}
            <div className="guide-progress-section">

                <div className="guide-progress-info">
                    <strong>Overall Task Completion</strong>
                    <span>{progress}% Completed</span>
                </div>

                <div className="guide-progress-bar">
                    <div
                        className="guide-progress-fill"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>

                <p>
                    {dashboard.completed_tasks} out of{" "}
                    {dashboard.total_tasks} tasks completed
                </p>

            </div>

            {/* Overdue Warning */}
            {dashboard.overdue_tasks > 0 && (
                <div className="guide-overdue-warning">
                    ⚠️ Attention! You have {dashboard.overdue_tasks} overdue
                    task(s) that need to be completed.
                </div>
            )}

        </div>
    );
}

export default GuideDashboard;
