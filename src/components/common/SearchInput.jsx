import React from 'react';

/**
 * Search input component with built-in styling
 * @param {string} value - Input value
 * @param {Function} onChange - Change handler
 * @param {string} placeholder - Placeholder text
 * @param {boolean} loading - Whether to show loading state
 * @param {Function} onClear - Clear handler
 * @param {string} className - Additional CSS classes
 * @param {Object} props - Additional props
 */
const SearchInput = ({ 
  value, 
  onChange, 
  placeholder = 'Buscar...', 
  loading = false,
  onClear,
  className = '',
  ...props 
}) => {
  const inputClasses = [
    'form-control',
    'search-input',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="search-input-container position-relative">
      <input
        type="text"
        className={inputClasses}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={loading}
        {...props}
      />
      
      {loading && (
        <div className="position-absolute top-50 end-0 translate-middle-y me-3">
          <div className="spinner-border spinner-border-sm text-muted" role="status">
            <span className="visually-hidden">Buscando...</span>
          </div>
        </div>
      )}
      
      {value && onClear && !loading && (
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary position-absolute top-50 end-0 translate-middle-y me-3"
          onClick={onClear}
          title="Limpiar búsqueda"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default SearchInput;
