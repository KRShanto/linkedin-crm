import { getPeople } from "@/actions/people";
import { ViewPersonButton } from "@/components/ViewPersonButton";
import { AddPersonDialog } from "@/components/AddPersonDialog";
import { People } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

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
              <TableHead className="font-semibold">Name</TableHead>
              <TableHead className="font-semibold">Location</TableHead>
              <TableHead className="font-semibold">Current Position</TableHead>
              <TableHead className="font-semibold">Connection</TableHead>
              <TableHead className="font-semibold">Profile</TableHead>
              <TableHead className="text-right font-semibold">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {people.map((person: People) => (
              <TableRow
                key={person.id}
                className="group transition-colors hover:bg-blue-50/50 dark:hover:bg-blue-950/50"
              >
                <TableCell>
                  {person.url ? (
                    <a
                      href={person.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 hover:opacity-80 cursor-pointer group/name"
                    >
                      {person.profileImage && (
                        <img
                          src={person.profileImage}
                          alt={person.name || "Profile"}
                          className="h-10 w-10 rounded-full object-cover ring-2 ring-blue-200 transition-all group-hover/name:ring-blue-400 dark:ring-blue-500/20 dark:group-hover/name:ring-blue-500/40"
                        />
                      )}
                      <span className="group-hover/name:text-blue-600 dark:group-hover/name:text-blue-400 transition-colors">
                        {person.name}
                      </span>
                    </a>
                  ) : (
                    <div className="flex items-center gap-3">
                      {person.profileImage && (
                        <img
                          src={person.profileImage}
                          alt={person.name || "Profile"}
                          className="h-10 w-10 rounded-full object-cover ring-2 ring-blue-200 dark:ring-blue-500/20"
                        />
                      )}
                      <span>{person.name}</span>
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {person.location}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>{person.currentPosition}</span>
                    {person.currentCompany && (
                      <span className="text-sm text-muted-foreground">
                        {person.currentCompany}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
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
                <TableCell>
                  {person.url ? (
                    <a
                      href={person.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:underline cursor-pointer transition-colors"
                    >
                      LinkedIn
                    </a>
                  ) : (
                    <span className="text-muted-foreground">No URL</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
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
