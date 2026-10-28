import PropertyCard from "./PropertyCard";
import { getProperties, PropertiesFilter } from "@/utils/propertyService";
import PropertyFilter from "./PropertyFilter";
import T from "./typography";

type PropertyListProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function PropertyList({
  searchParams,
}: PropertyListProps) {
  const params = await searchParams;
  const location = params.location?.toString() || "";
  const toNumber = (value: string | string[] | undefined) => {
    const n = parseFloat(value?.toString() ?? "");
    return Number.isFinite(n) ? n : undefined;
  };
  const propertiesFilter: PropertiesFilter = {
    location,
    maxPrice: toNumber(params.maxPrice),
    guests: toNumber(params.guests),
  };
  const properties = await getProperties(propertiesFilter);
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <T.Header size="lg">Places to stay</T.Header>
        <PropertyFilter filter={propertiesFilter} />
      </div>
      <div className="flex flex-col gap-3">
        {properties.map((property) => (
          <PropertyCard key={property.property_id} property={property} />
        ))}
      </div>
    </div>
  );
}
