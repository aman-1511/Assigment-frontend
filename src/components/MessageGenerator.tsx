import React, { useState, useCallback } from 'react';
import { generatePersonalizedMessage } from '../api';
import { LinkedInProfile } from '../types';
import './MessageGenerator.css';

// Form field configuration to reduce redundancy
const formFields = [
  { id: 'name', label: 'Name*', type: 'text', required: true },
  { id: 'job_title', label: 'Job Title*', type: 'text', required: true },
  { id: 'company', label: 'Company*', type: 'text', required: true },
  { id: 'location', label: 'Location', type: 'text', required: false },
  { id: 'summary', label: 'Profile Summary', type: 'textarea', required: false, rows: 4 }
];

const MessageGenerator: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string>('');
  const [formData, setFormData] = useState<LinkedInProfile>({
    name: 'John Doe',
    job_title: 'Software Engineer',
    company: 'TechCorp',
    location: 'San Francisco, CA',
    summary: 'Experienced in AI & ML with 5+ years of experience in developing scalable applications.'
  });

  // Handle form input changes
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset previous states
    setLoading(true);
    setError(null);
    
    try {
      // Validate required fields
      const requiredFields = ['name', 'job_title', 'company'] as const;
      for (const field of requiredFields) {
        if (!formData[field]?.trim()) {
          throw new Error('Name, job title, and company are required');
        }
      }
      
      const response = await generatePersonalizedMessage(formData);
      setMessage(response.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate personalized message');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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

  // Render form input field
  const renderField = (field: typeof formFields[0]) => (
    <div className="form-group" key={field.id}>
      <label htmlFor={field.id}>{field.label}</label>
      {field.type === 'textarea' ? (
        <textarea
          id={field.id}
          name={field.id}
          className="form-control"
          value={formData[field.id as keyof LinkedInProfile] as string}
          onChange={handleChange}
          required={field.required}
          rows={field.rows}
        />
      ) : (
        <input
          type={field.type}
          id={field.id}
          name={field.id}
          className="form-control"
          value={formData[field.id as keyof LinkedInProfile] as string}
          onChange={handleChange}
          required={field.required}
        />
      )}
    </div>
  );

  return (
    <div className="message-generator-container">
      <h1>LinkedIn Personalized Message Generator</h1>
      <p className="description">
        Generate personalized outreach messages based on LinkedIn profiles.
      </p>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="row">
        <div className="column">
          <div className="card">
            <h2>LinkedIn Profile Data</h2>
            <form onSubmit={handleSubmit}>
              {formFields.map(renderField)}
              
              <button 
                type="submit" 
                className="btn btn-success"
                disabled={loading}
              >
                {loading ? 'Generating...' : 'Generate Message'}
              </button>
            </form>
          </div>
        </div>
        
        <div className="column">
          <div className="card">
            <h2>Generated Message</h2>
            {!message && !loading && (
              <div className="no-message">
                <p>Fill out the form and click "Generate Message" to create a personalized outreach message.</p>
              </div>
            )}
            
            {loading && (
              <div className="loading">Generating your personalized message...</div>
            )}
            
            {message && !loading && (
              <div className="message-result">
                <div className="message-content">
                  {message}
                </div>
                <button 
                  className="btn"
                  onClick={copyToClipboard}
                >
                  Copy to Clipboard
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageGenerator; 