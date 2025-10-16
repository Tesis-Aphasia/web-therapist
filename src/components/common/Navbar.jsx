import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ active }) => {
  const navigate = useNavigate();
  const email = localStorage.getItem("terapeutaEmail");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("terapeutaEmail");
    navigate("/");
  };

  const tabs = [
    { key: "dashboard", label: "Dashboard" },
    { key: "pacientes", label: "Pacientes" },
    { key: "ejercicios", label: "Ejercicios" },
  ];

  return (
    <nav className={`navbar fixed-top ${scrolled ? "navbar-scrolled" : ""}`}>
      <div className="container-fluid d-flex justify-content-between align-items-center px-4">
        {/* LOGO */}
        <div
          className="navbar-brand"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/dashboard")}
        >
          Rehabilita
        </div>

        {/* MENÚ */}
        <ul className="nav d-none d-md-flex gap-4">
          {tabs.map((tab) => (
            <li className="nav-item" key={tab.key}>
              <button
                onClick={() => navigate(`/${tab.key}`)}
                className={`nav-link ${
                  active === tab.key ? "active-link" : "inactive-link"
                }`}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>

        {/* PERFIL Y LOGOUT */}
        <div className="d-flex align-items-center gap-3">
          <span className="fw-semibold text-secondary small d-none d-md-inline">
            {email}
          </span>
          <button onClick={handleLogout} className="btn btn-logout">
            <i className="bi bi-box-arrow-right me-1"></i> Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
