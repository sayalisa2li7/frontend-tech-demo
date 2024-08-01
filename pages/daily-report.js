// pages/daily-report.js
import { useEffect, useState } from 'react';
import { fetchDailyReport } from '../lib/api';
import Navbar from '../components/Navbar';
import useAuth from '../components/useAuth';

export default function DailyReportPage () {
  useAuth();
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getReport = async () => {
      try {
        const data = await fetchDailyReport();
        setReport(data);
      } catch (err) {
        console.error('Error fetching daily report:', err.message); // Log error message
        console.error('Error details:', err.response); // Log error response details
        setError('Failed to fetch the daily report.');
      }
    };

    getReport();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!report) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Navbar />
      <h1>Daily Report for {report.date}</h1>
      <h2>Highest Closing Price</h2>
      <p>Ticker: {report.highest.ticker}</p>
      <p>Close Price: {report.highest.close}</p>
      <p>Open Price: {report.highest.open}</p>
      <p>High Price: {report.highest.high}</p>
      <p>Low Price: {report.highest.low}</p>
      <p>Volume: {report.highest.volume}</p>
      <p>Price Change Percentage: {report.highest.price_change_percentage}%</p>
      <h2>Lowest Closing Price</h2>
      <p>Ticker: {report.lowest.ticker}</p>
      <p>Close Price: {report.lowest.close}</p>
      <p>Open Price: {report.lowest.open}</p>
      <p>High Price: {report.lowest.high}</p>
      <p>Low Price: {report.lowest.low}</p>
      <p>Volume: {report.lowest.volume}</p>
      <p>Price Change Percentage: {report.lowest.price_change_percentage}%</p>
    </div>
  );
}
