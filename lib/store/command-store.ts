import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CommandStoreState {
  // Command Palette Visibility
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  toggleOpen: () => void;

  // Recent Searches/Actions
  recentItems: { id: string; label: string; type: string; href?: string; actionId?: string }[];
  addRecentItem: (item: { id: string; label: string; type: string; href?: string; actionId?: string }) => void;
  clearRecentItems: () => void;

  // Global Dialogs State
  dialogs: {
    inviteTeam: boolean;
    createProject: boolean;
    generateReport: boolean;
  };
  openDialog: (dialogId: keyof CommandStoreState['dialogs']) => void;
  closeDialog: (dialogId: keyof CommandStoreState['dialogs']) => void;
}

export const useCommandStore = create<CommandStoreState>()(
  persist(
    (set) => ({
      isOpen: false,
      setIsOpen: (isOpen) => set({ isOpen }),
      toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),

      recentItems: [],
      addRecentItem: (item) => set((state) => {
        // Keep max 5 recent items, avoid duplicates
        const filtered = state.recentItems.filter((i) => i.id !== item.id);
        return { recentItems: [item, ...filtered].slice(0, 5) };
      }),
      clearRecentItems: () => set({ recentItems: [] }),

      dialogs: {
        inviteTeam: false,
        createProject: false,
        generateReport: false,
      },
      openDialog: (dialogId) => set((state) => ({
        dialogs: { ...state.dialogs, [dialogId]: true }
      })),
      closeDialog: (dialogId) => set((state) => ({
        dialogs: { ...state.dialogs, [dialogId]: false }
      })),
    }),
    {
      name: 'command-store',
      partialize: (state) => ({ recentItems: state.recentItems }) // Only persist recentItems
    }
  )
);
