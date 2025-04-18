import React, { useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getCampaigns, deleteCampaign, updateCampaign } from '../../api';
import { Campaign, CampaignStatus } from '../../types';
import CampaignCard from '../../components/campaign/CampaignCard';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import ErrorAlert from '../../components/common/ErrorAlert';
import useApi from '../../hooks/useApi';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  // Use the custom API hook for campaigns
  const campaignsApi = useApi<Campaign[]>(() => getCampaigns());
  
  // Fetch campaigns on component mount - only once
  useEffect(() => {
    campaignsApi.execute();
    // Execute dependency removed to prevent infinite loop
  }, []);
  
  // Handle campaign deletion
  const handleDelete = useCallback(async (id: string) => {
    if (window.confirm('Are you sure you want to delete this campaign?')) {
      try {
        await deleteCampaign(id);
        campaignsApi.execute(); // Refresh the list
      } catch (err) {
        console.error('Failed to delete campaign:', err);
      }
    }
  }, [campaignsApi]);

  // Toggle campaign status between ACTIVE and INACTIVE
  const toggleStatus = useCallback(async (campaign: Campaign) => {
    try {
      const newStatus = campaign.status === CampaignStatus.ACTIVE 
        ? CampaignStatus.INACTIVE 
        : CampaignStatus.ACTIVE;
      
      await updateCampaign(campaign._id, { status: newStatus });
      campaignsApi.execute(); // Refresh the list
    } catch (err) {
      console.error('Failed to update campaign status:', err);
    }
  }, [campaignsApi]);

  // Add error retry logic with backoff
  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 3;
    
    // If there's an error, try to fetch again with exponential backoff
    if (campaignsApi.error && campaignsApi.error.includes('ERR_INSUFFICIENT_RESOURCES')) {
      const retryDelay = Math.pow(2, retryCount) * 1000; // Exponential backoff
      
      if (retryCount < maxRetries) {
        const timer = setTimeout(() => {
          console.log(`Retrying API call (attempt ${retryCount + 1})`);
          campaignsApi.execute();
          retryCount++;
        }, retryDelay);
        
        return () => clearTimeout(timer);
      }
    }
  }, [campaignsApi.error]);

  if (campaignsApi.loading) {
    return <LoadingIndicator message="Loading campaigns..." />;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Campaigns</h1>
        <Link to="/campaign/new" className="btn btn-success">
          Create New Campaign
        </Link>
      </div>

      <ErrorAlert message={campaignsApi.error} />

      {!campaignsApi.data || campaignsApi.data.length === 0 ? (
        <div className="no-campaigns">
          <p>No campaigns found. Create a new campaign to get started.</p>
        </div>
      ) : (
        <div className="campaign-list">
          {campaignsApi.data.map((campaign) => (
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