import { create } from 'zustand';
import { Person } from '@/lib/types';

interface TableState {
  // The original data from the server
  originalPeople: Person[];
  // Local changes that haven't been saved yet
  localChanges: Record<string, Partial<Person>>;
  // Whether we're currently saving
  isSaving: boolean;
  
  // Actions
  setOriginalPeople: (people: Person[]) => void;
  updateField: <K extends keyof Person>(personId: string, field: K, value: Person[K]) => void;
  clearChanges: () => void;
  setSaving: (saving: boolean) => void;
  
  // Computed getters
  getPeopleWithChanges: () => Person[];
  getChangedRecords: () => { id: string; changes: Partial<Person> }[];
  hasChanges: () => boolean;
}

export const useTableStore = create<TableState>((set, get) => ({
  originalPeople: [],
  localChanges: {},
  isSaving: false,
  
  setOriginalPeople: (people) => set({ originalPeople: people }),
  
  updateField: (personId, field, value) => {
    set((state) => ({
      localChanges: {
        ...state.localChanges,
        [personId]: {
          ...state.localChanges[personId],
          [field]: value,
        },
      },
    }));
  },
  
  clearChanges: () => set({ localChanges: {} }),
  
  setSaving: (saving) => set({ isSaving: saving }),
  
  getPeopleWithChanges: () => {
    const { originalPeople, localChanges } = get();
    return originalPeople.map((person) => ({
      ...person,
      ...localChanges[person.id],
    }));
  },
  
  getChangedRecords: () => {
    const { localChanges } = get();
    return Object.entries(localChanges).map(([id, changes]) => ({
      id,
      changes,
    }));
  },
  
  hasChanges: () => {
    const { localChanges } = get();
    return Object.keys(localChanges).length > 0;
  },
})); 