import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  loginUnified,
  resetTherapistPassword,
} from "../../services/therapistService";
import "./TerapeutaLogin.css";

const TerapeutaLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMessage, setResetMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await loginUnified(email, password);

      if (result.tipo === "admin") {
        navigate("/admin/dashboard");
        return;
      }

      if (result.tipo === "terapeuta") {
        localStorage.setItem("terapeutaEmail", email);
        localStorage.setItem("terapeutaUID", result.user.uid);
        if (result.data)
          localStorage.setItem("terapeutaData", JSON.stringify(result.data));

        navigate("/dashboard");
        return;
      }

      setError("Tus credenciales son incorrectas. Revísalas e intenta nuevamente.");
    } catch (err) {
      console.error("Error en login:", err);
      setError("Error al iniciar sesión. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setResetMessage("");
    const res = await resetTherapistPassword(resetEmail);
    if (res.success) {
      setResetMessage(
        "✅ Te hemos enviado un correo para restablecer tu contraseña."
      );
    } else {
      setResetMessage(
        "⚠️ No se pudo enviar el correo. Verifica el email o intenta más tarde."
      );
    }
  };

  return (
    <div className="login-container">
      <div className="gradient-bg" />
      <div className="login-card fade-in">
        <div className="text-center mb-4">
          <h1 className="fw-bold text-dark fs-3 mb-1">Dashboard Terapeuta</h1>
          <p className="text-muted small">
            Bienvenido a <strong>Rehabilitia</strong>
          </p>
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
            <button
              type="button"
              className="forgot-link small"
              onClick={() => setShowReset(true)}
              style={{
                background: "none",
                border: "none",
                color: "#ef7e06",
                cursor: "pointer",
              }}
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Iniciando sesión...
              </>
            ) : (
              "Iniciar sesión"
            )}
          </button>

          <div className="text-center mt-4">
            <p className="small text-muted">
              ¿No tienes una cuenta?{" "}
              <button
                type="button"
                className="forgot-link fw-semibold"
                onClick={() => navigate("/registro")}
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                }}
              >
                Regístrate aquí
              </button>
            </p>
          </div>
        </form>
      </div>

      {/* 🔹 Modal de restablecimiento */}
      {showReset && (
        <div className="reset-overlay">
          <div className="reset-modal fade-in">
            <h3>Restablecer contraseña</h3>
            <p className="small text-muted">
              Ingresa tu correo y te enviaremos un enlace para crear una nueva
              contraseña.
            </p>
            <form onSubmit={handlePasswordReset}>
              <input
                type="email"
                placeholder="tu@email.com"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
              />
              <button type="submit" className="btn-login mt-2">
                Enviar correo
              </button>
            </form>
            {resetMessage && <p className="small mt-2">{resetMessage}</p>}
            <button className="close-btn" onClick={() => setShowReset(false)}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TerapeutaLogin;
