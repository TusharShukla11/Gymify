import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";

import "../styles/Login.css";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  const [errors, setErrors] = useState({
    email: "",
    password: ""
  });

  const [status, setStatus] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    const nextErrors = {
      email: "",
      password: ""
    };

    let valid = true;

    if (!email.trim()) {
      nextErrors.email = "Email is required.";
      valid = false;
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      nextErrors.email =
        "Enter a valid email address.";
      valid = false;
    }

    if (!password) {
      nextErrors.password =
        "Password is required.";
      valid = false;
    }

    setErrors(nextErrors);
    setStatus("");

    if (!valid) {
      return;
    }

    try {
      setStatus("Signing you in...");

      const result = await loginUser(
        email.trim(),
        password
      );

      const token =
        result.data?.token ||
        result.token;

      const user =
        result.data?.user ||
        result.user ||
        null;

      if (!token) {
        throw new Error(
          "Token was not returned by server."
        );
      }

      /*
        Your existing AuthContext stores:
        token + user in localStorage.
      */
      login(token, user);

      /*
        Keep user logged in according to
        your existing authentication system.
        The remember checkbox is currently UI-only.
      */
      console.log(
        "Remember me:",
        remember
      );

      navigate("/members");

    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      setStatus("");

      setErrors({
        email: "",
        password:
          error.response?.data?.message ||
          "Login failed. Please check your credentials."
      });
    }
  }

  function handleForgotPassword() {
    setStatus(
      "Forgot password functionality will be added later."
    );
  }

  function handleSignup() {
    setStatus(
      "Signup functionality will be added later."
    );
  }

  return (
    <div className="gym-login-page">

      <div className="gym-login-container">

        {/* ========================================
            LEFT BRAND / GYM SECTION
        ========================================= */}

        <section className="gym-login-left">

          <div className="gym-logo">
            <div className="gym-logo-icon">
              G
            </div>

            <div>
              <strong>GYMIFY</strong>
              <span>
                GYM MANAGEMENT SYSTEM
              </span>
            </div>
          </div>


          <div className="gym-hero-content">

            <div className="hero-tag">
              SMART GYM MANAGEMENT
            </div>

            <h1>
              Manage your gym.
              <br />
              <span>
                Train without limits.
              </span>
            </h1>

            <p>
              Manage members, trainers,
              memberships, attendance,
              payments and fitness plans
              from one powerful platform.
            </p>

          </div>


          {/* Gym illustration */}
          <div className="gym-illustration">

            <div className="gym-floor"></div>

            <div className="gym-barbell">

              <div className="barbell-plate left-large"></div>
              <div className="barbell-plate left-small"></div>

              <div className="barbell-bar"></div>

              <div className="barbell-plate right-small"></div>
              <div className="barbell-plate right-large"></div>

            </div>


            {/* Person */}
            <div className="gym-person">

              <div className="person-head"></div>

              <div className="person-body"></div>

              <div className="person-arm left-arm"></div>
              <div className="person-arm right-arm"></div>

              <div className="person-leg left-leg"></div>
              <div className="person-leg right-leg"></div>

            </div>


            {/* Decorative circles */}
            <div className="floating-circle circle-a">
              +
            </div>

            <div className="floating-circle circle-b">
              ×
            </div>

            <div className="floating-circle circle-c">
              •
            </div>

          </div>


          <div className="gym-features">

            <div>
              <strong>24/7</strong>
              <span>Gym Management</span>
            </div>

            <div>
              <strong>100%</strong>
              <span>Centralized Data</span>
            </div>

            <div>
              <strong>1</strong>
              <span>Powerful Platform</span>
            </div>

          </div>

        </section>


        {/* ========================================
            RIGHT LOGIN SECTION
        ========================================= */}

        <section className="gym-login-right">

          <div className="login-box">

            <div className="mobile-logo">
              <div className="gym-logo-icon">
                G
              </div>

              <strong>
                GYMIFY
              </strong>
            </div>


            <div className="login-heading">

              <span className="login-small-title">
                MEMBER PORTAL
              </span>

              <h2>
                Welcome back
              </h2>

              <p>
                Sign in to your Gymify dashboard.
              </p>

            </div>


            {/* STATUS */}
            {status && (
              <div className="login-status">
                {status}
              </div>
            )}


            {/* LOGIN FORM */}
            <form
              className="gym-login-form"
              onSubmit={handleSubmit}
              noValidate
            >

              {/* EMAIL */}
              <div className="login-field">

                <label htmlFor="email">
                  Email Address
                </label>

                <div
                  className={`login-input-wrapper ${
                    errors.email
                      ? "input-error"
                      : ""
                  }`}
                >

                  <span className="input-icon">
                    @
                  </span>

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="Enter your email"
                    autoComplete="email"
                  />

                </div>

                <span className="field-error">
                  {errors.email}
                </span>

              </div>


              {/* PASSWORD */}
              <div className="login-field">

                <label htmlFor="password">
                  Password
                </label>

                <div
                  className={`login-input-wrapper ${
                    errors.password
                      ? "input-error"
                      : ""
                  }`}
                >

                  <span className="input-icon">
                    ●
                  </span>

                  <input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    placeholder="Enter your password"
                    autoComplete="current-password"
                  />

                  <button
                    type="button"
                    className="show-password"
                    onClick={() =>
                      setShowPassword(
                        (previous) =>
                          !previous
                      )
                    }
                  >
                    {showPassword
                      ? "Hide"
                      : "Show"}
                  </button>

                </div>

                <span className="field-error">
                  {errors.password}
                </span>

              </div>


              {/* OPTIONS */}
              <div className="login-options">

                <label className="remember-option">

                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) =>
                      setRemember(
                        e.target.checked
                      )
                    }
                  />

                  <span>
                    Keep me signed in
                  </span>

                </label>


                <button
                  type="button"
                  className="forgot-password"
                  onClick={
                    handleForgotPassword
                  }
                >
                  Forgot password?
                </button>

              </div>


              {/* SUBMIT */}
              <button
                type="submit"
                className="gym-login-button"
              >
                Sign In
                <span>→</span>
              </button>

            </form>


            {/* DIVIDER */}
            <div className="login-divider">

              <span></span>

              <p>
                Or continue with
              </p>

              <span></span>

            </div>


            {/* SOCIAL */}
            <div className="social-buttons">

              <button
                type="button"
                onClick={() =>
                  setStatus(
                    "Google login will be added later."
                  )
                }
              >
                <strong>G</strong>
                Google
              </button>

              <button
                type="button"
                onClick={() =>
                  setStatus(
                    "Apple login will be added later."
                  )
                }
              >
                <strong>●</strong>
                Apple
              </button>

            </div>


            {/* SIGN UP */}
            <div className="signup-section">

              <span>
                Don't have an account?
              </span>

              <button
                type="button"
                onClick={handleSignup}
              >
                Create Account
              </button>

            </div>


            <div className="login-footer">
              GYMIFY © 2026 · Fitness Management
            </div>

          </div>

        </section>

      </div>

    </div>
  );
}

export default Login;