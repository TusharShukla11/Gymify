import { useNavigate } from "react-router-dom";
import "../styles/home.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">

      {/* ================= NAVBAR ================= */}
      <nav className="home-navbar">

        <div
          className="home-logo"
          onClick={() => navigate("/")}
        >
          <div className="home-logo-mark">
            G
          </div>

          <div className="home-logo-text">
            <strong>GYMIFY</strong>
            <span>GYM MANAGEMENT</span>
          </div>
        </div>


        <div className="home-nav-links">

          <a href="#home">HOME</a>
          <a href="#about">ABOUT</a>
          <a href="#services">SERVICES</a>
          <a href="#pricing">PRICING</a>
          <a href="#contact">CONTACT</a>

        </div>


        <button
          className="get-access-button"
          onClick={() => navigate("/login")}
        >
          GET ACCESS
        </button>

      </nav>


      {/* ================= HERO ================= */}
      <section
        className="home-hero"
        id="home"
      >

        <div className="hero-overlay"></div>

        <div className="hero-content">

          <div className="hero-tag">
            ⚡ SMART GYM MANAGEMENT
          </div>

          <h1>
            MANAGE YOUR
            <br />

            <span>
              FITNESS
            </span>

            <br />

            EMPIRE.
          </h1>

          <p>
            Powerful tools for members, trainers,
            memberships, attendance, payments,
            workouts and nutrition — all in one place.
          </p>


          <div className="hero-buttons">

            <button
              className="hero-primary-button"
              onClick={() => navigate("/login")}
            >
              GET STARTED
              <span>→</span>
            </button>

            <a
              href="#about"
              className="hero-secondary-button"
            >
              EXPLORE GYMIFY
            </a>

          </div>


          {/* STATS */}
          <div className="hero-stats">

            <div>
              <strong>24/7</strong>
              <span>GYM MANAGEMENT</span>
            </div>

            <div>
              <strong>100%</strong>
              <span>CENTRALIZED DATA</span>
            </div>

            <div>
              <strong>1</strong>
              <span>POWERFUL PLATFORM</span>
            </div>

          </div>

        </div>


        <div className="hero-scroll">
          SCROLL TO EXPLORE
          <span>↓</span>
        </div>

      </section>


      {/* ================= ABOUT ================= */}
      <section
        className="home-about"
        id="about"
      >

        <div className="about-image">

          <div className="about-image-overlay"></div>

          <div className="about-badge">
            GYMIFY
          </div>

        </div>


        <div className="about-content">

          <span className="section-kicker">
            OUR CORE SYSTEM
          </span>

          <h2>
            DESIGNED FOR
            <br />

            <span>
              BETTER GYMS.
            </span>
          </h2>

          <p>
            Gymify brings the complete gym operation
            into a single digital platform. Manage
            members, trainers, memberships, payments,
            attendance and fitness plans with ease.
          </p>

          <p>
            Spend less time managing paperwork and
            more time building a stronger fitness
            community.
          </p>


          <button
            className="about-button"
            onClick={() => navigate("/login")}
          >
            ENTER GYMIFY
            <span>→</span>
          </button>

        </div>

      </section>


      {/* ================= SERVICES ================= */}
      <section
        className="home-services"
        id="services"
      >

        <div className="section-heading-center">

          <span className="section-kicker">
            EVERYTHING YOU NEED
          </span>

          <h2>
            POWERFUL
            <span> FEATURES.</span>
          </h2>

          <p>
            One platform for your complete
            gym management workflow.
          </p>

        </div>


        <div className="services-grid">

          <div className="service-card">
            <span>01</span>
            <div className="service-icon">👥</div>
            <h3>MEMBERS</h3>
            <p>
              Manage member profiles,
              information and status.
            </p>
          </div>


          <div className="service-card">
            <span>02</span>
            <div className="service-icon">🏋️</div>
            <h3>TRAINERS</h3>
            <p>
              Manage trainers and
              member assignments.
            </p>
          </div>


          <div className="service-card">
            <span>03</span>
            <div className="service-icon">💳</div>
            <h3>MEMBERSHIPS</h3>
            <p>
              Create plans and track
              membership validity.
            </p>
          </div>


          <div className="service-card">
            <span>04</span>
            <div className="service-icon">📅</div>
            <h3>ATTENDANCE</h3>
            <p>
              Track check-ins,
              check-outs and history.
            </p>
          </div>


          <div className="service-card">
            <span>05</span>
            <div className="service-icon">💰</div>
            <h3>PAYMENTS</h3>
            <p>
              Record payments,
              receipts and revenue.
            </p>
          </div>


          <div className="service-card">
            <span>06</span>
            <div className="service-icon">🥗</div>
            <h3>FITNESS PLANS</h3>
            <p>
              Manage workout and
              diet plans for members.
            </p>
          </div>

        </div>

      </section>


      {/* ================= PRICING ================= */}
      <section
        className="home-pricing"
        id="pricing"
      >

        <div className="pricing-content">

          <span className="section-kicker">
            SIMPLE MANAGEMENT
          </span>

          <h2>
            ONE SYSTEM.
            <br />
            <span>EVERYTHING.</span>
          </h2>

          <p>
            Gymify brings members, trainers,
            memberships, attendance and finances
            together in one organized system.
          </p>

          <button
            onClick={() => navigate("/login")}
            className="pricing-button"
          >
            GET STARTED →
          </button>

        </div>

      </section>


      {/* ================= CONTACT ================= */}
      <section
        className="home-contact"
        id="contact"
      >

        <div>

          <span className="section-kicker">
            READY TO START?
          </span>

          <h2>
            TAKE YOUR GYM
            <br />
            TO THE <span>NEXT LEVEL.</span>
          </h2>

        </div>


        <button
          onClick={() => navigate("/login")}
          className="contact-button"
        >
          ACCESS GYMIFY →
        </button>

      </section>


      {/* ================= FOOTER ================= */}
      <footer className="home-footer">

        <div className="footer-brand">

          <div className="home-logo-mark">
            G
          </div>

          <div>
            <strong>GYMIFY</strong>
            <span>
              GYM MANAGEMENT SYSTEM
            </span>
          </div>

        </div>

        <p>
          © 2026 Gymify. Gym Management System.
        </p>

      </footer>

    </div>
  );
}

export default Home;