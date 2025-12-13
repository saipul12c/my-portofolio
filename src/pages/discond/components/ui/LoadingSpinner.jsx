const LoadingSpinner = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-6 w-6 border-2',
    lg: 'h-8 w-8 border-2'
  };

  return (
    <div className="flex items-center justify-center" role="status" aria-live="polite">
      <div className={`animate-spin rounded-full border-t-2 border-cyan-400 border-transparent ${sizeClasses[size]}`} />
      <span className="sr-only">Memuat…</span>
    </div>
  );
};

export default LoadingSpinner;