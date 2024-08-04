// lib/api.js
import axios from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export const registerUser = async (userData) => {
  try {
      const response = await axios.post(`${apiUrl}/register/`, userData);
      return response.data;
  } catch (error) {
      console.error('Error registering user:', error);
      throw error;
  }
};

export const loginUser = async (userData) => {
  try {
      const response = await axios.post(`${apiUrl}/login/`, userData);
      // Store user data and token in local storage or session storage
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
  } catch (error) {
      console.error('Error logging in user:', error);
      throw error;
  }
};

export const logoutUser = async () => {
  try {
      const response = await axios.post(`${apiUrl}/logout/`);
      // Clear user data from local storage
      localStorage.removeItem('user');
      return response.data;
  } catch (error) {
      console.error('Error logging out user:', error);
      throw error;
  }
};

export const fetchDailyClosingPrices = async () => {
    const response = await axios.get(`${apiUrl}/daily-closing-price/`);
    return response.data;
};

export const fetchPriceChangePercentage = async (period) => {
  const validPeriod = period || 'daily';
  const url = `${apiUrl}/price-change-percentage/?period=${validPeriod}`;
  
  try {
      const response = await fetch(url);
      if (!response.ok) {
          throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      return data;
  } catch (error) {
      console.error('Error fetching price change percentage:', error);
      return []; // Return empty array on error
  }
};

export const fetchTopGainersLosers = async (isGainer) => {
    try {
        const response = await axios.get(`${apiUrl}/top-gainers-losers/`, {
            params: { is_gainer: isGainer ? 'true' : 'false' }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching top gainers and losers:', error);
        return [];
    }
};
