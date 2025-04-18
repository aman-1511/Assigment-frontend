import React, { useState, useCallback, useRef } from 'react';
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
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const { formData, handleChange } = useForm<LinkedInProfile>(initialFormState);
  const messageApi = useApi<{ message: string }, LinkedInProfile>(generatePersonalizedMessage);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  
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

  // Copy message to clipboard with fallback methods
  const copyToClipboard = useCallback(() => {
    setCopySuccess(false);
    
    // Modern clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(message)
        .then(() => {
          setCopySuccess(true);
          setTimeout(() => setCopySuccess(false), 2000);
        })
        .catch(err => {
          console.error('Failed to copy using Clipboard API: ', err);
          fallbackCopyToClipboard();
        });
    } else {
      fallbackCopyToClipboard();
    }
  }, [message]);
  
  // Fallback method using document.execCommand
  const fallbackCopyToClipboard = () => {
    try {
      // Create a temporary textarea element to hold the text
      const textarea = document.createElement('textarea');
      textarea.value = message;
      
      // Make the textarea out of viewport
      textarea.style.position = 'fixed';
      textarea.style.left = '-999999px';
      textarea.style.top = '-999999px';
      document.body.appendChild(textarea);
      
      // Select and copy
      textarea.focus();
      textarea.select();
      const success = document.execCommand('copy');
      
      // Clean up
      document.body.removeChild(textarea);
      
      if (success) {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } else {
        console.error('Failed to copy using execCommand');
        alert('Copy failed. Please try selecting the text and copying manually (Ctrl+C/Cmd+C).');
      }
    } catch (err) {
      console.error('Fallback copy method failed: ', err);
      alert('Copy failed. Please try selecting the text and copying manually (Ctrl+C/Cmd+C).');
    }
  };

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
              copySuccess={copySuccess}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageGenerator; 