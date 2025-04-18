import { useState, useCallback } from 'react';

type FormChangeEvent = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;

function useForm<T>(initialValues: T) {
  const [formData, setFormData] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Handle standard form input changes
  const handleChange = useCallback((e: FormChangeEvent) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }, [errors]);
  
  // Handle array inputs (e.g., for fields that need to be split by new lines)
  const handleArrayChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>, fieldName: keyof T) => {
    const values = e.target.value.split('\n').filter(item => item.trim() !== '');
    setFormData(prev => ({
      ...prev,
      [fieldName]: values
    }));
  }, []);
  
  // Reset form to initial values
  const resetForm = useCallback(() => {
    setFormData(initialValues);
    setErrors({});
  }, [initialValues]);
  
  // Set form data directly
  const setFormValues = useCallback((values: Partial<T>) => {
    setFormData(prev => ({ ...prev, ...values }));
  }, []);
  
  // Set error for a specific field
  const setError = useCallback((fieldName: string, message: string) => {
    setErrors(prev => ({
      ...prev,
      [fieldName]: message
    }));
  }, []);
  
  // Clear all errors
  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);
  
  return {
    formData,
    errors,
    handleChange,
    handleArrayChange,
    resetForm,
    setFormValues,
    setError,
    clearErrors
  };
}

export default useForm; 