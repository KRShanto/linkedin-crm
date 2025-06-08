import { getPeople } from "@/actions/people";
import { ViewPersonButton } from "@/components/ViewPersonButton";
import { AddPersonDialog } from "@/components/AddPersonDialog";
import type { Person } from "@/lib/types";
import { ContactStatus } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "LinkedIn CRM",
  description: "Manage your LinkedIn connections and prospects",
};

export const revalidate = 0;

export default async function CRMPage() {
  const people = await getPeople();

  function getConnectionLabel(degree: number) {
    if (degree === 1) return "1st";
    if (degree === 2) return "2nd";
    if (degree === 3) return "3rd";
    return `${degree}th`;
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
        <AddPersonDialog />
      </div>

      <div className="rounded-xl border bg-white dark:bg-zinc-900/30 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-zinc-200 dark:border-zinc-800">
              <TableHead className="font-semibold py-4 px-6 bg-zinc-50 dark:bg-zinc-800/30 text-zinc-700 dark:text-zinc-300">
                Name
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
              <TableHead className="text-right font-semibold py-4 px-6 bg-zinc-50 dark:bg-zinc-800/30 text-zinc-700 dark:text-zinc-300">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {people.map((person: Person) => (
              <TableRow
                key={person.id}
                className="group transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/20 border-b border-zinc-200 dark:border-zinc-800"
              >
                <TableCell className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    {person.profileImage && (
                      <img
                        src={person.profileImage}
                        alt={person.name || "Profile"}
                        className="h-10 w-10 rounded-full object-cover ring-2 ring-zinc-200 transition-all group-hover:ring-blue-200 dark:ring-zinc-700 dark:group-hover:ring-blue-500/30"
                      />
                    )}
                    <div>
                      <span className="font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {person.name}
                      </span>
                      {person.url && (
                        <a
                          href={person.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:underline cursor-pointer transition-colors block"
                        >
                          View Profile
                        </a>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-4 px-6 text-zinc-600 dark:text-zinc-400">
                  {person.location}
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
                  <Badge
                    variant="outline"
                    className={`
                      ${
                        person.status === ContactStatus.CANCELLED
                          ? "border-red-200 text-red-700 dark:border-red-500/20 dark:text-red-400"
                          : "border-blue-200 text-blue-700 dark:border-blue-500/20 dark:text-blue-400"
                      }
                    `}
                  >
                    {person.status}
                  </Badge>
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
