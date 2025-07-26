import { axiosInstance } from "@/lib/axios";
import {create} from "zustand";

interface AuthStore {
    isAdmin: boolean;
    error: string | null;
    isLoading: boolean;

    checkAdminStatus: () => Promise<void>;
    reset: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
    isAdmin: false,
    isLoading: false,
    error: null,

    checkAdminStatus: async () => {
        set({ isLoading: true, error: null });
        
        // Debug: Check if we have authorization header
        console.log('Authorization header:', axiosInstance.defaults.headers.common['Authorization']);
        
        try {
            const response = await axiosInstance.get("/admin/check");
            
            // Debug: Log the full response
            console.log('Admin check response:', response);
            console.log('Response data:', response.data);
            
            // Check if response.data.admin exists and log it
            const isAdminValue = response.data.admin;
            console.log('Admin value from response:', isAdminValue);
            console.log('Type of admin value:', typeof isAdminValue);
            
            set({ isAdmin: !!isAdminValue }); // Use !! to ensure boolean conversion
            
        } catch (error: any) {
            console.error('Admin check error:', error);
            console.error('Error response:', error?.response);
            console.error('Error data:', error?.response?.data);
            
            set({ 
                isAdmin: false, 
                error: error?.response?.data?.message || 'Failed to check admin status' 
            });
        } finally {
            set({ isLoading: false });
        }
    },
    
    reset: () => {
        set({ isAdmin: false, error: null, isLoading: false });
    }
}));