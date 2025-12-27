import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:9000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Paper APIs
export const paperAPI = {
  // Add new paper
  addPaper: async (paperData) => {
    const response = await api.post('/research/add', paperData);
    return response.data;
  },

  // Get all papers with filters
  getPapers: async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.reading_stage?.length > 0) {
      params.append('reading_stage', filters.reading_stage.join(','));
    }
    if (filters.research_domain?.length > 0) {
      params.append('research_domain', filters.research_domain.join(','));
    }
    if (filters.impact_score?.length > 0) {
      params.append('impact_score', filters.impact_score.join(','));
    }
    if (filters.date_filter) {
      params.append('date_filter', filters.date_filter);
    }

    const response = await api.get(`/research/?${params.toString()}`);
    return response.data;
  },

  // Get single paper
  getPaperById: async (id) => {
    const response = await api.get(`/research/${id}`);
    return response.data;
  },

  // Update paper
  updatePaper: async (id, updateData) => {
    const response = await api.put(`/research/${id}`, updateData);
    return response.data;
  },

  // Delete paper
  deletePaper: async (id) => {
    const response = await api.delete(`/research/${id}`);
    return response.data;
  },
};

// Analytics APIs
export const analyticsAPI = {
  // Get all analytics
  getAnalytics: async () => {
    const response = await api.get('/analytics/');
    return response.data;
  },

  // Get papers by stage
  getPapersByStage: async (stage) => {
    const response = await api.get(`/analytics/stage/${stage}`);
    return response.data;
  },
};

export default api;