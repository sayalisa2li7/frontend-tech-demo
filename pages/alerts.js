import { useEffect, useState } from 'react';
import { fetchAlerts } from '../lib/api';

const Alerts = () => {
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const alertData = await fetchAlerts();
                setAlerts(alertData);
            } catch (error) {
                console.error('Error fetching alerts:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <h1>Alerts</h1>
            <ul>
                {alerts.map((alert, index) => (
                    <li key={index}>
                        <p>Ticker: {alert.ticker}</p>
                        <p>Change: {alert.change}%</p>
                        <p>Condition: {alert.condition}</p>
                        <p>Triggered at: {alert.time}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Alerts;
