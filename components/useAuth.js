import { useRouter } from 'next/router';
import { useEffect } from 'react';

const useAuth = () => {
    const router = useRouter();
    useEffect(() => {
        // Check if user is authenticated
        const user = localStorage.getItem('user');
        if (!user) {
            // Redirect to login page if not authenticated
            router.push('/login');
        }
    }, [router]);
};

export default useAuth;
