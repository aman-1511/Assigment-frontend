import React from 'react';
import LoadingIndicator from '../../components/common/LoadingIndicator';

interface MessageDisplayProps {
  message: string;
  loading: boolean;
  onCopy: () => void;
  copySuccess?: boolean;
}

const MessageDisplay: React.FC<MessageDisplayProps> = ({ 
  message, 
  loading,
  onCopy,
  copySuccess = false
}) => {
  // Display message or appropriate placeholder based on state
  if (loading) {
    return <LoadingIndicator message="Generating your personalized message..." />;
  }

  if (!message) {
    return (
      <div className="no-message">
        <p>Fill out the form and click "Generate Message" to create a personalized outreach message.</p>
      </div>
    );
  }

  return (
    <div className="message-result">
      <div className="message-content">
        {message}
      </div>
      <div className="copy-button-container">
        <button 
          className={`btn ${copySuccess ? 'btn-success' : ''}`}
          onClick={onCopy}
        >
          {copySuccess ? 'Copied!' : 'Copy to Clipboard'}
        </button>
        {copySuccess && (
          <span className="copy-success-message">✓ Copied to clipboard</span>
        )}
      </div>
    </div>
  );
};

export default MessageDisplay; 