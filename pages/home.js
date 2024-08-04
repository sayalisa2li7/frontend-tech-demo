import Navbar from '../components/Navbar';
import '../styles/global.css';

export default function Home() {
    return (
        <div style={styles.container}>
            <Navbar />
            <main style={styles.main}>
                <section style={styles.hero}>
                    <h1 style={styles.heroTitle}>Welcome to Stock Tracker</h1>
                    <p style={styles.heroSubtitle}>Track and analyze stock market data with ease.</p>
                    <a href="/login" style={styles.ctaButton}>Get Started</a>
                </section>
                <section style={styles.features}>
                    <div style={styles.featureCard}>
                        <h2 style={styles.featureTitle}>Real-Time Data</h2>
                        <p style={styles.featureDescription}>Get up-to-date stock prices and market trends.</p>
                    </div>
                    <div style={styles.featureCard}>
                        <h2 style={styles.featureTitle}>Comprehensive Analytics</h2>
                        <p style={styles.featureDescription}>Analyze stock performance with detailed charts and reports.</p>
                    </div>
                </section>
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
    hero: {
        background: 'linear-gradient(135deg, #a2c2e2, #e3f2fd)', // Lighter gradient background
        color: '#333',
        padding: '60px 20px',
        borderRadius: '8px',
        marginBottom: '40px',
    },
    heroTitle: {
        fontSize: '2.5rem',
        fontWeight: 'bold',
        margin: '0 0 10px',
    },
    heroSubtitle: {
        fontSize: '1.25rem',
        margin: '0 0 20px',
    },
    ctaButton: {
        display: 'inline-block',
        padding: '10px 20px',
        fontSize: '1rem',
        fontWeight: 'bold',
        color: '#fff',
        backgroundColor: '#007bff',
        borderRadius: '5px',
        textDecoration: 'none',
        transition: 'background-color 0.3s',
    },
    ctaButtonHover: {
        backgroundColor: '#0056b3',
    },
    features: {
        display: 'flex',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
        gap: '20px',
    },
    featureCard: {
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        padding: '20px',
        width: '30%',
        textAlign: 'left',
        minWidth: '250px',
    },
    featureTitle: {
        fontSize: '1.5rem',
        margin: '0 0 10px',
    },
    featureDescription: {
        fontSize: '1rem',
        margin: '0',
    },
};
