// pages/daily-closing-prices.js
import React, { useState, useMemo } from 'react';
import Navbar from '../components/Navbar';
import { fetchDailyClosingPrices } from '../lib/api';
import '../styles/global.css';
import useAuth from '../components/useAuth';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

export default function DailyClosingPrices({ data }) {
    useAuth();
    const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'asc' });
    const [selectedTicker, setSelectedTicker] = useState(''); // State for selected ticker

    // Extract unique tickers from data
    const tickers = useMemo(() => {
        const tickerSet = new Set(data.map(entry => entry.ticker));
        return Array.from(tickerSet);
    }, [data]);

    // Filter data based on selected ticker
    const filteredData = useMemo(() => {
        if (selectedTicker) {
            return data.filter(entry => entry.ticker === selectedTicker);
        }
        return data;
    }, [data, selectedTicker]);

    // Get all dates
    const allDates = useMemo(() => {
        const dateSet = new Set(data.map(entry => entry.date));
        return Array.from(dateSet).sort();
    }, [data]);

    const sortedData = useMemo(() => {
        let sortableData = [...filteredData];
        if (sortConfig !== null) {
            sortableData.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableData;
    }, [filteredData, sortConfig]);

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Prepare data for chart
    const chartData = {
        labels: allDates.map(date => new Intl.DateTimeFormat('en-US').format(new Date(date))),
        datasets: tickers.map(ticker => ({
            label: ticker,
            data: allDates.map(date => {
                const entry = sortedData.find(d => d.ticker === ticker && d.date === date);
                return entry ? entry.close : null; // Handle missing data points
            }),
            borderColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderWidth: 1,
            fill: true
        }))
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: function (tooltipItem) {
                        return `${tooltipItem.label}: ${tooltipItem.raw !== null ? tooltipItem.raw.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : 'N/A'}`;
                    }
                }
            }
        },
        scales: {
            x: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Date'
                }
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Close Price (USD)'
                }
            }
        }
    };

    return (
        <div>
            <Navbar />
            <h1>Daily Closing Prices</h1>
            
            {/* Ticker Dropdown */}
            <div className="dropdown">
                <label htmlFor="ticker">Select Ticker:</label>
                <select id="ticker" value={selectedTicker} onChange={(e) => setSelectedTicker(e.target.value)}>
                    <option value="">All</option>
                    {tickers.map(ticker => (
                        <option key={ticker} value={ticker}>{ticker}</option>
                    ))}
                </select>
            </div>
            
            {/* Chart */}
            <div style={{ width: '80%', margin: '0 auto' }}>
                <Line data={chartData} options={chartOptions} />
            </div>

            {/* Table */}
            <table>
                <thead>
                    <tr>
                        <th>
                            <button type="button" onClick={() => requestSort('date')}>
                                Date
                                {sortConfig.key === 'date' && (sortConfig.direction === 'asc' ? ' 🔼' : ' 🔽')}
                            </button>
                        </th>
                        <th>
                            <button type="button" onClick={() => requestSort('ticker')}>
                                Ticker
                                {sortConfig.key === 'ticker' && (sortConfig.direction === 'asc' ? ' 🔼' : ' 🔽')}
                            </button>
                        </th>
                        <th>Close Price</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedData.map((entry, index) => (
                        <tr key={`${entry.date}-${entry.ticker}`}>
                            <td>{new Intl.DateTimeFormat('en-US').format(new Date(entry.date))}</td>
                            <td>{entry.ticker}</td>
                            <td>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(entry.close)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export async function getServerSideProps() {
    try {
        const data = await fetchDailyClosingPrices();
        return { props: { data } };
    } catch (error) {
        console.error('Error fetching daily closing prices:', error);
        return { props: { data: [] } }; // Return empty array or handle as appropriate
    }
}
