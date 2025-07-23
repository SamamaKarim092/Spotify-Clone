import { useAuth } from '@clerk/clerk-react';
import { useState, useEffect } from 'react';
import { axiosInstance } from '@/lib/axios';     
import { Loader } from "lucide-react";

interface AuthProviderProps {
    children: React.ReactNode;
}

const updateApiToken = (token: string | null): void => {
    if (token) {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete axiosInstance.defaults.headers.common['Authorization'];
    } 
};

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const { getToken } = useAuth();
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const initAuth = async () => {
            try {
                const token = await getToken();
                updateApiToken(token);
            } catch (error) {
                updateApiToken(null);
                console.error('Error in auth provider:', error instanceof Error ? error.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        };
        
        initAuth();

        // Cleanup function
        return () => {
            updateApiToken(null);
        };
    }, [getToken]);

    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center">
                <Loader className="size-8 text-emerald-500 animate-spin" />
            </div>
        );
    }

    return <>{children}</>;
};

export default AuthProvider;