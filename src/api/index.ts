import axios from 'axios';
import { Campaign, CampaignFormData, LinkedInProfile } from '../types';

const API_URL = 'http://54.173.44.61:5001';



export const getCampaigns = async (): Promise<Campaign[]> => {
  const response = await axios.get(`${API_URL}/campaigns`);
  return response.data;
};

export const getCampaign = async (id: string): Promise<Campaign> => {
  const response = await axios.get(`${API_URL}/campaigns/${id}`);
  return response.data;
};

export const createCampaign = async (campaign: CampaignFormData): Promise<Campaign> => {
  const response = await axios.post(`${API_URL}/campaigns`, campaign);
  return response.data;
};

export const updateCampaign = async (id: string, campaign: Partial<CampaignFormData>): Promise<Campaign> => {
  const response = await axios.put(`${API_URL}/campaigns/${id}`, campaign);
  return response.data;
};

export const deleteCampaign = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/campaigns/${id}`);
};



export const generatePersonalizedMessage = async (profile: LinkedInProfile): Promise<{ message: string }> => {
  const response = await axios.post(`${API_URL}/personalized-message`, profile);
  return response.data;
}; 