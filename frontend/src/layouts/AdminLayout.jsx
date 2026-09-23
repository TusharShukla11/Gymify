import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const menuItems = [
    {
      name: "Members",
      path: "/members",
      icon: "👥"
    },
    {
      name: "Trainers",
      path: "/trainers",
      icon: "🏋️"
    },
    {
      name: "Memberships",
      path: "/memberships",
      icon: "💳"
    },
    {
      name: "Payments",
      path: "/payments",
      icon: "💰"
    },
    {
      name: "Attendance",
      path: "/attendance",
      icon: "📅"
    },
    {
      name: "Workouts",
      path: "/workouts",
      icon: "🏃"
    },
    {
      name: "Diet Plans",
      path: "/diets",
      icon: "🥗"
    },
    {
      name: "Expenses",
      path: "/expenses",
      icon: "💵"
    },
    {
      name: "Notifications",
      path: "/notifications",
      icon: "🔔"
    }
  ];

  return (
    <div className="admin-layout">

      {/* ================= SIDEBAR ================= */}
      <aside className="admin-sidebar">

        {/* LOGO */}
        <div className="sidebar-logo">

          <div className="sidebar-logo-icon">
            G
          </div>

          <div>
            <strong>GYMIFY</strong>
            <span>MANAGEMENT</span>
          </div>

        </div>


        {/* NAVIGATION */}
        <nav className="sidebar-nav">

          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `sidebar-link ${
                  isActive ? "active" : ""
                }`
              }
            >
              <span className="sidebar-icon">
                {item.icon}
              </span>

              <span>
                {item.name}
              </span>
            </NavLink>
          ))}

        </nav>


        {/* BOTTOM USER */}
        <div className="sidebar-bottom">

          <div className="sidebar-user">

            <div className="sidebar-avatar">
              {user?.name
                ? user.name
                    .charAt(0)
                    .toUpperCase()
                : "A"}
            </div>

            <div className="sidebar-user-info">

              <strong>
                {user?.name ||
                  "Administrator"}
              </strong>

              <span>
                {user?.role ||
                  "ADMIN"}
              </span>

            </div>

          </div>


          <button
            className="logout-button"
            onClick={handleLogout}
          >
            ⇥ Logout
          </button>

        </div>

      </aside>


      {/* ================= MAIN ================= */}
      <div className="admin-main">

        {/* TOPBAR */}
        <header className="admin-topbar">

          <div>
            <strong>
              Gym Management System
            </strong>
          </div>

          <div className="topbar-user">

            <span className="notification-icon">
              🔔
            </span>

            <div className="topbar-avatar">
              {user?.name
                ? user.name
                    .charAt(0)
                    .toUpperCase()
                : "A"}
            </div>

            <div className="topbar-user-info">

              <strong>
                {user?.name ||
                  "Administrator"}
              </strong>

              <span>
                {user?.role ||
                  "ADMIN"}
              </span>

            </div>

          </div>

        </header>


        {/* PAGE CONTENT */}
        <main className="admin-content">
          <Outlet />
        </main>

      </div>

    </div>
  );
}

export default AdminLayout;