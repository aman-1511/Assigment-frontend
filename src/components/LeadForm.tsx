import React, { useState, useCallback, useMemo } from 'react';
import { Lead } from '../types';
import './LeadForm.css';

interface LeadFormProps {
  initialValues?: Lead;
  onSubmit: (lead: Lead) => void;
  buttonText?: string;
}

// Form field configuration for DRY code
const formFields = [
  { id: 'name', label: 'Name', type: 'text', required: true },
  { id: 'email', label: 'Email', type: 'email', required: true },
  { id: 'phone', label: 'Phone', type: 'tel', required: false },
  { id: 'company', label: 'Company', type: 'text', required: false },
  { id: 'jobTitle', label: 'Job Title', type: 'text', required: false },
  { id: 'notes', label: 'Notes', type: 'textarea', required: false }
];

const LeadForm: React.FC<LeadFormProps> = ({
  initialValues = {
    name: '',
    email: '',
    phone: '',
    company: '',
    jobTitle: '',
    notes: ''
  },
  onSubmit,
  buttonText = 'Submit'
}) => {
  const [formData, setFormData] = useState<Lead>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input changes
  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }, [errors]);

  // Validate form data
  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};
    
    // Validate required fields
    formFields.forEach(field => {
      if (field.required && !formData[field.id as keyof Lead]) {
        newErrors[field.id] = `${field.label} is required`;
      }
    });
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Handle form submission
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      await onSubmit(formData);
      // Form submission was successful
    } catch (error) {
      console.error('Error submitting lead:', error);
      setErrors({ submit: 'Failed to submit lead. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, onSubmit, validateForm]);

  // Render form fields dynamically
  const renderField = useCallback((field: typeof formFields[0]) => {
    const { id, label, type, required } = field;
    
    return (
      <div key={id} className="form-group">
        <label htmlFor={id}>
          {label}{required && <span className="required">*</span>}
        </label>
        
        {type === 'textarea' ? (
          <textarea
            id={id}
            name={id}
            value={formData[id as keyof Lead] as string}
            onChange={handleChange}
            className={errors[id] ? 'error' : ''}
            disabled={isSubmitting}
          />
        ) : (
          <input
            id={id}
            name={id}
            type={type}
            value={formData[id as keyof Lead] as string}
            onChange={handleChange}
            className={errors[id] ? 'error' : ''}
            disabled={isSubmitting}
          />
        )}
        
        {errors[id] && <div className="error-message">{errors[id]}</div>}
      </div>
    );
  }, [formData, errors, handleChange, isSubmitting]);

  // Memoize form fields to prevent unnecessary re-renders
  const formFieldElements = useMemo(() => {
    return formFields.map(field => renderField(field));
  }, [renderField]);

  return (
    <form className="lead-form" onSubmit={handleSubmit}>
      {formFieldElements}
      
      {errors.submit && (
        <div className="error-message submit-error">{errors.submit}</div>
      )}
      
      <button 
        type="submit" 
        className="btn btn-primary"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Submitting...' : buttonText}
      </button>
    </form>
  );
};

export default LeadForm; 