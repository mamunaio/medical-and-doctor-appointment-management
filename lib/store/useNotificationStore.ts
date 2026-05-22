import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type NotificationType = 'appointment' | 'system' | 'emergency' | 'billing' | 'lab';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  time: string;
  isRead: boolean;
  link?: string;
}

interface NotificationState {
  notifications: AppNotification[];
  soundEnabled: boolean;
  
  // Computed (handled via getter in components usually, but stored here for convenience if needed)
  unreadCount: () => number;
  
  // Actions
  addNotification: (notif: Omit<AppNotification, 'id' | 'isRead' | 'time'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
  toggleSound: () => void;
}

// Function to play ping sound
const playPingSound = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.1); // Drop to A4 quickly
    
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch (err) {
    console.error("Failed to play notification sound:", err);
  }
};

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [
        {
          id: 'notif-1',
          title: 'System Update Completed',
          message: 'HMS version 2.4.0 has been deployed successfully.',
          type: 'system',
          time: new Date().toISOString(),
          isRead: false,
          link: '/settings'
        },
        {
          id: 'notif-2',
          title: 'New Emergency Admission',
          message: 'Patient John Doe admitted to Red Trauma Bay 01.',
          type: 'emergency',
          time: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
          isRead: false,
          link: '/emergency'
        }
      ],
      soundEnabled: true,
      
      unreadCount: () => get().notifications.filter(n => !n.isRead).length,

      addNotification: (notif) => {
        const newNotif: AppNotification = {
          ...notif,
          id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          time: new Date().toISOString(),
          isRead: false,
        };
        
        set((state) => ({
          notifications: [newNotif, ...state.notifications]
        }));

        if (get().soundEnabled) {
          playPingSound();
        }
      },

      markAsRead: (id) => set((state) => ({
        notifications: state.notifications.map(n => 
          n.id === id ? { ...n, isRead: true } : n
        )
      })),

      markAllAsRead: () => set((state) => ({
        notifications: state.notifications.map(n => ({ ...n, isRead: true }))
      })),

      deleteNotification: (id) => set((state) => ({
        notifications: state.notifications.filter(n => n.id !== id)
      })),

      clearAll: () => set({ notifications: [] }),

      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled }))
    }),
    {
      name: 'hms-notification-storage',
      partialize: (state) => ({ 
        notifications: state.notifications, 
        soundEnabled: state.soundEnabled 
      }), // Persist both notifications and sound preference
    }
  )
);
