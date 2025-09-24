import { create } from 'zustand'

export const useAppStore = create((set, get) => ({
  points: 0,
  user: {
    name: 'Guest',
    email: 'guest@example.com',
  },
  setUser: (updates) => set((state) => ({ user: { ...state.user, ...updates } })),
  setPoints: (value) => set({ points: value }),
  addPoints: (delta) => set({ points: get().points + delta }),
}))
