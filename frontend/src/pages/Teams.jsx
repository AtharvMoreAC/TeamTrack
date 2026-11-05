import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

function Teams() {
    const navigate = useNavigate();

    const [teams, setTeams] = useState([]);
    const [formData, setFormData] = useState({
        team_name: "",
        project_title: "",
        deadline: ""
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const token = localStorage.getItem("token");

    // Fetch all teams belonging to the logged-in Guide
    const fetchTeams = async () => {
        try {
            const response = await axios.get(
                "http://localhost:5000/api/teams",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setTeams(response.data.teams || []);
        } catch (err) {
            setError("Failed to fetch teams");
            console.error(err);
        }
    };

    useEffect(() => {
        fetchTeams();
    }, []);

    // Handle input changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Create a new team
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        try {
            await axios.post(
                "http://localhost:5000/api/teams/create",
                {
                    team_name: formData.team_name,
                    project_title: formData.project_title,
                    deadline: formData.deadline || null
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setMessage("Team created successfully!");

            setFormData({
                team_name: "",
                project_title: "",
                deadline: ""
            });

            fetchTeams();
        } catch (err) {
            console.error("Create team error:", err.response?.data || err);
            setError(
                err.response?.data?.message || "Failed to create team"
            );
        }
    };

    return (
        <div className="teams-container">
            <h1>Team Management</h1>

            {/* Create Team Form */}
            <div className="team-form-container">
                <h2>Create New Team</h2>

                {message && (
                    <p className="success-message">{message}</p>
                )}

                {error && (
                    <p className="error-message">{error}</p>
                )}

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="team_name"
                        placeholder="Team Name"
                        value={formData.team_name}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="text"
                        name="project_title"
                        placeholder="Project Title"
                        value={formData.project_title}
                        onChange={handleChange}
                        required
                    />

                    <label>Project Deadline</label>

                    <input
                        type="date"
                        name="deadline"
                        value={formData.deadline}
                        onChange={handleChange}
                    />

                    <button type="submit">Create Team</button>
                </form>
            </div>

            {/* Teams List */}
            <div className="teams-list-container">
                <h2>My Teams</h2>

                {teams.length === 0 ? (
                    <p>No teams created yet.</p>
                ) : (
                    <table className="teams-table">
                        <thead>
                            <tr>
                                <th>Team Name</th>
                                <th>Project Title</th>
                                <th>Deadline</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {teams.map((team) => (
                                <tr key={team.id}>
                                    <td>{team.team_name}</td>
                                    <td>{team.project_title}</td>
                                    <td>
                                        {team.deadline
                                            ? new Date(team.deadline)
                                                  .toISOString()
                                                  .split("T")[0]
                                            : "Not set"}
                                    </td>
                                    <td>
                                        <button
                                            onClick={() =>
                                                navigate(`/teams/${team.id}`)
                                            }
                                            className="view-team-btn"
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default Teams;
