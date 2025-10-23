// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ErrorBoundary from "./components/common/ErrorBoundary";
import ProtectedRoute from "./components/common/ProtectedRoute";
import TerapeutaLogin from "./components/login/TerapeutaLogin";
import DashboardTerapeuta from "./components/dashboard/DashboardTerapeuta";
import PacientesTerapeuta from "./components/patients/PacientesTerapeuta";
import EjerciciosTerapeuta from "./components/exercises/EjerciciosTerapeuta";
import SelectExerciseType from "./components/addExercise/SelectExerciseType";
import AddExerciseIA from "./components/addExercise/AddExerciseIA";
import PacienteDetail from "./components/patients/PacienteDetail";
import { ROUTES } from "./constants";

// Import shared styles
import "./styles/variables.css";
import "./styles/components.css";
import "./styles/utilities.css";

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path={ROUTES.LOGIN} element={<TerapeutaLogin />} />
          
          {/* Protected routes */}
          <Route path={ROUTES.DASHBOARD} element={
            <ProtectedRoute>
              <DashboardTerapeuta />
            </ProtectedRoute>
          } />
          <Route path={ROUTES.PATIENTS} element={
            <ProtectedRoute>
              <PacientesTerapeuta />
            </ProtectedRoute>
          } />
          <Route path={ROUTES.EXERCISES} element={
            <ProtectedRoute>
              <EjerciciosTerapeuta />
            </ProtectedRoute>
          } />
          <Route path={ROUTES.NEW_EXERCISE} element={
            <ProtectedRoute>
              <SelectExerciseType />
            </ProtectedRoute>
          } />
          <Route path={ROUTES.NEW_EXERCISE_IA} element={
            <ProtectedRoute>
              <AddExerciseIA />
            </ProtectedRoute>
          } />
          <Route path={ROUTES.PATIENT_DETAIL} element={
            <ProtectedRoute>
              <PacienteDetail />
            </ProtectedRoute>
          } />
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
        </Routes>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
