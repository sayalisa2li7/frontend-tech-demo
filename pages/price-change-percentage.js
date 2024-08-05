import { useState, useEffect } from 'react';
import { fetchPriceChangePercentage } from '../lib/api';
import Navbar from '../components/Navbar';
import '../styles/global.css';
import useAuth from '../components/useAuth';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const calculatePercentageChange = (start, end) => {
    return ((end - start) / start * 100).toFixed(2);
};

const calculateChange = (data, ticker, days) => {
    const now = new Date();
    const pastDate = new Date();
    pastDate.setDate(now.getDate() - days);

    const tickerData = data.filter(entry => entry.ticker === ticker && new Date(entry.date) >= pastDate);

    if (tickerData.length > 0) {
        const startPrice = parseFloat(tickerData[0].close);
        const endPrice = parseFloat(tickerData[tickerData.length - 1].close);
        return calculatePercentageChange(startPrice, endPrice);
    }
    return 'N/A';
};

const PriceChangePercentage = ({ initialData }) => {
    useAuth();
    const [data, setData] = useState([]);
    const [selectedTicker, setSelectedTicker] = useState('All');

    useEffect(() => {
        // Aggregate data by ticker
        const tickers = [...new Set(initialData.map(entry => entry.ticker))];
        const processedData = tickers.map(ticker => {
            const tickerData = initialData.filter(entry => entry.ticker === ticker);
            if (tickerData.length > 0) {
                const dailyClose = parseFloat(tickerData[tickerData.length - 1].close);
                const dailyChange = calculatePercentageChange(parseFloat(tickerData[tickerData.length - 1].open), dailyClose);
                const weeklyChange = calculateChange(initialData, ticker, 7);
                const monthlyChange = calculateChange(initialData, ticker, 30);
                const yearlyChange = calculateChange(initialData, ticker, 365);

                return {
                    ticker,
                    daily_closing_price: dailyClose,
                    daily_change: dailyChange,
                    weekly_change: weeklyChange,
                    monthly_change: monthlyChange,
                    yearly_change: yearlyChange,
                };
            }
            return null;
        }).filter(item => item !== null);

        setData(processedData);
    }, [initialData]);

    const handleTickerChange = (event) => {
        setSelectedTicker(event.target.value);
    };

    const filteredData = selectedTicker === 'All' ? data : data.filter(item => item.ticker === selectedTicker);

    const chartData = {
        labels: filteredData.map(entry => entry.ticker),
        datasets: [
            {
                label: 'Daily Change (%)',
                data: filteredData.map(entry => parseFloat(entry.daily_change)),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                categoryPercentage: 0.5,
                barPercentage: 0.8,
            },
            {
                label: 'Weekly Change (%)',
                data: filteredData.map(entry => parseFloat(entry.weekly_change)),
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1,
                categoryPercentage: 0.5,
                barPercentage: 0.8,
            },
            {
                label: 'Monthly Change (%)',
                data: filteredData.map(entry => parseFloat(entry.monthly_change)),
                backgroundColor: 'rgba(255, 159, 64, 0.2)',
                borderColor: 'rgba(255, 159, 64, 1)',
                borderWidth: 1,
                categoryPercentage: 0.5,
                barPercentage: 0.8,
            },
            {
                label: 'Yearly Change (%)',
                data: filteredData.map(entry => parseFloat(entry.yearly_change)),
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
                categoryPercentage: 0.5,
                barPercentage: 0.8,
            },
        ],
    };

    const getChangeColor = (change) => {
        if (change === 'N/A') return 'black';
        return parseFloat(change) >= 0 ? 'green' : 'red';
    };

    return (
        <div>
            <Navbar />
            <h1>Price Change Percentage Report</h1>

            <label htmlFor="ticker-filter">Filter by Ticker:</label>
            <select id="ticker-filter" onChange={handleTickerChange} value={selectedTicker}>
                <option value="All">All</option>
                {[...new Set(initialData.map(entry => entry.ticker))].map(ticker => (
                    <option key={ticker} value={ticker}>{ticker}</option>
                ))}
            </select>

            <Bar data={chartData} options={{
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += `${context.parsed.y.toFixed(2)}%`;
                                }
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Ticker'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Percentage Change (%)'
                        },
                        ticks: {
                            callback: function(value) {
                                return `${value}%`;
                            }
                        }
                    }
                }
            }} />

            <table>
                <thead>
                    <tr>
                        <th>Company Code</th>
                        <th>Daily Closing Price</th>
                        <th>% Change (Daily)</th>
                        <th>% Change (Weekly)</th>
                        <th>% Change (Monthly)</th>
                        <th>% Change (Yearly)</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.length === 0 ? (
                        <tr>
                            <td colSpan="6">No data available.</td>
                        </tr>
                    ) : (
                        filteredData.map((entry) => (
                            <tr key={entry.ticker}>
                                <td>{entry.ticker}</td>
                                <td>{entry.daily_closing_price}</td>
                                <td style={{ color: getChangeColor(entry.daily_change) }}>{entry.daily_change}%</td>
                                <td style={{ color: getChangeColor(entry.weekly_change) }}>{entry.weekly_change}%</td>
                                <td style={{ color: getChangeColor(entry.monthly_change) }}>{entry.monthly_change}%</td>
                                <td style={{ color: getChangeColor(entry.yearly_change) }}>{entry.yearly_change}%</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export async function getServerSideProps() {
    const data = await fetchPriceChangePercentage();
    return { props: { initialData: data } };
}

export default PriceChangePercentage;
