import React, { useState, useCallback } from 'react';
import { LinkedInProfile } from '../../types';
import useForm from '../../hooks/useForm';
import useApi from '../../hooks/useApi';
import { generatePersonalizedMessage } from '../../api';
import ErrorAlert from '../../components/common/ErrorAlert';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import ProfileForm from './ProfileForm';
import MessageDisplay from './MessageDisplay';
import './MessageGenerator.css';

// Initial values for the form
const initialFormState: LinkedInProfile = {
  name: 'John Doe',
  job_title: 'Software Engineer',
  company: 'TechCorp',
  location: 'San Francisco, CA',
  summary: 'Experienced in AI & ML with 5+ years of experience in developing scalable applications.'
};

const MessageGenerator: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const { formData, handleChange } = useForm<LinkedInProfile>(initialFormState);
  const messageApi = useApi<{ message: string }, LinkedInProfile>(generatePersonalizedMessage);
  
  // Handle form submission
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const requiredFields = ['name', 'job_title', 'company'] as const;
    for (const field of requiredFields) {
      if (!formData[field]?.trim()) {
        return; // Form validation will handle showing errors
      }
    }
    
    const result = await messageApi.execute(formData);
    if (result.data) {
      setMessage(result.data.message);
    }
  }, [formData, messageApi]);

  // Copy message to clipboard
  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(message)
      .then(() => {
        alert('Message copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy message: ', err);
      });
  }, [message]);

  return (
    <div className="message-generator-container">
      <h1>LinkedIn Personalized Message Generator</h1>
      <p className="description">
        Generate personalized outreach messages based on LinkedIn profiles.
      </p>
      
      <ErrorAlert message={messageApi.error} />
      
      <div className="row">
        <div className="column">
          <div className="card">
            <h2>LinkedIn Profile Data</h2>
            <ProfileForm 
              formData={formData}
              onChange={handleChange}
              onSubmit={handleSubmit}
              isLoading={messageApi.loading}
            />
          </div>
        </div>
        
        <div className="column">
          <div className="card">
            <h2>Generated Message</h2>
            <MessageDisplay 
              message={message} 
              loading={messageApi.loading}
              onCopy={copyToClipboard}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageGenerator; 