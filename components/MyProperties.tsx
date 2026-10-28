"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth";
import { getMyProperties, deleteProperty } from "@/utils/propertyService";
import type { Property } from "@/types/property";
import PropertyCard from "./PropertyCard";
import T from "./typography";

export default function MyProperties() {
  const { user, isPending } = useAuth();
  const [properties, setProperties] = useState<Property[]>();

  useEffect(() => {
    if (!user) {
      return;
    }
    getMyProperties().then(setProperties);
  }, [user]);

  const onDelete = async (property: Property) => {
    if (!window.confirm(`Delete "${property.title}"?`)) {
      return;
    }
    if (await deleteProperty(property.property_id)) {
      setProperties((prev) =>
        prev?.filter((p) => p.property_id !== property.property_id),
      );
    } else {
      window.alert("Could not delete the property.");
    }
  };

  if (isPending) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return (
      <p>
        <Link href="/auth/login" className="underline">
          Log in
        </Link>{" "}
        to see your properties.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <T.Header size="lg">My properties</T.Header>
        <Link
          href="/host/properties/new"
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
        >
          New property
        </Link>
      </div>
      {!properties && <p>Loading...</p>}
      {properties?.length === 0 && <p>You haven&apos;t created any properties yet.</p>}
      <div className="flex flex-col gap-3">
        {properties?.map((property) => (
          <div key={property.property_id} className="flex flex-col gap-2">
            <PropertyCard property={property} />
            <div className="flex gap-3 text-sm font-medium">
              <Link
                href={`/host/properties/${property.property_id}/edit`}
                className="hover:underline"
              >
                Edit
              </Link>
              <button
                type="button"
                onClick={() => onDelete(property)}
                className="text-red-600 hover:underline dark:text-red-400"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
