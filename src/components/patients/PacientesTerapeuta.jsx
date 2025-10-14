import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../common/Navbar";
import {
  getPatientsByTherapist,
  updatePatient,
} from "../../services/patientService";
import "./PacientesTerapeuta.css";
import AddPatient from "../addPatient/AddPatient";
import AssignExercise from "../assignExercise/AssignExercise";

const PacientesTerapeuta = () => {
  const navigate = useNavigate();
  const [terapeutaEmail] = useState(localStorage.getItem("terapeutaEmail"));
  const [pacientes, setPacientes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [editData, setEditData] = useState({ nombre: "", email: "" });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);

  // 🔹 Obtener pacientes desde el servicio
  useEffect(() => {
    if (!terapeutaEmail) {
      navigate("/");
      return;
    }

    const unsubscribe = getPatientsByTherapist(terapeutaEmail, setPacientes);
    return () => unsubscribe && unsubscribe();
  }, [terapeutaEmail, navigate]);

  // 🔹 Seleccionar paciente
  const handleSelect = (p) => {
    setSelected(p);
    setEditData({
      nombre: p.nombre || "",
      email: p.email || "",
    });
  };

  // 🔹 Guardar cambios usando el servicio
  const handleUpdate = async () => {
    try {
      await updatePatient(selected.id, editData);
      alert("✅ Paciente actualizado con éxito");
    } catch (err) {
      console.error("Error actualizando paciente:", err);
      alert("❌ Error al actualizar");
    }
  };

  return (
    <div className="page-container">
      {/* NAVBAR GLOBAL */}
      <Navbar active="pacientes" />

      {/* CONTENIDO */}
      <main className="container py-5 mt-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold text-dark mb-0">Pacientes</h2>
          <button
            className="btn btn-primary fw-semibold"
            onClick={() => setShowAddModal(true)}
          >
            + Agregar Paciente
          </button>
        </div>

        {/* TABLA */}
        <div className="card shadow-sm border-0 rounded-4 mb-5">
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Nombre</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {pacientes.map((p) => (
                  <tr
                    key={p.id}
                    onClick={() => handleSelect(p)}
                    className={`table-row ${
                      selected?.id === p.id ? "table-active" : ""
                    }`}
                  >
                    <td>{p.nombre || "—"}</td>
                    <td>{p.email || "—"}</td>
                  </tr>
                ))}
                {pacientes.length === 0 && (
                  <tr>
                    <td colSpan="3" className="text-center text-muted py-3">
                      No hay pacientes asociados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* PANEL DE EDICIÓN */}
        {selected && (
          <div className="card shadow border-0 rounded-4 p-4">
            <h4 className="fw-bold mb-4 text-dark">Editar Paciente</h4>

            <div className="row g-4 mb-4">
              <div className="col-md-4">
                <label className="form-label fw-semibold small">Nombre</label>
                <input
                  type="text"
                  className="form-control"
                  value={editData.nombre}
                  onChange={(e) =>
                    setEditData({ ...editData, nombre: e.target.value })
                  }
                />
              </div>

              <div className="col-md-4">
                <label className="form-label fw-semibold small">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={editData.email}
                  onChange={(e) =>
                    setEditData({ ...editData, email: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="d-flex justify-content-between">
              <button
                onClick={handleUpdate}
                className="btn btn-primary fw-semibold"
              >
                Guardar cambios
              </button>

              <button
                onClick={() => setShowAssignModal(true)}
                className="btn btn-outline-primary fw-semibold"
              >
                Asignar ejercicios
              </button>
            </div>
          </div>
        )}
        {showAddModal && (
          <AddPatient
            open={showAddModal}
            onClose={() => setShowAddModal(false)}
            terapeutaEmail={terapeutaEmail}
          />
        )}
        {showAssignModal && (
          <AssignExercise
            open={showAssignModal}
            onClose={() => setShowAssignModal(false)}
            patient={selected}
          />
        )}
      </main>
    </div>
  );
};

export default PacientesTerapeuta;
