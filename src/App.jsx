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


function App() {
  return (
    <Routes>
      <Route path="/" element={<TerapeutaLogin />} />
      <Route path="/dashboard" element={<DashboardTerapeuta />} />
      <Route path="/pacientes" element={<PacientesTerapeuta />} />
      <Route path="/ejercicios" element={<EjerciciosTerapeuta />} />
      <Route path="/ejercicios/nuevo" element={<SelectExerciseType />} />
      <Route path="/ejercicios/nuevo/ia" element={<AddExerciseIA />} />
      <Route path="/pacientes/:pacienteId" element={<PacienteDetail />} />
      {/* <Route path="/ejercicios/nuevo/manual" element={<div>Crear manual (próximamente)</div>} /> */}
      {/* fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
