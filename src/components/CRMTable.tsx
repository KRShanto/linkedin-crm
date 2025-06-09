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
import { Input } from "@/components/ui/input";
import { bulkUpdatePeople } from "@/actions/people";
import { Loader2, Search } from "lucide-react";
import { useTableStore } from "@/stores/tableStore";
import { usePeopleStore } from "@/stores/peopleStore";
import { useCallback, useEffect } from "react";

const statusOptions = Object.entries(ContactStatus).map(([, value]) => {
  const match = value.match(/\((\d+)\/(\d+)\)/);
  return {
    value,
    label: value,
    ...(match ? { step: parseInt(match[1]), total: parseInt(match[2]) } : {}),
  };
});

function CRMTableContent({ people: initialPeople }: { people: Person[] }) {
  const {
    setOriginalPeople,
    updateField,
    clearChanges,
    setSaving,
    getFilteredPeople,
    getChangedRecords,
    hasChanges,
    isSaving,
    searchTerm,
    setSearchTerm,
  } = useTableStore();

  const { people, setPeople } = usePeopleStore();

  // Initialize both stores with the data
  useEffect(() => {
    setPeople(initialPeople);
    setOriginalPeople(initialPeople);
  }, [initialPeople, setPeople, setOriginalPeople]);

  // Use the people from the store as the base data, then apply local changes
  useEffect(() => {
    setOriginalPeople(people);
  }, [people, setOriginalPeople]);

  // Get the filtered people with local changes applied
  const filteredPeople = getFilteredPeople();

  function getConnectionLabel(degree: number) {
    if (degree === 1) return "1st";
    if (degree === 2) return "2nd";
    if (degree === 3) return "3rd";
    return `${degree}th`;
  }

  const handleSave = useCallback(async () => {
    const records = getChangedRecords();
    setSaving(true);

    try {
      // Send changes to server
      await bulkUpdatePeople(records);
      clearChanges();
    } catch (error) {
      console.error("Failed to save changes:", error);
    } finally {
      setSaving(false);
    }
  }, [getChangedRecords, clearChanges, setSaving]);

  // Update local state immediately when a field changes
  const handleFieldUpdate = useCallback(
    <K extends keyof Person>(personId: string, field: K, value: Person[K]) => {
      updateField(personId, field, value);
    },
    [updateField]
  );

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
          {hasChanges() && (
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

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500 dark:text-zinc-400" />
          <Input
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 transition-all focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500"
          />
        </div>
        {searchTerm && (
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">
            {filteredPeople.length} result
            {filteredPeople.length === 1 ? "" : "s"} found
          </p>
        )}
      </div>

      <div className="rounded-xl border bg-white dark:bg-zinc-900/30 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-zinc-200 dark:border-zinc-800">
              <TableHead className="font-semibold py-4 px-6 bg-zinc-50 dark:bg-zinc-800/30 text-zinc-700 dark:text-zinc-300">
                Name ({filteredPeople.length} leads)
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
            {filteredPeople.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12">
                  <div className="flex flex-col items-center gap-2">
                    <Search className="h-8 w-8 text-zinc-400" />
                    <p className="text-zinc-600 dark:text-zinc-400">
                      {searchTerm
                        ? "No contacts found matching your search"
                        : "No contacts available"}
                    </p>
                    {searchTerm && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSearchTerm("")}
                        className="mt-2"
                      >
                        Clear search
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredPeople.map((person: Person) => (
                <TableRow
                  key={person.id}
                  className="group border-b border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                >
                  <TableCell className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      {person.url ? (
                        <a
                          href={person.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 hover:opacity-80 transition-opacity group"
                        >
                          {person.profileImage ? (
                            <img
                              src={person.profileImage}
                              alt={person.name || "Profile"}
                              className="h-12 w-12 rounded-full object-cover ring-2 ring-transparent group-hover:ring-blue-200 dark:group-hover:ring-blue-500/20 transition-all"
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center ring-2 ring-transparent group-hover:ring-blue-200 dark:group-hover:ring-blue-500/20 transition-all">
                              <span className="text-lg text-zinc-500 dark:text-zinc-400">
                                {person.name?.[0]?.toUpperCase() || "?"}
                              </span>
                            </div>
                          )}
                          <div className="font-medium text-lg text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {person.name}
                          </div>
                        </a>
                      ) : (
                        <>
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
                        </>
                      )}
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
                          {getConnectionLabel(person.connectionDegree)}{" "}
                          connection
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
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export function CRMTable({ people }: { people: Person[] }) {
  return <CRMTableContent people={people} />;
}
