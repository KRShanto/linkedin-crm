"use client";

import { Person, ContactStatus } from "@/lib/types";
import { ViewPersonButton } from "@/components/ViewPersonButton";
import { AddPersonDialog } from "@/components/AddPersonDialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProgressSelect } from "@/components/ui/progress-select";
import {
  TableStateProvider,
  useTableState,
} from "@/components/providers/TableStateProvider";
import { bulkUpdatePeople } from "@/actions/people";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useState } from "react";

const statusOptions = Object.entries(ContactStatus).map(([, value]) => {
  const match = value.match(/\((\d+)\/(\d+)\)/);
  return {
    value,
    label: value,
    ...(match ? { step: parseInt(match[1]), total: parseInt(match[2]) } : {}),
  };
});

function CRMTableContent({ people: initialPeople }: { people: Person[] }) {
  const { updateField, hasChanges, getChangedRecords, resetChanges } =
    useTableState();
  const [isSaving, setIsSaving] = useState(false);
  const [people, setPeople] = useState(initialPeople);
  const router = useRouter();

  function getConnectionLabel(degree: number) {
    if (degree === 1) return "1st";
    if (degree === 2) return "2nd";
    if (degree === 3) return "3rd";
    return `${degree}th`;
  }

  async function handleSave() {
    try {
      setIsSaving(true);
      const records = getChangedRecords();

      // Apply optimistic updates
      setPeople((currentPeople) => {
        return currentPeople.map((person) => {
          const changes = records.find((r) => r.id === person.id)?.changes;
          if (changes) {
            return { ...person, ...changes };
          }
          return person;
        });
      });

      // Send changes to server
      await bulkUpdatePeople(records);
      resetChanges();
      router.refresh();
    } catch (error) {
      // On error, revert to initial state
      setPeople(initialPeople);
      console.error("Failed to save changes:", error);
    } finally {
      setIsSaving(false);
    }
  }

  // Update local state immediately when a field changes
  function handleFieldUpdate<K extends keyof Person>(
    personId: string,
    field: K,
    value: Person[K]
  ) {
    updateField(personId, field, value);
    setPeople((currentPeople) => {
      return currentPeople.map((person) => {
        if (person.id === personId) {
          return { ...person, [field]: value };
        }
        return person;
      });
    });
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
            Contacts
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            Manage your LinkedIn connections and prospects
          </p>
        </div>
        <div className="flex items-center gap-3">
          {hasChanges && (
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          )}
          <AddPersonDialog />
        </div>
      </div>

      <div className="rounded-xl border bg-white dark:bg-zinc-900/30 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-zinc-200 dark:border-zinc-800">
              <TableHead className="font-semibold py-4 px-6 bg-zinc-50 dark:bg-zinc-800/30 text-zinc-700 dark:text-zinc-300">
                Name ({people.length} leads)
              </TableHead>
              <TableHead className="font-semibold py-4 px-6 bg-zinc-50 dark:bg-zinc-800/30 text-zinc-700 dark:text-zinc-300">
                Location
              </TableHead>
              <TableHead className="font-semibold py-4 px-6 bg-zinc-50 dark:bg-zinc-800/30 text-zinc-700 dark:text-zinc-300">
                Current Position
              </TableHead>
              <TableHead className="font-semibold py-4 px-6 bg-zinc-50 dark:bg-zinc-800/30 text-zinc-700 dark:text-zinc-300">
                Connection
              </TableHead>
              <TableHead className="font-semibold py-4 px-6 bg-zinc-50 dark:bg-zinc-800/30 text-zinc-700 dark:text-zinc-300">
                Status
              </TableHead>
              <TableHead className="font-semibold py-4 px-6 bg-zinc-50 dark:bg-zinc-800/30 text-zinc-700 dark:text-zinc-300">
                Engagement
              </TableHead>
              <TableHead className="text-right font-semibold py-4 px-6 bg-zinc-50 dark:bg-zinc-800/30 text-zinc-700 dark:text-zinc-300">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {people.map((person: Person) => (
              <TableRow
                key={person.id}
                className="group border-b border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
              >
                <TableCell className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    {person.profileImage ? (
                      <img
                        src={person.profileImage}
                        alt={person.name || "Profile"}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                        <span className="text-lg text-zinc-500 dark:text-zinc-400">
                          {person.name?.[0]?.toUpperCase() || "?"}
                        </span>
                      </div>
                    )}
                    <div className="font-medium text-lg text-zinc-900 dark:text-zinc-100">
                      {person.name}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-4 px-6">
                  <span className="text-zinc-900 dark:text-zinc-100">
                    {person.location}
                  </span>
                </TableCell>
                <TableCell className="py-4 px-6">
                  <div className="flex flex-col">
                    <span className="text-zinc-900 dark:text-zinc-100">
                      {person.currentPosition}
                    </span>
                    {person.currentCompany && (
                      <span className="text-sm text-zinc-600 dark:text-zinc-400">
                        {person.currentCompany}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    {person.connected ? (
                      <Badge className="cursor-default bg-blue-500 hover:bg-blue-600 dark:bg-blue-500 dark:hover:bg-blue-600 text-white">
                        Connected
                      </Badge>
                    ) : person.connectionDegree > 0 ? (
                      <Badge
                        variant="secondary"
                        className="cursor-default bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 dark:text-blue-400"
                      >
                        {getConnectionLabel(person.connectionDegree)} connection
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="cursor-default border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300"
                      >
                        Out of network
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="py-4 px-6">
                  <ProgressSelect
                    value={person.status}
                    options={statusOptions}
                    onValueChange={(value) =>
                      handleFieldUpdate(
                        person.id,
                        "status",
                        value as ContactStatus
                      )
                    }
                    showProgress={false}
                  />
                </TableCell>
                <TableCell className="py-4 px-6">
                  <div className="flex items-center gap-1.5">
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-7 w-7"
                      onClick={() => {
                        const currentValue = person.engagement ?? 0;
                        const newValue = Math.max(0, currentValue - 1);
                        handleFieldUpdate(person.id, "engagement", newValue);
                      }}
                    >
                      <span className="text-lg leading-none">-</span>
                    </Button>
                    <span className="w-8 text-center font-medium text-zinc-900 dark:text-zinc-100">
                      {person.engagement ?? 0}
                    </span>
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-7 w-7"
                      onClick={() => {
                        const currentValue = person.engagement ?? 0;
                        handleFieldUpdate(
                          person.id,
                          "engagement",
                          currentValue + 1
                        );
                      }}
                    >
                      <span className="text-lg leading-none">+</span>
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="text-right py-4 px-6">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <ViewPersonButton personId={person.id} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export function CRMTable({ people }: { people: Person[] }) {
  return (
    <TableStateProvider>
      <CRMTableContent people={people} />
    </TableStateProvider>
  );
}
