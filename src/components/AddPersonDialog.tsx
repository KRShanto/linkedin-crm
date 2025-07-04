"use client";

import { useState, useTransition } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createPerson } from "@/actions/people";
import { ContactStatus } from "@/lib/types";
import { Plus, X, Loader2 } from "lucide-react";
import { ProgressSelect } from "@/components/ui/progress-select";
import { usePeopleStore } from "@/stores/peopleStore";

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

export function AddPersonDialog() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [newWebsite, setNewWebsite] = useState("");
  const { addPerson } = usePeopleStore();
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

  function handleSubmit() {
    startTransition(async () => {
      try {
        const person = await createPerson(formData);
        if (person) {
          // Add to the store immediately for instant feedback
          addPerson(person);

          setOpen(false);
          setFormData({
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
        }
      } catch (error) {
        console.error("Failed to create person:", error);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer transition-all hover:scale-105 bg-blue-500 hover:bg-blue-600 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add Contact
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px] max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-blue-700 dark:text-blue-400">
            Add New Contact
          </DialogTitle>
          <DialogDescription>
            Add a new contact to your LinkedIn CRM
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-6 -mr-6">
          <div className="space-y-4">
            <div className="grid gap-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
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
                  value={formData.url}
                  onChange={(e) =>
                    setFormData({ ...formData, url: e.target.value })
                  }
                  className="col-span-3 transition-all focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500"
                  placeholder="https://linkedin.com/in/..."
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="profileImage" className="text-right">
                  Profile Image
                </Label>
                <Input
                  id="profileImage"
                  value={formData.profileImage}
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
                  value={formData.location}
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
                  value={formData.headline}
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
                  value={formData.about}
                  onChange={(e) =>
                    setFormData({ ...formData, about: e.target.value })
                  }
                  className="col-span-3 min-h-[100px] transition-all focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500"
                />
              </div>
              <Separator className="my-2" />
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="currentPosition" className="text-right">
                  Position
                </Label>
                <Input
                  id="currentPosition"
                  value={formData.currentPosition}
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
                  value={formData.currentCompany}
                  onChange={(e) =>
                    setFormData({ ...formData, currentCompany: e.target.value })
                  }
                  className="col-span-3 transition-all focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500"
                />
              </div>
              <Separator className="my-2" />
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
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
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="col-span-3 transition-all focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500"
                />
              </div>
              <Separator className="my-2" />
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right pt-2">Websites</Label>
                <div className="col-span-3 space-y-2">
                  {formData.websites?.map((website, index) => (
                    <div key={index} className="flex items-center gap-2 group">
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
              <Separator className="my-2" />
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="connection" className="text-right">
                  Connection
                </Label>
                <div className="col-span-3">
                  <Select
                    value={
                      formData.connected
                        ? "connected"
                        : formData.connectionDegree.toString()
                    }
                    onValueChange={(value) => {
                      if (value === "connected") {
                        setFormData({
                          ...formData,
                          connected: true,
                          connectionDegree: 1,
                        });
                      } else {
                        const degree = parseInt(value);
                        setFormData({
                          ...formData,
                          connected: degree === 1,
                          connectionDegree: degree,
                        });
                      }
                    }}
                  >
                    <SelectTrigger className="transition-all focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500">
                      <SelectValue placeholder="Select connection status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="connected">
                        Directly Connected
                      </SelectItem>
                      <SelectItem value="1">1st degree connection</SelectItem>
                      <SelectItem value="2">2nd degree connection</SelectItem>
                      <SelectItem value="3">3rd degree connection</SelectItem>
                      <SelectItem value="0">Out of network</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Separator className="my-2" />
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
          </div>
        </div>

        <DialogFooter>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isPending}
            className="cursor-pointer transition-all hover:scale-105 bg-gradient-to-r from-blue-500 to-blue-600 text-white"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Adding...
              </>
            ) : (
              "Add Contact"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
