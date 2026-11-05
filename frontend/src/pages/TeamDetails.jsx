import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

function TeamDetails() {
  const { id } = useParams();

  const [team, setTeam] = useState(null);
  const [members, setMembers] = useState([]);
  const [availableMembers, setAvailableMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const fetchTeamDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/teams/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTeam(response.data);
    } catch (err) {
      setError("Failed to load team details");
    }
  };

  const fetchMembers = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/team-members/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMembers(
        Array.isArray(response.data)
          ? response.data
          : response.data.members || []
      );
    } catch (err) {
      setMembers([]);
    }
  };

  const fetchAvailableMembers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const users = Array.isArray(response.data)
        ? response.data
        : response.data.users || [];

      setAvailableMembers(
        users.filter((user) => user.role === "member")
      );
    } catch (err) {
      setError("Failed to load registered members");
    }
  };

  useEffect(() => {
    fetchTeamDetails();
    fetchMembers();
    fetchAvailableMembers();
  }, [id]);

  const handleAddMember = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!selectedMember) {
      setError("Please select a member");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/team-members/add",
        {
          team_id: id,
          member_id: selectedMember,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Member added successfully!");
      setSelectedMember("");
      fetchMembers();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to add member"
      );
    }
  };

  const handleRemoveMember = async (memberId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to remove this member from the team?"
    );

    if (!confirmDelete) return;

    setMessage("");
    setError("");

    try {
      await axios.delete(
        `http://localhost:5000/api/team-members/${id}/${memberId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Member removed successfully!");
      fetchMembers();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to remove member"
      );
    }
  };

  if (error && !team) {
    return <h2>{error}</h2>;
  }

  if (!team) {
    return <h2>Loading Team Details...</h2>;
  }

  return (
    <div className="team-details-container">

      <Link to="/teams" className="back-link">
        ← Back to Teams
      </Link>

      <div className="team-details-header">
        <h1>Team Details</h1>
        <p>Manage your team members and project information.</p>
      </div>

      {/* Team Information */}
      <div className="team-info-card">
        <div className="team-info-heading">
          <div className="team-icon">👥</div>
          <h2>{team.team_name}</h2>
        </div>

        <div className="team-info-content">
          <div>
            <h3>Project Name</h3>
            <p>{team.project_name || "Not specified"}</p>
          </div>

          <div>
            <h3>Description</h3>
            <p>{team.description || "No description provided."}</p>
          </div>
        </div>

        <div className="member-count">
          👤 {members.length} Team Member(s)
        </div>
      </div>

      {/* Add Member Section */}
      <div className="add-member-container">
        <h2>Add Member to Team</h2>
        <p>Add registered students to your project team.</p>

        {message && (
          <p className="success-message">{message}</p>
        )}

        {error && (
          <p className="error-message">{error}</p>
        )}

        <form onSubmit={handleAddMember} className="add-member-form">
          <select
            value={selectedMember}
            onChange={(e) => setSelectedMember(e.target.value)}
            required
          >
            <option value="">Select a Member</option>

            {availableMembers
              .filter(
                (user) =>
                  !members.some(
                    (member) => member.id === user.id
                  )
              )
              .map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name} ({member.email})
                </option>
              ))}
          </select>

          <button type="submit" className="add-member-button">
            + Add Member
          </button>
        </form>
      </div>

      {/* Team Members List */}
      <div className="team-members-list">
        <h2>Team Members</h2>
        <p>Students currently working on this project.</p>

        {members.length === 0 ? (
          <div className="empty-members">
            No members added to this team yet.
          </div>
        ) : (
          <div className="members-table-container">
            <table className="teams-table">
              <thead>
                <tr>
                  <th>Member Name</th>
                  <th>Email Address</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {members.map((member) => (
                  <tr key={member.id}>
                    <td>
                      <div className="member-name-cell">
                        <span className="member-avatar">
                          {member.name?.charAt(0).toUpperCase()}
                        </span>
                        <strong>{member.name}</strong>
                      </div>
                    </td>

                    <td>{member.email}</td>

                    <td>
                      <button
                        className="remove-member-button"
                        onClick={() =>
                          handleRemoveMember(member.id)
                        }
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}

export default TeamDetails;
