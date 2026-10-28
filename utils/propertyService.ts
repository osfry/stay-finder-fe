import type { Property, PropertyKind } from "@/types/property";

export type PropertiesFilter = {
  location?: string;
  maxPrice?: number;
  guests?: number;
};

export type CreatePropertyState = {
  error?: string;
  propertyId?: string;
};

const kinds: PropertyKind[] = ["apartment", "villa"];

function isPropertyKind(value: string): value is PropertyKind {
  return kinds.includes(value as PropertyKind);
}

export async function getProperties({
  location,
  maxPrice,
  guests,
}: PropertiesFilter = {}): Promise<Property[]> {
  const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND_URL}/properties/`);
  if (location) {
    url.searchParams.append("location", location);
  }
  try {
    const response = await fetch(url);
    const properties: Property[] = await response.json();
    return properties.filter(
      (p) =>
        (maxPrice === undefined || p.price_per_night <= maxPrice) &&
        (guests === undefined || p.max_guests >= guests),
    );
  } catch (e) {
    return [];
  }
}

export async function getMyProperties(): Promise<Property[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/properties/mine`,
      { credentials: "include" },
    );
    if (!response.ok) {
      return [];
    }
    return await response.json();
  } catch {
    return [];
  }
}

export async function getPropertyById(id: string): Promise<Property | null> {
  try {
    const url = new URL(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/properties/${id}`,
    );
    const response = await fetch(url);
    if (!response.ok) {
      return null;
    }
    const property: Property = await response.json();
    return property;
  } catch {
    return null;
  }
}

export async function updateProperty(
  id: string,
  formData: FormData,
): Promise<CreatePropertyState> {
  const kind = String(formData.get("kind") ?? "");
  if (!isPropertyKind(kind)) {
    return { error: "Choose apartment or villa." };
  }
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/properties/${id}`,
    {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: String(formData.get("title") ?? "").trim(),
        description: String(formData.get("description") ?? "").trim(),
        location: String(formData.get("location") ?? "").trim(),
        kind,
        max_guests: Number(formData.get("max_guests")),
        price_per_night: Number(formData.get("price_per_night")),
      }),
    },
  );

  if (response.status === 401) {
    return { error: "You need to be signed in to edit a stay." };
  }
  if (!response.ok) {
    return { error: "Could not update the stay. Check the fields and try again." };
  }
  return { propertyId: id };
}

export async function deleteProperty(id: string): Promise<boolean> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/properties/${id}`,
      { method: "DELETE", credentials: "include" },
    );
    return response.ok;
  } catch {
    return false;
  }
}

export async function createProperty(
  formData: FormData,
): Promise<CreatePropertyState> {
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const kind = String(formData.get("kind") ?? "");
  const maxGuests = Number(formData.get("max_guests"));
  const pricePerNight = Number(formData.get("price_per_night"));

  if (!isPropertyKind(kind)) {
    return { error: "Choose apartment or villa." };
  }
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/properties/`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
        location,
        kind,
        max_guests: maxGuests,
        price_per_night: pricePerNight,
      }),
    },
  );

  if (response.status === 401) {
    return { error: "You need to be signed in to list a stay." };
  }

  if (!response.ok) {
    return {
      error: "Could not create the stay. Check the fields and try again.",
    };
  }

  const property: Property = await response.json();
  return { propertyId: property.property_id };
}
