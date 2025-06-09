import { create } from 'zustand';
import { Person } from '@/lib/types';

interface TableState {
  // The original data from the server
  originalPeople: Person[];
  // Local changes that haven't been saved yet
  localChanges: Record<string, Partial<Person>>;
  // Whether we're currently saving
  isSaving: boolean;
  // Search term for filtering
  searchTerm: string;
  
  // Actions
  setOriginalPeople: (people: Person[]) => void;
  updateField: <K extends keyof Person>(personId: string, field: K, value: Person[K]) => void;
  clearChanges: () => void;
  setSaving: (saving: boolean) => void;
  setSearchTerm: (term: string) => void;
  
  // Computed getters
  getPeopleWithChanges: () => Person[];
  getFilteredPeople: () => Person[];
  getChangedRecords: () => { id: string; changes: Partial<Person> }[];
  hasChanges: () => boolean;
}

export const useTableStore = create<TableState>((set, get) => ({
  originalPeople: [],
  localChanges: {},
  isSaving: false,
  searchTerm: '',
  
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
  
  setSearchTerm: (term) => set({ searchTerm: term }),
  
  getPeopleWithChanges: () => {
    const { originalPeople, localChanges } = get();
    return originalPeople.map((person) => ({
      ...person,
      ...localChanges[person.id],
    }));
  },
  
  getFilteredPeople: () => {
    const { searchTerm } = get();
    const peopleWithChanges = get().getPeopleWithChanges();
    
    if (!searchTerm.trim()) {
      return peopleWithChanges;
    }
    
    const lowerSearchTerm = searchTerm.toLowerCase().trim();
    
    return peopleWithChanges.filter((person) => {
      // Search across multiple fields
      const searchFields = [
        person.name,
        person.location,
        person.headline,
        person.currentPosition,
        person.currentCompany,
        person.email,
        person.phone,
        person.about,
        ...(person.websites || []),
      ];
      
      return searchFields.some((field) =>
        field?.toLowerCase().includes(lowerSearchTerm)
      );
    });
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