import React from 'react';
import { LinkedInProfile } from '../../types';

// Form field configuration to reduce redundancy
const formFields = [
  { id: 'name', label: 'Name*', type: 'text', required: true },
  { id: 'job_title', label: 'Job Title*', type: 'text', required: true },
  { id: 'company', label: 'Company*', type: 'text', required: true },
  { id: 'location', label: 'Location', type: 'text', required: false },
  { id: 'summary', label: 'Profile Summary', type: 'textarea', required: false, rows: 4 }
];

interface ProfileFormProps {
  formData: LinkedInProfile;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  formData,
  onChange,
  onSubmit,
  isLoading
}) => {
  // Render form field based on its type
  const renderField = (field: typeof formFields[0]) => (
    <div className="form-group" key={field.id}>
      <label htmlFor={field.id}>{field.label}</label>
      {field.type === 'textarea' ? (
        <textarea
          id={field.id}
          name={field.id}
          className="form-control"
          value={formData[field.id as keyof LinkedInProfile] as string}
          onChange={onChange}
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
          onChange={onChange}
          required={field.required}
        />
      )}
    </div>
  );

  return (
    <form onSubmit={onSubmit}>
      {formFields.map(renderField)}
      
      <button 
        type="submit" 
        className="btn btn-success"
        disabled={isLoading}
      >
        {isLoading ? 'Generating...' : 'Generate Message'}
      </button>
    </form>
  );
};

export default ProfileForm; 