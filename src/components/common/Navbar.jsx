import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ active }) => {
  const navigate = useNavigate();
  const email = localStorage.getItem("terapeutaEmail");
  const [scrolled, setScrolled] = useState(false);

  // Efecto para aplicar fondo blur al hacer scroll
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
    { key: "ajustes", label: "Ajustes" },
  ];

  return (
    <nav
      className={`navbar navbar-expand-lg fixed-top ${
        scrolled ? "navbar-scrolled" : ""
      }`}
    >
      <div className="container-fluid d-flex justify-content-between align-items-center px-4">
        {/* === LOGO / TÍTULO === */}
        <div
          className="navbar-brand text-primary fw-bold fs-4"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/dashboard")}
        >
          Rehabilita
        </div>

        {/* === MENÚ DE NAVEGACIÓN === */}
        <ul className="nav d-none d-md-flex gap-4">
          {tabs.map((tab) => (
            <li className="nav-item" key={tab.key}>
              <button
                onClick={() => navigate(`/${tab.key}`)}
                className={`nav-link fw-semibold ${
                  active === tab.key
                    ? "active-link"
                    : "inactive-link"
                }`}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>

        {/* === PERFIL Y LOGOUT === */}
        <div className="d-flex align-items-center gap-3">
          <span className="fw-semibold text-secondary small d-none d-md-inline">
            {email}
          </span>
          <button
            onClick={handleLogout}
            className="btn btn-sm btn-outline-primary fw-semibold"
          >
            <i className="bi bi-box-arrow-right me-1"></i>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
