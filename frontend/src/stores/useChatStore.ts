import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";


interface ChatStore {
  users: any[]; // TODO: Replace any with a defined User type, e.g., User[]
  fetchUsers: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const useChatStore = create<ChatStore>((set) => ({
  users: [], // FIX: Changed `user` to `users` to match the ChatStore interface.
  isLoading: false,
  error: null,

  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/users");
      set({ users: response.data });
    } catch (error: any) {
      set({ error: error?.response?.data?.message || "An unexpected error occurred" });
    } finally {
      set({ isLoading: false });
    }
  },
}));