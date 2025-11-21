// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import TerapeutaLogin from "./components/login/TerapeutaLogin";
import DashboardTerapeuta from "./components/dashboard/DashboardTerapeuta";
import PacientesTerapeuta from "./components/patients/PacientesTerapeuta";
import EjerciciosTerapeuta from "./components/exercises/EjerciciosTerapeuta";
import SelectExerciseType from "./components/addExercise/SelectExerciseType";
import AddExerciseIA from "./components/addExercise/AddExerciseIA";
import PacienteDetail from "./components/patients/PacienteDetail";
import TerapeutaRegistro from "./components/login/TerapeutaRegistro";

// 🔹 nuevos componentes del admin

import AdminDashboard from "./components/admin/AdminDashboard";

function App() {
  return (
    <Routes>
      {/* === TERAPEUTA === */}
      <Route path="/" element={<TerapeutaLogin />} />
      <Route path="/registro" element={<TerapeutaRegistro />} />
      <Route path="/dashboard" element={<DashboardTerapeuta />} />
      <Route path="/pacientes" element={<PacientesTerapeuta />} />
      <Route path="/pacientes/:pacienteId" element={<PacienteDetail />} />
      <Route path="/ejercicios" element={<EjerciciosTerapeuta />} />
      <Route path="/ejercicios/nuevo" element={<SelectExerciseType />} />
      <Route path="/ejercicios/nuevo/ia" element={<AddExerciseIA />} />

      {/* === ADMIN === */}
      <Route path="/admin/dashboard" element={<AdminDashboard />} />

      {/* === DEFAULT === */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
