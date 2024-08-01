// pages/top-gainers-losers.js
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { useState } from 'react';
import { fetchTopGainersLosers } from '../lib/api';
import Navbar from '../components/Navbar';
import '../styles/global.css';
import useAuth from '../components/useAuth';

const getTopGainersAndLosers = (data, period) => {
    const groupedData = {};

    data.forEach((entry) => {
        const date = new Date(entry.date);
        let periodKey;

        if (period === 'weekly') {
            const startOfWeekDate = startOfWeek(date);
            const endOfWeekDate = endOfWeek(date);
            periodKey = `${format(startOfWeekDate, 'yyyy-MM-dd')}_${format(endOfWeekDate, 'yyyy-MM-dd')}`;
        } else if (period === 'monthly') {
            const startOfMonthDate = startOfMonth(date);
            const endOfMonthDate = endOfMonth(date);
            periodKey = `${format(startOfMonthDate, 'yyyy-MM-dd')}_${format(endOfMonthDate, 'yyyy-MM-dd')}`;
        } else {
            // Default to daily if period is not recognized
            periodKey = format(date, 'yyyy-MM-dd');
        }

        if (!groupedData[periodKey]) {
            groupedData[periodKey] = { gainers: [], losers: [] };
        }

        groupedData[periodKey].gainers.push(entry);
        groupedData[periodKey].losers.push(entry);
    });

    const results = { gainers: [], losers: [] };

    Object.keys(groupedData).forEach((key) => {
        const periodEntries = groupedData[key];

        // Sort gainers and losers separately and pick the top entry
        const sortedGainers = periodEntries.gainers.sort((a, b) => b.price_change_percentage - a.price_change_percentage);
        const sortedLosers = periodEntries.losers.sort((a, b) => a.price_change_percentage - b.price_change_percentage);

        // Pick top entry if available
        if (sortedGainers.length > 0) {
            results.gainers.push(sortedGainers[0]);
        }
        if (sortedLosers.length > 0) {
            results.losers.push(sortedLosers[0]);
        }
    });

    return results;
};

const TopGainersLosers = ({ gainers, losers, weekly, monthly }) => {
    useAuth();
    const [selectedPeriod, setSelectedPeriod] = useState('daily');
    const [selectedData, setSelectedData] = useState('gainers');

    const handlePeriodChange = (e) => setSelectedPeriod(e.target.value);
    const handleDataChange = (e) => setSelectedData(e.target.value);

    const getPeriodData = () => {
        if (selectedPeriod === 'daily') {
            return selectedData === 'gainers' ? gainers : losers.sort((a, b) => a.price_change_percentage - b.price_change_percentage); // Ensure correct sorting for losers
        }
        if (selectedPeriod === 'weekly') {
            return selectedData === 'gainers' ? weekly.gainers : weekly.losers;
        }
        if (selectedPeriod === 'monthly') {
            return selectedData === 'gainers' ? monthly.gainers : monthly.losers;
        }
        return [];
    };

    const data = getPeriodData();

    return (
        <div>
            <Navbar />
            <h1>Top Gainers and Losers</h1>
            
            <div className="dropdowns">
                <label htmlFor="period">Period:</label>
                <select id="period" value={selectedPeriod} onChange={handlePeriodChange}>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                </select>
                
                <label htmlFor="data">Data:</label>
                <select id="data" value={selectedData} onChange={handleDataChange}>
                    <option value="gainers">Gainers</option>
                    <option value="losers">Losers</option>
                </select>
            </div>

            <h2>Top {selectedData.charAt(0).toUpperCase() + selectedData.slice(1)} ({selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)})</h2>
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Ticker</th>
                        <th>Price Change Percentage</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((entry) => (
                        <tr key={`${entry.date}-${entry.ticker}`}>
                            <td>{entry.date}</td>
                            <td>{entry.ticker}</td>
                            <td>{entry.price_change_percentage}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export async function getServerSideProps() {
    const dailyGainers = await fetchTopGainersLosers(true);
    const dailyLosers = await fetchTopGainersLosers(false);

    // Process data to get weekly and monthly top gainers and losers
    const weekly = getTopGainersAndLosers(dailyGainers.concat(dailyLosers), 'weekly');
    const monthly = getTopGainersAndLosers(dailyGainers.concat(dailyLosers), 'monthly');

    return { 
        props: { 
            gainers: dailyGainers,
            losers: dailyLosers,
            weekly,
            monthly 
        } 
    };
}

export default TopGainersLosers;
