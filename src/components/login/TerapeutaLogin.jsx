import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginTherapist } from "../../services/therapistService";
import "./TerapeutaLogin.css";

const TerapeutaLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const isValid = await loginTherapist(email, password);

      if (!isValid) {
        setError("Credenciales incorrectas. Verifica tu email o contraseña.");
        setLoading(false);
        return;
      }

      // ✅ Guardar sesión
      localStorage.setItem("terapeutaEmail", email);
      navigate("/dashboard");
    } catch (err) {
      console.error("Error en login:", err);
      setError("Error al iniciar sesión. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container brain-bg">
      <div className="login-card shadow">
        <div className="text-center mb-4">
          <h1 className="fw-bold text-dark fs-3 mb-1">Dashboard Terapeuta</h1>
          <p className="text-muted small">Bienvenido a Rehabilita</p>
        </div>

        <form onSubmit={handleLogin}>
          {/* Email */}
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

          {/* Contraseña */}
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

          {/* Error */}
          {error && (
            <div
              className="alert alert-danger py-2 small text-center"
              role="alert"
            >
              {error}
            </div>
          )}

          <div className="d-flex justify-content-end mb-3">
            <a href="#" className="text-decoration-none small text-primary">
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          {/* Botón login */}
          <button
            type="submit"
            className="btn btn-primary w-100 fw-bold rounded-3"
            disabled={loading}
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
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
