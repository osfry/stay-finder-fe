"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { PropertiesFilter } from "@/utils/propertyService";

type FilterKey = "location" | "maxPrice" | "guests";

const options: Record<
  FilterKey,
  { label: string; placeholder: string; type: "text" | "number" }
> = {
  location: { label: "Location", placeholder: "Location", type: "text" },
  maxPrice: { label: "Max price", placeholder: "Max price per night", type: "number" },
  guests: { label: "Number of guests", placeholder: "Number of guests", type: "number" },
};

const fieldClass =
  "rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-zinc-300";

type PropertyFilterProps = {
  filter: PropertiesFilter;
};

export default function PropertyFilter({ filter }: PropertyFilterProps) {
  const router = useRouter();
  const [active, setActive] = useState<FilterKey>("location");
  const [values, setValues] = useState<Record<FilterKey, string>>({
    location: filter.location ?? "",
    maxPrice: filter.maxPrice?.toString() ?? "",
    guests: filter.guests?.toString() ?? "",
  });

  const onFiltering = () => {
    const params = new URLSearchParams();
    (Object.keys(values) as FilterKey[]).forEach((key) => {
      const value = values[key].trim();
      if (value) {
        params.set(key, value);
      }
    });
    const query = params.toString();
    router.push(query ? `/?${query}` : "/");
  };

  const option = options[active];

  return (
    <form
      className="flex gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        onFiltering();
      }}
    >
      <select
        value={active}
        onChange={(e) => setActive(e.target.value as FilterKey)}
        className={fieldClass}
      >
        {(Object.keys(options) as FilterKey[]).map((key) => (
          <option key={key} value={key}>
            {options[key].label}
          </option>
        ))}
      </select>
      <input
        key={active}
        type={option.type}
        min={option.type === "number" ? 1 : undefined}
        value={values[active]}
        placeholder={option.placeholder}
        onChange={(e) => setValues({ ...values, [active]: e.target.value })}
        className={`w-full ${fieldClass}`}
      />
      <button
        type="submit"
        className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
      >
        Filter
      </button>
    </form>
  );
}
