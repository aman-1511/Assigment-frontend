import React from 'react';

interface ErrorAlertProps {
  message: string | null;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ message }) => {
  if (!message) return null;
  
  return (
    <div className="alert alert-danger">
      {message}
    </div>
  );
};

export default ErrorAlert; 