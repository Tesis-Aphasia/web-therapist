import React from 'react';

/**
 * Pagination component
 * @param {Object} pagination - Pagination object from usePagination hook
 * @param {Function} onPageChange - Function to call when page changes
 * @param {boolean} showInfo - Whether to show page info
 * @param {string} className - Additional CSS classes
 */
const Pagination = ({ 
  pagination, 
  onPageChange, 
  showInfo = true,
  className = '',
  ...props 
}) => {
  const {
    currentPage,
    totalPages,
    hasNextPage,
    hasPrevPage,
    totalItems,
    pageSize,
  } = pagination;

  if (totalPages <= 1) return null;

  const handlePageChange = (page) => {
    if (onPageChange) {
      onPageChange(page);
    }
  };

  const paginationClasses = [
    'd-flex',
    'justify-content-between',
    'align-items-center',
    'mt-3',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={paginationClasses} {...props}>
      {showInfo && (
        <span className="text-muted">
          Página {currentPage} de {totalPages}
          {totalItems > 0 && (
            <span className="ms-2">
              ({totalItems} elementos)
            </span>
          )}
        </span>
      )}
      
      <div className="btn-group">
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={!hasPrevPage}
          title="Página anterior"
        >
          ◀
        </button>
        
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={!hasNextPage}
          title="Página siguiente"
        >
          ▶
        </button>
      </div>
    </div>
  );
};

export default Pagination;
