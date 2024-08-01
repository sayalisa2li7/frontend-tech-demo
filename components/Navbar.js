// components/Navbar.js
import Link from 'next/link';
import { useRouter } from 'next/router'; // Import useRouter hook to get the current route
import styles from './Navbar.module.css'; // Optional: for custom styling

const Navbar = () => {
  const router = useRouter(); // Get the current route
  
  return (
    <nav className={styles.navbar}>
      <ul className={styles.navList}>
        <li className={`${styles.navItem} ${router.pathname === '/home' ? styles.active : ''}`}>
          <Link href="/home">Home</Link>
        </li>
        <li className={`${styles.navItem} ${router.pathname === '/daily-closing-prices' ? styles.active : ''}`}>
          <Link href="/daily-closing-prices">Daily Closing Prices</Link>
        </li>
        <li className={`${styles.navItem} ${router.pathname === '/price-change-percentage' ? styles.active : ''}`}>
          <Link href="/price-change-percentage">Price Change Percentage</Link>
        </li>
        <li className={`${styles.navItem} ${router.pathname === '/top-gainers-losers' ? styles.active : ''}`}>
          <Link href="/top-gainers-losers">Top Gainers Losers</Link>
        </li>
        <li className={`${styles.navItem} ${router.pathname === '/daily-report' ? styles.active : ''}`}>
          <Link href="/daily-report">Daily Report</Link>
        </li>
        <li className={`${styles.navItem} ${router.pathname === '/weekly-report' ? styles.active : ''}`}>
          <Link href="/weekly-report">Weekly Report</Link>
        </li>
        <li className={`${styles.navItem} ${router.pathname === '/monthly-report' ? styles.active : ''}`}>
          <Link href="/monthly-report">Monthly Report</Link>
        </li>
        <li className={`${styles.navItem} ${router.pathname === '/logout' ? styles.active : ''}`}>
          <Link href="/logout">Logout</Link>
        </li>
        {/* Add more links as needed */}
      </ul>
    </nav>
  );
};

export default Navbar;
