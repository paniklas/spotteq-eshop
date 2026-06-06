import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useCustomerStore = create(
  persist(
    (set) => ({
      savedInfo: null,
      saveCustomerInfo: (info) => set({ savedInfo: info }),
      clearCustomerInfo: () => set({ savedInfo: null }),
    }),
    {
      name: "spotteq-customer-v1",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
