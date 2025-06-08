import { getPeople } from "@/actions/people";
import { CRMTable } from "@/components/CRMTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "LinkedIn CRM",
  description: "Manage your LinkedIn connections and prospects",
};

export const revalidate = 0;

export default async function CRMPage() {
  const people = await getPeople();
  return <CRMTable people={people} />;
}
