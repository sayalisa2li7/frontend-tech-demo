import React, { useState, useMemo } from 'react';
import Navbar from '../components/Navbar';
import { fetchDailyClosingPrices } from '../lib/api';
import '../styles/global.css';
import useAuth from '../components/useAuth';

export default function DailyClosingPrices ({ data }) {
    useAuth();
    const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'asc' });

    const sortedData = useMemo(() => {
        let sortableData = [...data];
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
    }, [data, sortConfig]);

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Group data by date
    const groupedData = useMemo(() => {
        const groups = [];
        sortedData.forEach(entry => {
            const existingGroup = groups.find(group => group.date === entry.date);
            if (existingGroup) {
                existingGroup.entries.push(entry);
            } else {
                groups.push({ date: entry.date, entries: [entry] });
            }
        });
        return groups;
    }, [sortedData]);

    return (
        <div>
            <Navbar />
            <h1>Daily Closing Prices</h1>
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
                    {groupedData.map((group, groupIndex) => (
                        <React.Fragment key={groupIndex}>
                            {group.entries.map((entry, entryIndex) => (
                                <tr key={`${entry.date}-${entry.ticker}`}>
                                    {entryIndex === 0 && (
                                        <td rowSpan={group.entries.length}>
                                            {new Intl.DateTimeFormat('en-US').format(new Date(group.date))}
                                        </td>
                                    )}
                                    <td>{entry.ticker}</td>
                                    <td>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(entry.close)}</td>
                                </tr>
                            ))}
                        </React.Fragment>
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

