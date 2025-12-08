import api from './api';

const candidateService = {
  // Create a new candidate manually
  createCandidate: async (candidateData) => {
    try {
      const response = await api.post('/candidates', candidateData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all candidates with pagination
  getAllCandidates: async (page = 0, size = 10, sortBy = 'id', sortDir = 'desc', search = '') => {
    try {
      const params = { page, size, sortBy, sortDir };
      if (search) params.search = search;
      
      const response = await api.get('/candidates', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get candidate by ID
  getCandidateById: async (id) => {
    try {
      const response = await api.get(`/candidates/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update candidate
  updateCandidate: async (id, candidateData) => {
    try {
      const response = await api.put(`/candidates/${id}`, candidateData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete candidate
  deleteCandidate: async (id) => {
    try {
      await api.delete(`/candidates/${id}`);
      return true;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Check if email exists
  checkEmailExists: async (email) => {
    try {
      const response = await api.get('/candidates/check-email', { 
        params: { email } 
      });
      return response.data.exists;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Find candidate by email
  findByEmail: async (email) => {
    try {
      const response = await api.get('/candidates/search/email', { 
        params: { email } 
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get candidate statistics
  getStats: async () => {
    try {
      const response = await api.get('/candidates/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default candidateService;