import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreateTask() {
  const navigate = useNavigate();

  const [teams, setTeams] = useState([]);
  const [members, setMembers] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    team_id: "",
    assigned_to: "",
    priority: "medium",
    due_date: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingTeams, setLoadingTeams] = useState(true);
  const [loadingMembers, setLoadingMembers] = useState(false);

  const getToken = () => localStorage.getItem("token");

  // Fetch all teams
  useEffect(() => {
    const fetchTeams = async () => {
      const token = getToken();

      if (!token) {
        setError("Please login again. Your session has expired.");
        setLoadingTeams(false);
        return;
      }

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
        setError("");
      } catch (err) {
        console.error("Fetch Teams Error:", err.response?.data);

        setError(
          err.response?.data?.message || "Unable to load teams."
        );
      } finally {
        setLoadingTeams(false);
      }
    };

    fetchTeams();
  }, []);

  // Fetch members when a team is selected
  useEffect(() => {
    const fetchMembers = async () => {
      if (!formData.team_id) {
        setMembers([]);
        return;
      }

      const token = getToken();

      if (!token) {
        setError("Please login again. Your session has expired.");
        return;
      }

      setLoadingMembers(true);

      try {
        const response = await axios.get(
          `http://localhost:5000/api/team-members/${formData.team_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setMembers(response.data.members || []);
      } catch (err) {
        console.error("Fetch Members Error:", err.response?.data);

        setError(
          err.response?.data?.message ||
          "Unable to load team members."
        );
      } finally {
        setLoadingMembers(false);
      }
    };

    fetchMembers();
  }, [formData.team_id]);

  // Handle form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle team selection
  const handleTeamChange = (e) => {
    setFormData({
      ...formData,
      team_id: e.target.value,
      assigned_to: ""
    });

    setMembers([]);
    setError("");
  };

  // Create task
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const token = getToken();

    if (!token) {
      alert("Your session has expired. Please login again.");
      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      const taskData = {
        ...formData,
        team_id: Number(formData.team_id),
        assigned_to: formData.assigned_to
          ? Number(formData.assigned_to)
          : null
      };

      await axios.post(
        "http://localhost:5000/api/tasks",
        taskData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Task created successfully!");
      navigate("/tasks");
    } catch (err) {
      console.error("Create Task Error:", err.response?.data);

      if (err.response?.status === 401) {
        setError("Session expired. Please login again.");
      } else {
        setError(
          err.response?.data?.message ||
          "Failed to create task. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-task-container">
      <h1>Create New Task</h1>

      <p className="form-subtitle">
        Assign work and keep your team on track.
      </p>

      {error && (
        <p className="error-message">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        {/* Task Title */}
        <label>Task Title</label>
        <input
          type="text"
          name="title"
          placeholder="Enter task title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        {/* Description */}
        <label>Description</label>
        <textarea
          name="description"
          placeholder="Describe the task..."
          value={formData.description}
          onChange={handleChange}
          required
        />

        {/* Select Team */}
        <label>Select Team</label>
        <select
          name="team_id"
          value={formData.team_id}
          onChange={handleTeamChange}
          required
          disabled={loadingTeams}
        >
          <option value="">
            {loadingTeams
              ? "Loading teams..."
              : "-- Select Team --"}
          </option>

          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.team_name}
            </option>
          ))}
        </select>

        {/* Assign Member */}
        <label>Assign To Member</label>
        <select
          name="assigned_to"
          value={formData.assigned_to}
          onChange={handleChange}
          disabled={!formData.team_id || loadingMembers}
        >
          <option value="">
            {loadingMembers
              ? "Loading members..."
              : "-- Select Member --"}
          </option>

          {members.map((member) => (
            <option key={member.id} value={member.id}>
              {member.name}
            </option>
          ))}
        </select>

        {/* Priority */}
        <label>Priority</label>
        <select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          required
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        {/* Due Date */}
        <label>Due Date</label>
        <input
          type="date"
          name="due_date"
          value={formData.due_date}
          onChange={handleChange}
          min={new Date().toISOString().split("T")[0]}
          required
        />

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || loadingTeams}
        >
          {loading ? "Creating Task..." : "Create Task"}
        </button>
      </form>
    </div>
  );
}

export default CreateTask;
