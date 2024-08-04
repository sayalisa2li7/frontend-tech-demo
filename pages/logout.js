import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { logoutUser } from '../lib/api';

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    const performLogout = async () => {
      try {
        await logoutUser();
        router.push('/home'); // Redirect to home page after logout
      } catch (err) {
        console.error('Logout failed:', err);
      }
    };

    performLogout();
  }, [router]); // Include `router` in the dependency array

  return <p>Logging out...</p>;
}
