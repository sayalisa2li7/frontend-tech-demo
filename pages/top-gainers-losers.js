import { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, subWeeks, subMonths } from 'date-fns';
import { fetchTopGainersLosers } from '../lib/api';
import Navbar from '../components/Navbar';
import '../styles/global.css';
import useAuth from '../components/useAuth';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const getTopGainersAndLosers = (data, period, currentDate) => {
    const results = { gainers: [], losers: [] };

    // Define period boundaries
    const startOfPeriod = {
        weekly: startOfWeek(subWeeks(currentDate, 1), { weekStartsOn: 0 }),
        monthly: startOfMonth(subMonths(currentDate, 1)),
        yearly: startOfYear(currentDate)
    };
    const endOfPeriod = {
        weekly: endOfWeek(subWeeks(currentDate, 1), { weekStartsOn: 0 }),
        monthly: endOfMonth(subMonths(currentDate, 1)),
        yearly: endOfYear(currentDate)
    };

    const periodData = data.filter(entry => {
        const date = new Date(entry.date);

        if (period === 'weekly') {
            return date >= startOfPeriod.weekly && date <= endOfPeriod.weekly;
        } else if (period === 'monthly') {
            return date >= startOfPeriod.monthly && date <= endOfPeriod.monthly;
        } else if (period === 'yearly') {
            return date >= startOfPeriod.yearly && date <= endOfPeriod.yearly;
        }

        return false;
    });

    const sortedGainers = periodData.sort((a, b) => b.price_change_percentage - a.price_change_percentage).slice(0, 10);
    const sortedLosers = periodData.sort((a, b) => a.price_change_percentage - b.price_change_percentage).slice(0, 10);

    results.gainers = sortedGainers;
    results.losers = sortedLosers;

    return results;
};

const TopGainersLosers = ({ gainers, losers, weekly, monthly, yearly }) => {
    useAuth();
    const [selectedPeriod, setSelectedPeriod] = useState('daily');
    const [selectedData, setSelectedData] = useState('gainers');

    const handlePeriodChange = (e) => setSelectedPeriod(e.target.value);
    const handleDataChange = (e) => setSelectedData(e.target.value);

    const getPeriodData = () => {
        const today = new Date();
        if (selectedPeriod === 'daily') {
            return selectedData === 'gainers' ? gainers : losers;
        }
        if (selectedPeriod === 'weekly') {
            return selectedData === 'gainers' ? weekly.gainers : weekly.losers;
        }
        if (selectedPeriod === 'monthly') {
            return selectedData === 'gainers' ? monthly.gainers : monthly.losers;
        }
        if (selectedPeriod === 'yearly') {
            return selectedData === 'gainers' ? yearly.gainers : yearly.losers;
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
                    <option value="yearly">Yearly</option>
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
    const today = new Date();
    const dailyGainers = await fetchTopGainersLosers(true);
    const dailyLosers = await fetchTopGainersLosers(false);

    // Process data to get weekly, monthly, and yearly top gainers and losers
    const weekly = getTopGainersAndLosers(dailyGainers.concat(dailyLosers), 'weekly', today);
    const monthly = getTopGainersAndLosers(dailyGainers.concat(dailyLosers), 'monthly', today);
    const yearly = getTopGainersAndLosers(dailyGainers.concat(dailyLosers), 'yearly', today);

    return { 
        props: { 
            gainers: dailyGainers,
            losers: dailyLosers,
            weekly,
            monthly,
            yearly
        } 
    };
}

export default TopGainersLosers;
