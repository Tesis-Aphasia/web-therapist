import React from 'react';

/**
 * Error Boundary component for catching JavaScript errors
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // You can also log the error to an error reporting service here
    // Example: logErrorToService(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      // Custom error UI
      return (
        <div className="error-boundary">
          <div className="error-container">
            <div className="error-icon">
              <i className="bi bi-exclamation-triangle-fill text-danger" style={{ fontSize: '3rem' }}></i>
            </div>
            <h2 className="error-title">¡Oops! Algo salió mal</h2>
            <p className="error-message">
              Ha ocurrido un error inesperado. Por favor, intenta recargar la página.
            </p>
            <div className="error-actions">
              <button 
                className="btn btn-primary me-2" 
                onClick={this.handleRetry}
              >
                Intentar de nuevo
              </button>
              <button 
                className="btn btn-outline-secondary" 
                onClick={() => window.location.reload()}
              >
                Recargar página
              </button>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="error-details mt-4">
                <summary className="error-summary">
                  Detalles del error (solo en desarrollo)
                </summary>
                <pre className="error-stack">
                  {this.state.error.toString()}
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
