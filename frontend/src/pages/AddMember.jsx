import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AddMember() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
    height: "",
    weight: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Frontend validation
    if (formData.name.trim().length < 2) {
      setError("Name must contain at least 2 characters.");
      return;
    }

    if (!formData.email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        phone: formData.phone.trim() || undefined,
        gender: formData.gender || undefined,
        dateOfBirth: formData.dateOfBirth || undefined,
        height:
          formData.height !== ""
            ? Number(formData.height)
            : undefined,
        weight:
          formData.weight !== ""
            ? Number(formData.weight)
            : undefined
      };

      await api.post("/members", payload);

      setSuccess("Member created successfully!");

      setTimeout(() => {
        navigate("/members");
      }, 1000);

    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to create member."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="add-member-page">

      {/* HEADER */}

      <div className="page-header">

        <div>
          <h1>Add Member</h1>

          <p>
            Create a new member account.
          </p>
        </div>

        <button
          type="button"
          className="secondary-button"
          onClick={() => navigate("/members")}
        >
          ← Back to Members
        </button>

      </div>


      {/* FORM CARD */}

      <div className="form-card">

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {success && (
          <div className="success-message">
            {success}
          </div>
        )}


        <form onSubmit={handleSubmit}>

          {/* PERSONAL INFORMATION */}

          <div className="form-section">

            <h2>Personal Information</h2>

            <div className="form-grid">

              {/* NAME */}

              <div className="form-group">

                <label htmlFor="name">
                  Full Name *
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  required
                />

              </div>


              {/* EMAIL */}

              <div className="form-group">

                <label htmlFor="email">
                  Email *
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  required
                />

              </div>


              {/* PASSWORD */}

              <div className="form-group">

                <label htmlFor="password">
                  Password *
                </label>

                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimum 6 characters"
                  required
                />

              </div>


              {/* PHONE */}

              <div className="form-group">

                <label htmlFor="phone">
                  Phone
                </label>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                />

              </div>


              {/* GENDER */}

              <div className="form-group">

                <label htmlFor="gender">
                  Gender
                </label>

                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >

                  <option value="">
                    Select gender
                  </option>

                  <option value="MALE">
                    Male
                  </option>

                  <option value="FEMALE">
                    Female
                  </option>

                  <option value="OTHER">
                    Other
                  </option>

                </select>

              </div>


              {/* DATE OF BIRTH */}

              <div className="form-group">

                <label htmlFor="dateOfBirth">
                  Date of Birth
                </label>

                <input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                />

              </div>

            </div>

          </div>


          {/* PHYSICAL INFORMATION */}

          <div className="form-section">

            <h2>Physical Information</h2>

            <div className="form-grid">

              {/* HEIGHT */}

              <div className="form-group">

                <label htmlFor="height">
                  Height (cm)
                </label>

                <input
                  id="height"
                  name="height"
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.height}
                  onChange={handleChange}
                  placeholder="e.g. 175"
                />

              </div>


              {/* WEIGHT */}

              <div className="form-group">

                <label htmlFor="weight">
                  Weight (kg)
                </label>

                <input
                  id="weight"
                  name="weight"
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder="e.g. 70"
                />

              </div>

            </div>

          </div>


          {/* BUTTONS */}

          <div className="form-actions">

            <button
              type="button"
              className="secondary-button"
              onClick={() => navigate("/members")}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-button"
              disabled={loading}
            >
              {loading
                ? "Creating Member..."
                : "Create Member"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default AddMember;