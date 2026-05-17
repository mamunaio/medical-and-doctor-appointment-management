import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface EmergencyIntake {
  id: string;
  name: string;
  age: string;
  gender: string;
  complaint: string;
  priority: 'Critical' | 'Urgent' | 'Stable' | 'Minor';
  bay: string;
  time: string;
  status: string;
}

interface EmergencyState {
  activeSiren: boolean;
  sirenType: string | null;
  sirenEta: string | null;
  emergencyCount: number;
  intakes: EmergencyIntake[];
  triggerSiren: (type: string, eta: string) => void;
  clearSiren: () => void;
  addIntake: (intake: Omit<EmergencyIntake, 'id' | 'time' | 'status'>) => void;
  removeIntake: (id: string) => void;
}

export const useEmergencyStore = create<EmergencyState>()(
  persist(
    (set) => ({
      activeSiren: false,
      sirenType: null,
      sirenEta: null,
      emergencyCount: 5, // Default from seeded stats
      intakes: [
        { id: "ER-045", name: "Unknown (Male, ~30y)", age: "30", gender: "Male", complaint: "Road Accident, Severe Bleeding", priority: "Critical", bay: "Red Bay 02", time: "12:30 PM", status: "In Surgery" },
        { id: "ER-046", name: "Abul Kalam", age: "54", gender: "Male", complaint: "Cardiac Arrest", priority: "Critical", bay: "Red Bay 01", time: "12:45 PM", status: "In Resuscitation" },
        { id: "ER-047", name: "Mina Akter", age: "28", gender: "Female", complaint: "High Fever & Seizure", priority: "Urgent", bay: "Yellow Room 02", time: "01:02 PM", status: "Waiting" },
      ],
      triggerSiren: (type, eta) => set({ 
        activeSiren: true, 
        sirenType: type, 
        sirenEta: eta 
      }),
      clearSiren: () => set({ 
        activeSiren: false, 
        sirenType: null, 
        sirenEta: null 
      }),
      addIntake: (newIntake) => set((state) => {
        const id = `ER-0${45 + state.intakes.length + 1}`;
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const intakeItem: EmergencyIntake = {
          ...newIntake,
          id,
          time,
          status: newIntake.priority === 'Critical' ? 'In Resuscitation' : 'Waiting'
        };
        return {
          intakes: [intakeItem, ...state.intakes],
          emergencyCount: state.emergencyCount + 1
        };
      }),
      removeIntake: (id) => set((state) => ({
        intakes: state.intakes.filter((item) => item.id !== id),
        emergencyCount: Math.max(0, state.emergencyCount - 1)
      }))
    }),
    {
      name: 'emergency-storage',
    }
  )
);
