"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function getPeople() {
  return await prisma.people.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getPerson(id: string) {
  return await prisma.people.findUnique({
    where: { id },
  });
}

export async function createPerson(data: Prisma.PeopleCreateInput) {
  // If connectionDegree is 1, automatically set connected to true
  if (data.connectionDegree === 1) {
    data.connected = true;
  }
  // If connected is true, automatically set connectionDegree to 1
  if (data.connected) {
    data.connectionDegree = 1;
  }
  // If not connected and no degree specified, set to 0 (out of network)
  if (!data.connected && !data.connectionDegree) {
    data.connectionDegree = 0;
  }

  const person = await prisma.people.create({
    data,
  });

  revalidatePath("/crm");
  return person;
}

export async function updatePerson(id: string, data: Prisma.PeopleUpdateInput) {
  // If connectionDegree is 1, automatically set connected to true
  if (data.connectionDegree === 1) {
    data.connected = true;
  }
  // If connected is true, automatically set connectionDegree to 1
  if (data.connected) {
    data.connectionDegree = 1;
  }
  // If not connected and no degree specified, set to 0 (out of network)
  if (!data.connected && !data.connectionDegree) {
    data.connectionDegree = 0;
  }

  const person = await prisma.people.update({
    where: { id },
    data,
  });

  revalidatePath("/crm");
  return person;
}

export async function deletePerson(id: string) {
  await prisma.people.delete({
    where: { id },
  });

  revalidatePath("/crm");
}
