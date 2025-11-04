import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendTherapistRequest } from "../../services/therapistService";
import "./TerapeutaLogin.css"; // usamos los mismos estilos

const TerapeutaRegistro = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    celular: "",
    profesion: "",
    motivacion: "", // 🔹 nuevo campo
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      await sendTherapistRequest(formData);
      setSuccess(true);
      setFormData({
        nombre: "",
        email: "",
        celular: "",
        profesion: "",
        motivacion: "",
      });
    } catch (err) {
      console.error("Error al enviar solicitud:", err);
      setError("No se pudo enviar la solicitud. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="gradient-bg" />
      <div className="registro-card">
        <div className="text-center mb-4">
          <h1 className="fw-bold text-dark fs-3 mb-1">Registro de Terapeuta</h1>
          <p className="text-muted small">
            Envía tu solicitud para ser parte de <strong>Rehabilitia</strong>
          </p>
        </div>

        {success ? (
          <div className="alert alert-success text-center">
            ✅ Tu solicitud ha sido enviada. Un administrador la revisará pronto.
            <div className="mt-3">
              <button
                className="btn-login"
                onClick={() => navigate("/terapeuta/login")}
              >
                Volver al inicio de sesión
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="nombre" className="form-label fw-semibold small">
                Nombre completo
              </label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                className="form-control rounded-3"
                placeholder="Tu nombre completo"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label fw-semibold small">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="form-control rounded-3"
                placeholder="example@email.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="celular" className="form-label fw-semibold small">
                Celular
              </label>
              <input
                id="celular"
                name="celular"
                type="text"
                className="form-control rounded-3"
                placeholder="3212345678"
                value={formData.celular}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label
                htmlFor="profesion"
                className="form-label fw-semibold small"
              >
                Profesión
              </label>
              <input
                id="profesion"
                name="profesion"
                type="text"
                className="form-control rounded-3"
                placeholder="Ej: Fonoaudiólogo"
                value={formData.profesion}
                onChange={handleChange}
                required
              />
            </div>

            {/* 🔹 Nuevo campo de motivación */}
            <div className="mb-3">
              <label
                htmlFor="motivacion"
                className="form-label fw-semibold small"
              >
                ¿Por qué quieres ser parte de esta comunidad?
              </label>
              <textarea
                id="motivacion"
                name="motivacion"
                className="form-control rounded-3"
                placeholder="Cuéntanos brevemente tu motivación o experiencia."
                value={formData.motivacion}
                onChange={handleChange}
                rows={4}
                required
              />
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <button type="submit" className="btn-login" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Enviando solicitud...
                </>
              ) : (
                "Enviar solicitud"
              )}
            </button>

            {/* 🔹 Mensaje aclaratorio */}
            <p className="text-muted small text-center mt-3">
              Podremos contactarte para verificar tu información o solicitar más
              detalles sobre tu experiencia profesional.
            </p>

            <div className="text-center mt-3">
              <p className="small text-muted">
                ¿Ya tienes una cuenta?{" "}
                <a
                  href="/terapeuta/login"
                  className="forgot-link small fw-semibold"
                >
                  Inicia sesión
                </a>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default TerapeutaRegistro;
