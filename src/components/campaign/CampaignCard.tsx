import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { Campaign, CampaignStatus } from '../../types';

interface CampaignCardProps {
  campaign: Campaign;
  onToggleStatus: (campaign: Campaign) => void;
  onDelete: (id: string) => void;
}

// Memoized component for better performance
const CampaignCard = memo(({ campaign, onToggleStatus, onDelete }: CampaignCardProps) => {
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

export default CampaignCard; 