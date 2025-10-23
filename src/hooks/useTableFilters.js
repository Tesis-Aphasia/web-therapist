import { useState, useMemo, useCallback } from 'react';
import { FILTER_OPTIONS, EXERCISE_STATUS, EXERCISE_VISIBILITY, CUSTOMIZATION_OPTIONS } from '../constants';

/**
 * Hook for table filtering logic
 * @param {Array} data - Array of items to filter
 * @param {Object} filterConfig - Configuration for available filters
 * @returns {Object} Filter state and methods
 */
export const useTableFilters = (data = [], filterConfig = {}) => {
  const [filters, setFilters] = useState({
    visibility: EXERCISE_VISIBILITY.ALL,
    status: EXERCISE_STATUS.ALL,
    customization: CUSTOMIZATION_OPTIONS.ALL,
    verbo: '',
    contexto: '',
    idPaciente: '',
    ...filterConfig.initialFilters,
  });

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // Visibility filter
      if (filters.visibility !== EXERCISE_VISIBILITY.ALL && item.tipo !== filters.visibility) {
        return false;
      }

      // Status filter
      if (filters.status !== EXERCISE_STATUS.ALL) {
        if (filters.status === EXERCISE_STATUS.APPROVED && !item.revisado) return false;
        if (filters.status === EXERCISE_STATUS.PENDING && item.revisado) return false;
      }

      // Customization filter
      if (filters.customization !== CUSTOMIZATION_OPTIONS.ALL) {
        const isPersonalizado = !!item.personalizado;
        if (filters.customization === CUSTOMIZATION_OPTIONS.YES && !isPersonalizado) return false;
        if (filters.customization === CUSTOMIZATION_OPTIONS.NO && isPersonalizado) return false;
      }

      // Text filters
      if (filters.verbo && !item.verbo?.toLowerCase().includes(filters.verbo.toLowerCase())) {
        return false;
      }

      if (filters.contexto && !item.contexto?.toLowerCase().includes(filters.contexto.toLowerCase())) {
        return false;
      }

      if (filters.idPaciente && !item.id_paciente?.toString().includes(filters.idPaciente)) {
        return false;
      }

      return true;
    });
  }, [data, filters]);

  const updateFilter = useCallback((filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value,
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      visibility: EXERCISE_VISIBILITY.ALL,
      status: EXERCISE_STATUS.ALL,
      customization: CUSTOMIZATION_OPTIONS.ALL,
      verbo: '',
      contexto: '',
      idPaciente: '',
    });
  }, []);

  const hasActiveFilters = useMemo(() => {
    return Object.entries(filters).some(([key, value]) => {
      if (key === 'visibility') return value !== EXERCISE_VISIBILITY.ALL;
      if (key === 'status') return value !== EXERCISE_STATUS.ALL;
      if (key === 'customization') return value !== CUSTOMIZATION_OPTIONS.ALL;
      return value !== '';
    });
  }, [filters]);

  return {
    filters,
    filteredData,
    updateFilter,
    clearFilters,
    hasActiveFilters,
  };
};
