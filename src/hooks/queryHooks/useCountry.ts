import { getCountries } from "@/app/actions/country";
import { countryKey } from "@/queries/country";
import { useQuery } from "@tanstack/react-query";

export const useGetCountries = () => {
  return useQuery({
    queryKey: countryKey.countries,
    queryFn: getCountries,
  });
};
