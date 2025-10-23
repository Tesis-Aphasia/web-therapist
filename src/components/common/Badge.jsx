import React from 'react';

/**
 * Badge component for displaying status indicators
 * @param {string} variant - Badge variant (success, warning, danger, info, primary, secondary)
 * @param {string} size - Badge size (sm, md, lg)
 * @param {string} className - Additional CSS classes
 * @param {React.ReactNode} children - Badge content
 */
const Badge = ({ 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  children,
  ...props 
}) => {
  const baseClasses = 'badge';
  const variantClasses = {
    success: 'bg-success',
    warning: 'bg-warning text-dark',
    danger: 'bg-danger',
    info: 'bg-info',
    primary: 'bg-primary',
    secondary: 'bg-secondary',
  };
  const sizeClasses = {
    sm: 'badge-sm',
    md: '',
    lg: 'badge-lg',
  };

  const classes = [
    baseClasses,
    variantClasses[variant] || variantClasses.primary,
    sizeClasses[size] || '',
    className
  ].filter(Boolean).join(' ');

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
};

export default Badge;
