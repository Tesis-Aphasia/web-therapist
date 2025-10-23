import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { ROUTES } from "../../constants";
import "./TerapeutaLogin.css";

const TerapeutaLogin = () => {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    
    const result = await login(email, password);
    if (result.success) {
      navigate(ROUTES.DASHBOARD);
    }
  };

  return (
    <div className="login-container">
      <div className="gradient-bg" />
      <div className="login-card">
        <div className="text-center mb-4">
          <h1 className="fw-bold text-dark fs-3 mb-1">Dashboard Terapeuta</h1>
          <p className="text-muted small">Bienvenido a <strong>Rehabilita</strong></p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label fw-semibold small">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="form-control rounded-3"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label fw-semibold small">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              className="form-control rounded-3"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <div className="d-flex justify-content-end mb-3">
            <a href="#" className="forgot-link small">¿Olvidaste tu contraseña?</a>
          </div>

          <button
            type="submit"
            className="btn-login"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Iniciando sesión...
              </>
            ) : (
              "Iniciar sesión"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TerapeutaLogin;
