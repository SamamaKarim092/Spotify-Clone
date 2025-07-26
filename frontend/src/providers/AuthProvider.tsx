import { useAuth } from '@clerk/clerk-react';
import { useState, useEffect } from 'react';
import { axiosInstance } from '@/lib/axios';     
import { Loader } from "lucide-react";
import { useAuthStore } from '@/stores/useAuthStore';

interface AuthProviderProps {
    children: React.ReactNode;
}

const updateApiToken = (token: string | null): void => {
    if (token) {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        console.log('Token set in axios headers:', `Bearer ${token.substring(0, 20)}...`);
    } else {
        delete axiosInstance.defaults.headers.common['Authorization'];
        console.log('Token removed from axios headers');
    } 
};

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const { getToken, isSignedIn, isLoaded } = useAuth();
    const [loading, setLoading] = useState<boolean>(true);
    const { checkAdminStatus, reset } = useAuthStore();

    useEffect(() => {
        const initAuth = async () => {
            try {
                // Wait for Clerk to load
                if (!isLoaded) {
                    console.log('Clerk not loaded yet, waiting...');
                    return;
                }

                console.log('Is signed in:', isSignedIn);

                if (isSignedIn) {
                    const token = await getToken();
                    console.log('Got token:', token ? 'Token received' : 'No token');
                    
                    updateApiToken(token);
                    
                    if (token) {
                        console.log('Checking admin status...');
                        await checkAdminStatus();
                    }
                } else {
                    console.log('User not signed in, resetting auth state');
                    updateApiToken(null);
                    reset();
                }
            } catch (error) {
                console.error('Error in auth provider:', error);
                updateApiToken(null);
                reset();
            } finally {
                setLoading(false);
            }
        };
        
        initAuth();
    }, [getToken, checkAdminStatus, reset, isSignedIn, isLoaded]);

    if (!isLoaded || loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center">
                <Loader className="size-8 text-emerald-500 animate-spin" />
            </div>
        );
    }

    return <>{children}</>;
};

export default AuthProvider;