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
    <nav className={`navbar-modern fixed-top ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-inner container-fluid px-4">

        {/* LOGOS */}
        <div className="navbar-logos" onClick={() => navigate("/dashboard")}>
          <img
            src="https://raw.githubusercontent.com/Tesis-Aphasia/Web-App-RehabilitIA/refs/heads/main/src/assets/brain_logo.png"
            className="logo-rehab"
            alt="RehabilitIA"
          />
          <div className="navbar-logo" onClick={() => navigate("/dashboard")} > Rehabilit<span className="logo-accent">IA</span> </div>
          <img
            src="https://raw.githubusercontent.com/Tesis-Aphasia/Web-App-RehabilitIA/refs/heads/main/src/assets/logo_disc.png"
            className="logo-uniandes"
            alt="Uniandes"
          />
        </div>

        {/* MENÚ */}
        <ul className="navbar-links d-none d-md-flex gap-4">
          {tabs.map((tab) => (
            <li key={tab.key}>
              <button
                onClick={() => navigate(`/${tab.key}`)}
                className={`nav-btn ${active === tab.key ? "active" : ""}`}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>

        {/* PERFIL Y SALIR */}
        <div className="navbar-actions d-flex align-items-center gap-3">
          <span className="user-email d-none d-md-inline">{email}</span>
          <button className="btn-logout" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right me-1"></i> Salir
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
