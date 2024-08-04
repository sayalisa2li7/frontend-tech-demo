// pages/top-gainers-losers.js
import { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { fetchTopGainersLosers } from '../lib/api';
import Navbar from '../components/Navbar';
import '../styles/global.css';
import useAuth from '../components/useAuth';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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

        const sortedGainers = periodEntries.gainers.sort((a, b) => b.price_change_percentage - a.price_change_percentage);
        const sortedLosers = periodEntries.losers.sort((a, b) => a.price_change_percentage - b.price_change_percentage);

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
            return selectedData === 'gainers' ? gainers : losers.sort((a, b) => a.price_change_percentage - b.price_change_percentage);
        }
        if (selectedPeriod === 'weekly') {
            return selectedData === 'gainers' ? weekly.gainers : weekly.losers.sort((a, b) => a.price_change_percentage - b.price_change_percentage);
        }
        if (selectedPeriod === 'monthly') {
            return selectedData === 'gainers' ? monthly.gainers : monthly.losers.sort((a, b) => a.price_change_percentage - b.price_change_percentage);
        }
        return [];
    };

    const data = getPeriodData();

    const chartData = {
        labels: data.map(entry => entry.ticker),
        datasets: [{
            label: `Top ${selectedData.charAt(0).toUpperCase() + selectedData.slice(1)} (${selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)})`,
            data: data.map(entry => entry.price_change_percentage),
            backgroundColor: selectedData === 'gainers' ? 'rgba(75, 192, 192, 0.2)' : 'rgba(255, 99, 132, 0.2)',
            borderColor: selectedData === 'gainers' ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 132, 1)',
            borderWidth: 1
        }]
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: function(tooltipItem) {
                        return `${tooltipItem.label}: ${tooltipItem.raw}%`;
                    }
                }
            }
        },
        scales: {
            x: {
                beginAtZero: true
            },
            y: {
                beginAtZero: true
            }
        }
    };

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

            <Bar data={chartData} options={chartOptions} />

            <h2>Table View</h2>
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
                            <td>{entry.price_change_percentage}%</td>
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
