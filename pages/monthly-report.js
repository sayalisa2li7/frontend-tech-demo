import { useEffect, useState } from 'react';
import { fetchMonthlyReport } from '../lib/api';
import Navbar from '../components/Navbar';
import useAuth from '../components/useAuth';

const MonthlyReport = () => {
    useAuth();
    const [report, setReport] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getReport = async () => {
            try {
                const data = await fetchMonthlyReport();
                setReport(data);
            } catch (err) {
                setError(err.message);
            }
        };

        getReport();
    }, []);

    if (error) {
        return <p>Error fetching monthly report: {error}</p>;
    }

    if (!report) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <Navbar />
            <h1>Monthly Report ({report.start_date} - {report.end_date})</h1>
            <h2>Highest Closing Price</h2>
            <p>Ticker: {report.highest.ticker}</p>
            <p>Close Price: {report.highest.close}</p>
            <p>Date: {report.highest.date}</p>
            <h2>Lowest Closing Price</h2>
            <p>Ticker: {report.lowest.ticker}</p>
            <p>Close Price: {report.lowest.close}</p>
            <p>Date: {report.lowest.date}</p>
        </div>
    );
};

export default MonthlyReport;
