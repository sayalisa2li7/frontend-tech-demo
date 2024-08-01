import { createContext, useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { loginUser, logoutUser } from '../lib/api'; // Import your API functions

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        // Check if there's a user in localStorage or session
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = async (userData) => {
        try {
            const data = await loginUser(userData);
            setUser(data);
            localStorage.setItem('user', JSON.stringify(data));
            router.push('/');
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    const logout = async () => {
        try {
            await logoutUser();
            setUser(null);
            localStorage.removeItem('user');
            router.push('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
