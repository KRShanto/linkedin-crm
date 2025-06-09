import React, { createContext, useContext, useState, useCallback } from "react";
import { Person } from "@/lib/types";

type TableChanges = {
  [key: string]: Partial<Person>;
};

interface TableStateContextType {
  changes: TableChanges;
  hasChanges: boolean;
  updateField: <K extends keyof Person>(
    personId: string,
    field: K,
    value: Person[K]
  ) => void;
  resetChanges: () => void;
  getChangedRecords: () => { id: string; changes: Partial<Person> }[];
}

const TableStateContext = createContext<TableStateContextType | undefined>(
  undefined
);

export function TableStateProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [changes, setChanges] = useState<TableChanges>({});

  const updateField = useCallback(
    <K extends keyof Person>(personId: string, field: K, value: Person[K]) => {
      setChanges((prev) => ({
        ...prev,
        [personId]: {
          ...(prev[personId] || {}),
          [field]: value,
        },
      }));
    },
    []
  );

  const resetChanges = useCallback(() => {
    setChanges({});
  }, []);

  const getChangedRecords = useCallback(() => {
    return Object.entries(changes).map(([id, changes]) => ({
      id,
      changes,
    }));
  }, [changes]);

  const hasChanges = Object.keys(changes).length > 0;

  return (
    <TableStateContext.Provider
      value={{
        changes,
        hasChanges,
        updateField,
        resetChanges,
        getChangedRecords,
      }}
    >
      {children}
    </TableStateContext.Provider>
  );
}

export function useTableState() {
  const context = useContext(TableStateContext);
  if (context === undefined) {
    throw new Error("useTableState must be used within a TableStateProvider");
  }
  return context;
}
