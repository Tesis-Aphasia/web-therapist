import React from 'react';

/**
 * Filter group component for dropdowns and inputs
 * @param {string} label - Filter label
 * @param {string} type - Filter type (select, input)
 * @param {string} value - Current value
 * @param {Function} onChange - Change handler
 * @param {Array} options - Options for select type
 * @param {string} placeholder - Placeholder for input type
 * @param {string} className - Additional CSS classes
 * @param {Object} props - Additional props
 */
const FilterGroup = ({ 
  label, 
  type = 'select',
  value, 
  onChange, 
  options = [],
  placeholder = '',
  className = '',
  ...props 
}) => {
  const containerClasses = [
    'filter-group',
    className
  ].filter(Boolean).join(' ');

  const renderInput = () => (
    <input
      type="text"
      className="form-control"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      {...props}
    />
  );

  const renderSelect = () => (
    <select
      className="form-select"
      value={value}
      onChange={onChange}
      {...props}
    >
      {options.map((option, index) => (
        <option key={index} value={option.value || option}>
          {option.label || option}
        </option>
      ))}
    </select>
  );

  return (
    <div className={containerClasses}>
      <label className="form-label fw-semibold small">
        {label}
      </label>
      {type === 'select' ? renderSelect() : renderInput()}
    </div>
  );
};

export default FilterGroup;
