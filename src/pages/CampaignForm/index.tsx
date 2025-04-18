import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createCampaign, getCampaign, updateCampaign } from '../../api';
import { CampaignFormData, CampaignStatus } from '../../types';
import useForm from '../../hooks/useForm';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import ErrorAlert from '../../components/common/ErrorAlert';
import './CampaignForm.css';

const initialFormState: CampaignFormData = {
  name: '',
  description: '',
  status: CampaignStatus.INACTIVE,
  leads: [],
  accountIDs: []
};

const CampaignForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Use the form hook for managing form state
  const { 
    formData, 
    handleChange, 
    handleArrayChange, 
    setFormValues 
  } = useForm<CampaignFormData>(initialFormState);

  const isEditMode = !!id;

  // Fetch campaign data if in edit mode
  useEffect(() => {
    const fetchCampaign = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const campaign = await getCampaign(id);
        setFormValues({
          name: campaign.name,
          description: campaign.description,
          status: campaign.status,
          leads: campaign.leads,
          accountIDs: campaign.accountIDs,
        });
        setError(null);
      } catch (err) {
        setError('Failed to fetch campaign details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (isEditMode) {
      fetchCampaign();
    }
  }, [id, isEditMode, setFormValues]);

  // Handle form submission
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      if (isEditMode && id) {
        await updateCampaign(id, formData);
      } else {
        await createCampaign(formData);
      }
      
      navigate('/');
    } catch (err) {
      setError(`Failed to ${isEditMode ? 'update' : 'create'} campaign`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [formData, id, isEditMode, navigate]);

  if (loading && isEditMode) {
    return <LoadingIndicator message="Loading campaign data..." />;
  }

  return (
    <div className="campaign-form-container">
      <h1>{isEditMode ? 'Edit Campaign' : 'Create New Campaign'}</h1>
      
      <ErrorAlert message={error} />
      
      <form className="campaign-form card" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Campaign Name</label>
          <input
            type="text"
            id="name"
            name="name"
            className="form-control"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            className="form-control"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            className="form-control"
            value={formData.status}
            onChange={handleChange}
          >
            <option value={CampaignStatus.ACTIVE}>Active</option>
            <option value={CampaignStatus.INACTIVE}>Inactive</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="leads">LinkedIn Leads (one URL per line)</label>
          <textarea
            id="leads"
            name="leads"
            className="form-control"
            value={formData.leads.join('\n')}
            onChange={(e) => handleArrayChange(e, 'leads')}
            rows={4}
            placeholder="https://linkedin.com/in/profile-1&#10;https://linkedin.com/in/profile-2"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="accountIDs">Account IDs (one per line)</label>
          <textarea
            id="accountIDs"
            name="accountIDs"
            className="form-control"
            value={formData.accountIDs.join('\n')}
            onChange={(e) => handleArrayChange(e, 'accountIDs')}
            rows={4}
            placeholder="account123&#10;account456"
          />
        </div>
        
        <div className="form-actions">
          <button 
            type="button" 
            className="btn" 
            onClick={() => navigate('/')}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn btn-success"
            disabled={loading}
          >
            {loading ? 'Saving...' : (isEditMode ? 'Update Campaign' : 'Create Campaign')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CampaignForm; 