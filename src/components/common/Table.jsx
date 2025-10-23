import React from 'react';

/**
 * Generic table component
 * @param {Array} columns - Table column definitions
 * @param {Array} data - Table data
 * @param {Function} renderCell - Custom cell renderer
 * @param {boolean} striped - Whether to show striped rows
 * @param {boolean} hover - Whether to show hover effect
 * @param {string} className - Additional CSS classes
 * @param {Object} props - Additional props
 */
const Table = ({ 
  columns = [], 
  data = [], 
  renderCell,
  striped = true,
  hover = true,
  className = '',
  ...props 
}) => {
  const tableClasses = [
    'table',
    'align-middle',
    'mb-0',
    striped && 'table-striped',
    hover && 'table-hover',
    className
  ].filter(Boolean).join(' ');

  const defaultRenderCell = (item, column, index) => {
    if (column.render) {
      return column.render(item, index);
    }
    
    if (column.key) {
      return item[column.key] || '—';
    }
    
    return '—';
  };

  const cellRenderer = renderCell || defaultRenderCell;

  return (
    <div className="table-responsive">
      <table className={tableClasses} {...props}>
        <thead className="table-dark">
          <tr>
            {columns.map((column, index) => (
              <th 
                key={index}
                className={column.className || ''}
                style={column.style}
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td 
                colSpan={columns.length} 
                className="text-center py-4 text-muted"
              >
                No hay datos disponibles.
              </td>
            </tr>
          ) : (
            data.map((item, rowIndex) => (
              <tr key={item.id || rowIndex}>
                {columns.map((column, colIndex) => (
                  <td 
                    key={colIndex}
                    className={column.cellClassName || ''}
                    style={column.cellStyle}
                  >
                    {cellRenderer(item, column, rowIndex)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
