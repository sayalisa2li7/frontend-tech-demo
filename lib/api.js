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

// export const loginUser = async (userData) => {
//   try {
//       const response = await axios.post(`${API_BASE_URL}/login/`, userData);
//       return response.data;
//   } catch (error) {
//       console.error('Error logging in user:', error);
//       throw error;
//   }
// };
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

// export const logoutUser = async () => {
//   try {
//       const response = await axios.post(`${API_BASE_URL}/logout/`);
//       return response.data;
//   } catch (error) {
//       console.error('Error logging out user:', error);
//       throw error;
//   }
// };
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


export const fetchDailyReport = async () => {
    try {
      console.log('Fetching daily report...');
      const response = await axios.get(`${apiUrl}/daily-report/`);
      console.log('Response data:', response.data); // Log response data
      return response.data.report;
    } catch (error) {
      console.error('Error fetching daily report:', error.message); // Log error message
      console.error('Error details:', error.response); // Log error response details
      throw error;
    }
  };

  export const fetchWeeklyReport = async () => {
    try {
      const response = await axios.get(`${apiUrl}/weekly-report/`);
      return response.data.report;
    } catch (error) {
      console.error('Error fetching weekly report:', error);
      throw error;
    }
  };

  export const fetchMonthlyReport = async () => {
    try {
        const response = await axios.get(`${apiUrl}/monthly-report/`);
        return response.data.report;
    } catch (error) {
        console.error('Error fetching monthly report:', error);
        throw error;
    }
};


export const fetchDailyClosingPrices = async () => {
    const response = await axios.get(`${apiUrl}/daily-closing-price/`);
    return response.data;
};

// export const fetchPriceChangePercentage = async () => {
//     const response = await axios.get(`${API_BASE_URL}/price-change-percentage/`);
//     return response.data;
// };
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
// export const fetchTopGainersLosers = async (isGainer, period) => {
//   const res = await fetch(`${API_BASE_URL}/top-gainers-losers?is_gainer=${isGainer}`);
//   const data = await res.json();
//   return data;
// };

// export async function registerUser(username, password) {
//   const response = await fetch(`${API_BASE_URL}/register/`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({ username, password }),
//   });

//   if (!response.ok) {
//     throw new Error('Registration failed');
//   }

//   return response.json();
// };