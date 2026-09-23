import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function MemberDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchMember() {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/members/${id}`);

      console.log("MEMBER DETAILS:", response.data);

      setMember(
        response.data?.data ||
        response.data?.member ||
        null
      );
    } catch (error) {
      console.error("Member details error:", error);

      setError(
        error.response?.data?.message ||
        "Failed to load member details."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMember();
  }, [id]);

  if (loading) {
    return (
      <div className="loading-state">
        Loading member details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="member-details-page">
        <div className="error-message">
          {error}
        </div>

        <button
          className="secondary-button"
          onClick={() => navigate("/members")}
        >
          ← Back to Members
        </button>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="empty-state">
        <h3>Member not found</h3>

        <button
          className="primary-button"
          onClick={() => navigate("/members")}
        >
          ← Back to Members
        </button>
      </div>
    );
  }

  return (
    <div className="member-details-page">

      <div className="page-header">
        <div>
          <button
            className="back-button"
            onClick={() => navigate("/members")}
          >
            ← Back to Members
          </button>

          <h1>{member.name || "Member"}</h1>

          <p>
            View member profile and information.
          </p>
        </div>

        <span
          className={
            member.status === "ACTIVE"
              ? "status-badge active"
              : "status-badge inactive"
          }
        >
          {member.status || "UNKNOWN"}
        </span>
      </div>

      <div className="details-card">

        <div className="card-header">
          <h2>Personal Information</h2>
        </div>

        <div className="details-grid">

          <div className="detail-item">
            <span>Name</span>
            <strong>{member.name || "-"}</strong>
          </div>

          <div className="detail-item">
            <span>Email</span>
            <strong>{member.email || "-"}</strong>
          </div>

          <div className="detail-item">
            <span>Phone</span>
            <strong>{member.phone || "-"}</strong>
          </div>

          <div className="detail-item">
            <span>Gender</span>
            <strong>{member.gender || "-"}</strong>
          </div>

          <div className="detail-item">
            <span>Date of Birth</span>
            <strong>
              {member.dateOfBirth
                ? new Date(
                    member.dateOfBirth
                  ).toLocaleDateString("en-IN")
                : "-"}
            </strong>
          </div>

          <div className="detail-item">
            <span>Joining Date</span>
            <strong>
              {member.joiningDate
                ? new Date(
                    member.joiningDate
                  ).toLocaleDateString("en-IN")
                : "-"}
            </strong>
          </div>

        </div>
      </div>

      <div className="details-card">

        <div className="card-header">
          <h2>Physical Information</h2>
        </div>

        <div className="details-grid">

          <div className="detail-item">
            <span>Height</span>
            <strong>
              {member.height
                ? `${member.height} cm`
                : "-"}
            </strong>
          </div>

          <div className="detail-item">
            <span>Weight</span>
            <strong>
              {member.weight
                ? `${member.weight} kg`
                : "-"}
            </strong>
          </div>

          <div className="detail-item">
            <span>BMI</span>
            <strong>
              {member.height && member.weight
                ? (
                    member.weight /
                    Math.pow(
                      member.height / 100,
                      2
                    )
                  ).toFixed(1)
                : "-"}
            </strong>
          </div>

        </div>
      </div>

    </div>
  );
}

export default MemberDetails;