import React, { useState, useEffect, useCallback, memo } from 'react';
import { Link } from 'react-router-dom';
import { getCampaigns, deleteCampaign, updateCampaign } from '../api';
import { Campaign, CampaignStatus } from '../types';
import './Dashboard.css';

// Extracted campaign card component for better performance
const CampaignCard = memo(({ 
  campaign, 
  onToggleStatus, 
  onDelete 
}: { 
  campaign: Campaign; 
  onToggleStatus: (campaign: Campaign) => void; 
  onDelete: (id: string) => void; 
}) => {
  return (
    <div className="campaign-card">
      <div className="campaign-info">
        <h2>{campaign.name}</h2>
        <p>{campaign.description}</p>
        <div className="campaign-stats">
          <span>Leads: {campaign.leads.length}</span>
          <span>Accounts: {campaign.accountIDs.length}</span>
          <span className={`status ${campaign.status}`}>
            Status: {campaign.status.toUpperCase()}
          </span>
        </div>
      </div>
      <div className="campaign-actions">
        <button
          className={`btn ${campaign.status === CampaignStatus.ACTIVE ? 'btn-danger' : 'btn-success'}`}
          onClick={() => onToggleStatus(campaign)}
        >
          {campaign.status === CampaignStatus.ACTIVE ? 'Deactivate' : 'Activate'}
        </button>
        <Link to={`/campaign/edit/${campaign._id}`} className="btn">
          Edit
        </Link>
        <button
          className="btn btn-danger"
          onClick={() => onDelete(campaign._id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
});

const Dashboard: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch campaigns on component mount
  useEffect(() => {
    fetchCampaigns();
  }, []);

  // Get all campaigns
  const fetchCampaigns = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getCampaigns();
      setCampaigns(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch campaigns');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle campaign deletion
  const handleDelete = useCallback(async (id: string) => {
    if (window.confirm('Are you sure you want to delete this campaign?')) {
      try {
        await deleteCampaign(id);
        fetchCampaigns(); // Refresh the list
      } catch (err) {
        setError('Failed to delete campaign');
        console.error(err);
      }
    }
  }, [fetchCampaigns]);

  // Toggle campaign status between ACTIVE and INACTIVE
  const toggleStatus = useCallback(async (campaign: Campaign) => {
    try {
      const newStatus = campaign.status === CampaignStatus.ACTIVE 
        ? CampaignStatus.INACTIVE 
        : CampaignStatus.ACTIVE;
      
      await updateCampaign(campaign._id, { status: newStatus });
      fetchCampaigns(); // Refresh the list
    } catch (err) {
      setError('Failed to update campaign status');
      console.error(err);
    }
  }, [fetchCampaigns]);

  if (loading) {
    return <div className="loading">Loading campaigns...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Campaigns</h1>
        <Link to="/campaign/new" className="btn btn-success">
          Create New Campaign
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {campaigns.length === 0 ? (
        <div className="no-campaigns">
          <p>No campaigns found. Create a new campaign to get started.</p>
        </div>
      ) : (
        <div className="campaign-list">
          {campaigns.map((campaign) => (
            <CampaignCard
              key={campaign._id}
              campaign={campaign}
              onToggleStatus={toggleStatus}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard; 