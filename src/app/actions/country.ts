import type { Country } from "@/components/StudentAndParent/types";

// Loaded straight from the bundled JSON instead of /api/countries: the data is static, and going through the
// network meant a failed request or a stale service-worker cache silently produced an empty country/state list.
// The dynamic import keeps the ~230KB file out of the main bundle until a form needs it.
export const getCountries = async (): Promise<Country[]> => {
  const mod = await import("@/constants/countries.json");
  return (mod.default ?? mod) as unknown as Country[];
};

const normalizeName = (name: string) => name.normalize("NFC").trim().toLowerCase();

/** Match a country by name, ignoring case, surrounding whitespace and unicode normalisation differences. */
export const findCountryByName = (countries: Country[], name?: string | null) => {
  if (!name) return undefined;
  const target = normalizeName(name);
  return countries.find(c => normalizeName(c.name) === target);
};
