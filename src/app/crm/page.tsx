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
import Image from "next/image";
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
    <div className="p-8 max-w-[1600px] mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
            LinkedIn CRM
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your LinkedIn connections and prospects
          </p>
        </div>
        <AddPersonDialog />
      </div>

      <div className="rounded-xl border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-blue-50/50 dark:bg-blue-950/50">
              <TableHead className="font-semibold py-4 px-6">Name</TableHead>
              <TableHead className="font-semibold py-4 px-6">
                Location
              </TableHead>
              <TableHead className="font-semibold py-4 px-6">
                Current Position
              </TableHead>
              <TableHead className="font-semibold py-4 px-6">
                Connection
              </TableHead>
              <TableHead className="font-semibold py-4 px-6">Status</TableHead>
              <TableHead className="text-right font-semibold py-4 px-6">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {people.map((person: Person) => (
              <TableRow
                key={person.id}
                className="group transition-colors hover:bg-blue-50/50 dark:hover:bg-blue-950/50"
              >
                <TableCell className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    {person.profileImage && (
                      <Image
                        src={person.profileImage}
                        alt={person.name || "Profile"}
                        className="h-10 w-10 rounded-full object-cover ring-2 ring-blue-200 transition-all group-hover:ring-blue-400 dark:ring-blue-500/20 dark:group-hover:ring-blue-500/40"
                        width={40}
                        height={40}
                      />
                    )}
                    <div>
                      <span className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
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
                <TableCell className="text-muted-foreground py-4 px-6">
                  {person.location}
                </TableCell>
                <TableCell className="py-4 px-6">
                  <div className="flex flex-col">
                    <span>{person.currentPosition}</span>
                    {person.currentCompany && (
                      <span className="text-sm text-muted-foreground">
                        {person.currentCompany}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    {person.connected ? (
                      <Badge className="cursor-default bg-blue-500 hover:bg-blue-600 transition-colors">
                        Connected
                      </Badge>
                    ) : person.connectionDegree > 0 ? (
                      <Badge
                        variant="secondary"
                        className="cursor-default bg-blue-100 hover:bg-blue-200 text-blue-700 transition-colors dark:bg-blue-900 dark:text-blue-100 dark:hover:bg-blue-800"
                      >
                        {getConnectionLabel(person.connectionDegree)} connection
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="cursor-default transition-colors border-blue-200 dark:border-blue-800"
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
                          ? "border-red-200 text-red-700 dark:border-red-800 dark:text-red-300"
                          : "border-blue-200 text-blue-700 dark:border-blue-800 dark:text-blue-300"
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
