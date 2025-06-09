import { create } from 'zustand';
import { Person } from '@/lib/types';

interface PeopleState {
  people: Person[];
  setPeople: (people: Person[]) => void;
  addPerson: (person: Person) => void;
  updatePerson: (id: string, updates: Partial<Person>) => void;
  deletePerson: (id: string) => void;
}

export const usePeopleStore = create<PeopleState>((set) => ({
  people: [],
  
  setPeople: (people) => set({ people }),
  
  addPerson: (person) => set((state) => ({
    people: [person, ...state.people]
  })),
  
  updatePerson: (id, updates) => set((state) => ({
    people: state.people.map((person) =>
      person.id === id ? { ...person, ...updates } : person
    )
  })),
  
  deletePerson: (id) => set((state) => ({
    people: state.people.filter((person) => person.id !== id)
  })),
})); 