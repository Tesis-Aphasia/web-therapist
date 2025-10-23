import React from "react";
import Table from "../common/Table";
import Pagination from "../common/Pagination";
import FilterGroup from "../common/FilterGroup";
import Badge from "../common/Badge";
import { useTableFilters } from "../../hooks/useTableFilters";
import { usePagination } from "../../hooks/usePagination";
import { FILTER_OPTIONS, EXERCISE_STATUS, EXERCISE_VISIBILITY, CUSTOMIZATION_OPTIONS } from "../../constants";
import "./VNESTTable.css";

const VNESTTable = ({ exercises, onEdit, onView }) => {
  // Filter and pagination logic
  const { filters, filteredData, updateFilter, clearFilters, hasActiveFilters } = useTableFilters(
    exercises.filter(e => e.terapia === "VNEST")
  );
  
  const pagination = usePagination(filteredData);

  // Table columns configuration
  const columns = [
    {
      title: "ID",
      key: "id",
      render: (exercise) => exercise.id,
    },
    {
      title: "Contexto",
      key: "contexto",
      render: (exercise) => exercise.contexto || "—",
    },
    {
      title: "Verbo",
      key: "verbo",
      render: (exercise) => exercise.verbo || "—",
    },
    {
      title: "Personalizado",
      key: "personalizado",
      render: (exercise) => exercise.personalizado ? "Sí" : "No",
    },
    {
      title: "Asignado a",
      key: "id_paciente",
      render: (exercise) => exercise.id_paciente || "—",
    },
    {
      title: "Estado",
      key: "revisado",
      render: (exercise) => (
        exercise.revisado ? (
          <Badge variant="success">Aprobado</Badge>
        ) : (
          <Badge variant="warning">Pendiente</Badge>
        )
      ),
    },
    {
      title: "Acción",
      key: "action",
      className: "text-end",
      render: (exercise) => (
        <div className="d-flex gap-2 justify-content-end">
          <button
            className="btn btn-sm btn-primary"
            onClick={() => onEdit(exercise)}
          >
            Revisar
          </button>
          <button
            className="btn btn-sm btn-secondary"
            onClick={() => onView(exercise)}
          >
            Ver
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="vn-table-container">
      {/* Filters */}
      <div className="mb-3 d-flex justify-content-between align-items-center flex-wrap">
        <div className="d-flex gap-3 flex-wrap align-items-center">
          <FilterGroup
            label="Visibilidad"
            type="select"
            value={filters.visibility}
            onChange={(e) => updateFilter('visibility', e.target.value)}
            options={FILTER_OPTIONS.VISIBILITY}
          />
          
          <FilterGroup
            label="Estado"
            type="select"
            value={filters.status}
            onChange={(e) => updateFilter('status', e.target.value)}
            options={FILTER_OPTIONS.STATUS}
          />
          
          <FilterGroup
            label="Personalizado"
            type="select"
            value={filters.customization}
            onChange={(e) => updateFilter('customization', e.target.value)}
            options={FILTER_OPTIONS.CUSTOMIZATION}
          />
          
          <FilterGroup
            label="Verbo"
            type="input"
            value={filters.verbo}
            onChange={(e) => updateFilter('verbo', e.target.value)}
            placeholder="Buscar verbo"
          />
          
          <FilterGroup
            label="Contexto"
            type="input"
            value={filters.contexto}
            onChange={(e) => updateFilter('contexto', e.target.value)}
            placeholder="Buscar contexto"
          />
          
          <FilterGroup
            label="ID Paciente"
            type="input"
            value={filters.idPaciente}
            onChange={(e) => updateFilter('idPaciente', e.target.value)}
            placeholder="Buscar ID paciente"
          />
        </div>

        {hasActiveFilters && (
          <button
            className="btn btn-outline-danger mt-2 mt-md-0"
            onClick={clearFilters}
            style={{ whiteSpace: "nowrap", minWidth: "110px" }}
          >
            Limpiar ✖
          </button>
        )}
      </div>

      {/* Table */}
      <Table
        columns={columns}
        data={pagination.paginatedData}
        striped
        hover
      />

      {/* Pagination */}
      <Pagination
        pagination={pagination}
        onPageChange={pagination.goToPage}
      />
    </div>
  );
};

export default VNESTTable;
