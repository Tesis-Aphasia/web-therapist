import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Admin.css";
import { authAdmin } from "../../services/adminService";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const valid = await authAdmin(email, password);
      if (valid) {
        localStorage.setItem("adminEmail", email);
        navigate("/admin/dashboard");
      } else {
        setError("Credenciales inválidas. Intenta nuevamente.");
      }
    } catch (err) {
      console.error(err);
      setError("Error al iniciar sesión. Revisa tu conexión o credenciales.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card fade-in">
        <div className="login-header">
          <h1>Rehabilitia</h1>
          <p className="subtitle">Panel de Administración</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              required
            />
          </div>

          {error && <div className="alert-error">{error}</div>}

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner"></span> Ingresando...
              </>
            ) : (
              "Iniciar sesión"
            )}
          </button>
        </form>

        <p className="login-footer">© {new Date().getFullYear()} Rehabilitia · Admin</p>
      </div>
    </div>
  );
};

export default AdminLogin;
