import axios from 'axios';

// Read API URL from environment variables or use default
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

/**
 * Save a flow to the backend
 * @param {Object} flow - The flow to save
 * @returns {Promise} - The axios response
 */
export const saveFlow = (flow) => {
  return axios.post(`${API_URL}/flows`, flow);
};

/**
 * Load a flow from the backend
 * @param {string} id - Optional flow ID (defaults to the latest flow)
 * @returns {Promise} - The axios response
 */
export const loadFlow = (id = 'latest') => {
  return axios.get(`${API_URL}/flows/${id}`);
};

/**
 * Get a list of all available flows
 * @returns {Promise} - The axios response
 */
export const listFlows = () => {
  return axios.get(`${API_URL}/flows`);
};

/**
 * Delete a flow
 * @param {string} id - The flow ID to delete
 * @returns {Promise} - The axios response
 */
export const deleteFlow = (id) => {
  return axios.delete(`${API_URL}/flows/${id}`);
};