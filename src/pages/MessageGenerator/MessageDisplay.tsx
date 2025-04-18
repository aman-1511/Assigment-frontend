import React from 'react';
import LoadingIndicator from '../../components/common/LoadingIndicator';

interface MessageDisplayProps {
  message: string;
  loading: boolean;
  onCopy: () => void;
}

const MessageDisplay: React.FC<MessageDisplayProps> = ({ 
  message, 
  loading,
  onCopy
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
      <button 
        className="btn"
        onClick={onCopy}
      >
        Copy to Clipboard
      </button>
    </div>
  );
};

export default MessageDisplay; 