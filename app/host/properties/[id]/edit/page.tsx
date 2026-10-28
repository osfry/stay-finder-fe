"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AuthGate from "@/components/AuthGate";
import PropertyForm from "@/components/PropertyForm";
import T from "@/components/typography";
import { getPropertyById, updateProperty } from "@/utils/propertyService";
import type { Property } from "@/types/property";

export default function EditPropertyPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>();

  useEffect(() => {
    getPropertyById(id).then(setProperty);
  }, [id]);

  async function onUpdate(formData: FormData) {
    const result = await updateProperty(id, formData);
    if (result.propertyId) {
      router.push("/host/properties");
    }
    return result;
  }

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-10">
      <AuthGate action="edit this stay">
        <T.Header size="lg">Edit stay</T.Header>
        {property === undefined && <p>Loading...</p>}
        {property === null && <p>Property not found.</p>}
        {property && (
          <PropertyForm
            action={onUpdate}
            values={property}
            submitLabel="Save changes"
            pendingLabel="Saving…"
          />
        )}
      </AuthGate>
    </main>
  );
}
