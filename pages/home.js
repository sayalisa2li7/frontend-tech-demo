import Navbar from '../components/Navbar';
import '../styles/global.css';
import useAuth from '../components/useAuth';

export default function Home() {
    useAuth();
    return (
        <div style={styles.container}>
            <Navbar />
            <main style={styles.main}>
                <h1>Stock Tracker</h1>
                <p>Track and analyze stock market data easily.</p>
            </main>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5', // Lighter background for the page
        color: '#333', // Darker text color for contrast
    },
    main: {
        marginTop: '60px', // Ensure content is not hidden behind the fixed navbar
        margin: 'auto', // Center align main content
        padding: '20px',
        backgroundColor: '#fff', // White background for the main section
        borderRadius: '8px',
        maxWidth: '800px', // Increase max-width for larger main content
        width: '100%',
        textAlign: 'center',
    },
};
