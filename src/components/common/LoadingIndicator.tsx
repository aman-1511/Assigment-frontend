import React from 'react';

interface LoadingIndicatorProps {
  message?: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ 
  message = 'Loading...' 
}) => {
  return (
    <div className="loading">
      {message}
    </div>
  );
};

export default LoadingIndicator; 