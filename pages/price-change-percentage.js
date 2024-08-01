// pages/price-change-percentage.js
import { useState, useEffect } from 'react';
import { fetchPriceChangePercentage } from '../lib/api';
import Navbar from '../components/Navbar';
import '../styles/global.css';
import useAuth from '../components/useAuth';

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

    useEffect(() => {
        // Debugging: log initial data
        console.log('Initial Data:', initialData);

        // Aggregate data by ticker
        const tickers = [...new Set(initialData.map(entry => entry.ticker))];
        const processedData = tickers.map(ticker => {
            const tickerData = initialData.filter(entry => entry.ticker === ticker);
            if (tickerData.length > 0) {
                const dailyClose = parseFloat(tickerData[tickerData.length - 1].close);
                const dailyChange = calculatePercentageChange(parseFloat(tickerData[tickerData.length - 1].open), dailyClose);
                const weeklyChange = calculateChange(initialData, ticker, 7);
                const monthlyChange = calculateChange(initialData, ticker, 30);

                return {
                    ticker,
                    daily_closing_price: dailyClose,
                    daily_change: dailyChange,
                    weekly_change: weeklyChange,
                    monthly_change: monthlyChange,
                };
            }
            return null;
        }).filter(item => item !== null);

        setData(processedData);
    }, [initialData]);

    return (
        <div>
            <Navbar />
            <h1>Price Change Percentage Report</h1>
            
            <table>
                <thead>
                    <tr>
                        <th>Company Code</th>
                        <th>Daily Closing Price</th>
                        <th>% Change (Daily)</th>
                        <th>% Change (Weekly)</th>
                        <th>% Change (Monthly)</th>
                    </tr>
                </thead>
                <tbody>
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan="5">No data available.</td>
                        </tr>
                    ) : (
                        data.map((entry) => (
                            <tr key={entry.ticker}>
                                <td>{entry.ticker}</td>
                                <td>{entry.daily_closing_price}</td>
                                <td>{entry.daily_change}%</td>
                                <td>{entry.weekly_change}%</td>
                                <td>{entry.monthly_change}%</td>
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
