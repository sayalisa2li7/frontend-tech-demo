import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { logoutUser } from '../lib/api';

export default function Logout() {
const router = useRouter();

useEffect(() => {
const performLogout = async () => {
try {
await logoutUser();
router.push('/login'); // Redirect to login page after logout
} catch (err) {
console.error('Logout failed:', err);
}
};
performLogout();
}, []);

return <p>Logging out...</p>;
}