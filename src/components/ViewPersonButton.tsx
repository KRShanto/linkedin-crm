"use client";

import { useState, useTransition } from "react";
import { getPerson, updatePerson, deletePerson } from "@/actions/people";
import type { Person } from "@/lib/types";
import { ContactStatus } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { X, Loader2 } from "lucide-react";
import { ProgressSelect } from "@/components/ui/progress-select";
import { usePeopleStore } from "@/stores/peopleStore";

interface ViewPersonButtonProps {
  personId: string;
}

type FormData = {
  name: string;
  url: string;
  profileImage: string;
  location: string;
  headline: string;
  about: string;
  currentPosition: string;
  currentCompany: string;
  email: string;
  phone: string;
  websites: string[];
  connected: boolean;
  connectionDegree: number;
  status: ContactStatus;
};

const statusOptions = Object.entries(ContactStatus).map(([, value]) => {
  const match = value.match(/\((\d+)\/(\d+)\)/);
  return {
    value,
    label: value,
    ...(match ? { step: parseInt(match[1]), total: parseInt(match[2]) } : {}),
  };
});

export function ViewPersonButton({ personId }: ViewPersonButtonProps) {
  const [open, setOpen] = useState(false);
  const [person, setPerson] = useState<Person | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const {
    updatePerson: updatePersonInStore,
    deletePerson: deletePersonFromStore,
  } = usePeopleStore();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    url: "",
    profileImage: "",
    location: "",
    headline: "",
    about: "",
    currentPosition: "",
    currentCompany: "",
    email: "",
    phone: "",
    websites: [],
    connected: false,
    connectionDegree: 0,
    status: ContactStatus.NOT_STARTED,
  });
  const [newWebsite, setNewWebsite] = useState("");

  function getConnectionLabel(degree: number) {
    if (degree === 1) return "1st";
    if (degree === 2) return "2nd";
    if (degree === 3) return "3rd";
    return `${degree}th`;
  }

  async function fetchPersonData() {
    setIsLoading(true);
    setPerson(null); // Clear previous data

    try {
      const data = await getPerson(personId);
      setPerson(data);
      if (data) {
        setFormData({
          name: data.name || "",
          url: data.url || "",
          profileImage: data.profileImage || "",
          location: data.location || "",
          headline: data.headline || "",
          about: data.about || "",
          currentPosition: data.currentPosition || "",
          currentCompany: data.currentCompany || "",
          email: data.email || "",
          phone: data.phone || "",
          websites: data.websites || [],
          connected: data.connected,
          connectionDegree: data.connectionDegree,
          status: data.status || ContactStatus.NOT_STARTED,
        });
      }
    } catch (error) {
      console.error("Failed to fetch person data:", error);
    } finally {
      setIsLoading(false);
    }
  }

  function handleDialogChange(open: boolean) {
    setOpen(open);
    if (open) {
      // Reset states and fetch data when opening
      setIsEditing(false);
      fetchPersonData();
    }
    // When closing, let the content persist during the closing animation
  }

  function addWebsite(e: React.FormEvent) {
    e.preventDefault();
    if (newWebsite.trim()) {
      setFormData({
        ...formData,
        websites: [...formData.websites, newWebsite.trim()],
      });
      setNewWebsite("");
    }
  }

  function removeWebsite(index: number) {
    setFormData({
      ...formData,
      websites: formData.websites.filter((_, i) => i !== index),
    });
  }

  function handleUpdate() {
    if (!person) return;

    startTransition(async () => {
      try {
        const updated = await updatePerson(person.id, formData);
        if (updated) {
          // Update the store immediately for instant feedback
          updatePersonInStore(person.id, updated);

          setIsEditing(false);
          setPerson(updated);
          setOpen(false);
        }
      } catch (error) {
        console.error("Failed to update person:", error);
      }
    });
  }

  function handleDelete() {
    if (!person) return;

    startTransition(async () => {
      try {
        await deletePerson(person.id);

        // Remove from store immediately for instant feedback
        deletePersonFromStore(person.id);

        setOpen(false);
      } catch (error) {
        console.error("Failed to delete person:", error);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="cursor-pointer hover:border-blue-500/50 hover:bg-blue-50 dark:hover:bg-blue-900/20"
        >
          View
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px] max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-blue-700 dark:text-blue-400">
            {isLoading
              ? "Loading..."
              : isEditing
              ? "Edit Contact"
              : "Contact Details"}
          </DialogTitle>
          <DialogDescription>
            {isLoading
              ? "Fetching contact information..."
              : isEditing
              ? "Edit contact information below."
              : open
              ? "View contact details and make changes if needed."
              : ""}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-6 -mr-6">
          <div className="space-y-4">
            {isLoading ? (
              // Loading skeleton
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="h-24 w-24 rounded-full bg-zinc-200 dark:bg-zinc-700 animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-6 w-48 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse"></div>
                    <div className="h-4 w-36 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse"></div>
                    <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse"></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-4 w-20 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse"></div>
                      <div className="h-4 w-full bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse"></div>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-16 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse"></div>
                  <div className="space-y-1">
                    <div className="h-4 w-full bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse"></div>
                    <div className="h-4 w-3/4 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            ) : !person && open ? (
              // Error or no data state (only show when modal should be open)
              <div className="flex items-center justify-center py-8">
                <p className="text-zinc-600 dark:text-zinc-400">
                  Failed to load contact information
                </p>
              </div>
            ) : isEditing ? (
              <div className="grid gap-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={formData.name || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="col-span-3 transition-all focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="url" className="text-right">
                    LinkedIn URL
                  </Label>
                  <Input
                    id="url"
                    value={formData.url || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, url: e.target.value })
                    }
                    className="col-span-3 transition-all focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500"
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="profileImage" className="text-right">
                    Profile Image URL
                  </Label>
                  <Input
                    id="profileImage"
                    value={formData.profileImage || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, profileImage: e.target.value })
                    }
                    className="col-span-3 transition-all focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500"
                    placeholder="https://..."
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="location" className="text-right">
                    Location
                  </Label>
                  <Input
                    id="location"
                    value={formData.location || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    className="col-span-3 transition-all focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="headline" className="text-right">
                    Headline
                  </Label>
                  <Input
                    id="headline"
                    value={formData.headline || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, headline: e.target.value })
                    }
                    className="col-span-3 transition-all focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="about" className="text-right">
                    About
                  </Label>
                  <Textarea
                    id="about"
                    value={formData.about || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, about: e.target.value })
                    }
                    className="col-span-3 min-h-[100px] transition-all focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500"
                  />
                </div>
                <Separator />
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="currentPosition" className="text-right">
                    Position
                  </Label>
                  <Input
                    id="currentPosition"
                    value={formData.currentPosition || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        currentPosition: e.target.value,
                      })
                    }
                    className="col-span-3 transition-all focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="currentCompany" className="text-right">
                    Company
                  </Label>
                  <Input
                    id="currentCompany"
                    value={formData.currentCompany || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        currentCompany: e.target.value,
                      })
                    }
                    className="col-span-3 transition-all focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500"
                  />
                </div>
                <Separator />
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="col-span-3 transition-all focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right">
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="col-span-3 transition-all focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500"
                  />
                </div>
                <Separator />
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label className="text-right pt-2">Websites</Label>
                  <div className="col-span-3 space-y-2">
                    {formData.websites?.map((website, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 group"
                      >
                        <span className="flex-1 text-sm">{website}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeWebsite(index)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:text-blue-600 hover:bg-blue-50"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <Input
                        value={newWebsite}
                        onChange={(e) => setNewWebsite(e.target.value)}
                        placeholder="Enter website URL"
                        className="transition-all focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500"
                      />
                      <Button
                        type="button"
                        onClick={addWebsite}
                        size="sm"
                        className="cursor-pointer transition-all hover:scale-105 bg-blue-500 hover:bg-blue-600 text-white"
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="connected" className="text-right">
                    Connection
                  </Label>
                  <div className="col-span-3 space-y-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="connected"
                        checked={formData.connected || false}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            connected: e.target.checked,
                            connectionDegree: e.target.checked
                              ? 1
                              : formData.connectionDegree,
                          })
                        }
                        className="h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500/20"
                      />
                      <Label htmlFor="connected" className="font-normal">
                        Directly Connected
                      </Label>
                    </div>
                    {!formData.connected && (
                      <div className="flex items-center gap-4">
                        <Label
                          htmlFor="connectionDegree"
                          className="whitespace-nowrap"
                        >
                          Connection Degree:
                        </Label>
                        <select
                          id="connectionDegree"
                          value={formData.connectionDegree || 0}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              connectionDegree: parseInt(e.target.value),
                              connected: parseInt(e.target.value) === 1,
                            })
                          }
                          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-all focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="0">Out of network</option>
                          <option value="1">1st degree</option>
                          <option value="2">2nd degree</option>
                          <option value="3">3rd degree</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>
                <Separator />
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    Status
                  </Label>
                  <div className="col-span-3">
                    <ProgressSelect
                      value={formData.status}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          status: value as ContactStatus,
                        })
                      }
                      options={statusOptions}
                    />
                  </div>
                </div>
              </div>
            ) : (
              person && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    {person.profileImage && (
                      <img
                        src={person.profileImage}
                        alt={person.name || "Profile"}
                        className="h-24 w-24 rounded-full object-cover ring-2 ring-blue-200 dark:ring-blue-500/20"
                      />
                    )}
                    <div>
                      <h3 className="text-xl font-medium">{person.name}</h3>
                      <p className="text-muted-foreground">{person.headline}</p>
                      {person.url && (
                        <a
                          href={person.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:underline cursor-pointer mt-1 block"
                        >
                          View LinkedIn Profile
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <Label className="text-muted-foreground">Location</Label>
                      <p className="mt-1">{person.location}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">
                        Current Position
                      </Label>
                      <p className="mt-1">{person.currentPosition}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">
                        Current Company
                      </Label>
                      <p className="mt-1">{person.currentCompany}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">
                        Connection Status
                      </Label>
                      <p className="mt-1">
                        {person.connected ? (
                          <Badge className="bg-blue-500 hover:bg-blue-600">
                            Connected
                          </Badge>
                        ) : person.connectionDegree > 0 ? (
                          <Badge
                            variant="secondary"
                            className="bg-blue-100 hover:bg-blue-200 text-blue-700 dark:bg-blue-900 dark:text-blue-100 dark:hover:bg-blue-800"
                          >
                            {getConnectionLabel(person.connectionDegree)}{" "}
                            connection
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="border-blue-200 dark:border-blue-800"
                          >
                            Out of network
                          </Badge>
                        )}
                      </p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Email</Label>
                      <p className="mt-1">{person.email}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Phone</Label>
                      <p className="mt-1">{person.phone}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Status</Label>
                      <div className="mt-1">
                        <ProgressSelect
                          value={person.status}
                          options={statusOptions}
                          disabled
                          showProgress={false}
                        />
                      </div>
                    </div>
                  </div>
                  {person.about && (
                    <div>
                      <Label className="text-muted-foreground">About</Label>
                      <p className="mt-1 whitespace-pre-wrap">{person.about}</p>
                    </div>
                  )}
                  {person.websites && person.websites.length > 0 && (
                    <div>
                      <Label className="text-muted-foreground">Websites</Label>
                      <div className="mt-2 space-y-1">
                        {person.websites.map((website, index) => (
                          <a
                            key={index}
                            href={website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:underline cursor-pointer"
                          >
                            {website}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            )}
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0 mt-6">
          {!isLoading && (
            <>
              {isEditing ? (
                <div className="flex gap-3 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    className="cursor-pointer transition-all hover:bg-blue-50"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleUpdate}
                    disabled={isPending}
                    className="cursor-pointer transition-all hover:scale-105 bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </div>
              ) : person ? (
                <div className="flex gap-3 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(true)}
                    className="cursor-pointer transition-all hover:bg-blue-50"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={handleDelete}
                    disabled={isPending}
                    className="cursor-pointer transition-all hover:scale-105 bg-gradient-to-r from-red-500 to-red-600 text-white"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      "Delete"
                    )}
                  </Button>
                </div>
              ) : (
                <div className="flex gap-3 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setOpen(false)}
                    className="cursor-pointer transition-all hover:bg-blue-50"
                  >
                    Close
                  </Button>
                </div>
              )}
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
