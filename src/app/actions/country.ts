export const getCountries = async () => {
  try {
    const response = await fetch(`/api/countries`);
    const data = await response.json();
    if (data && data.countries) {
      return data.countries;
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error in getCountries action:", error);
    return [];
  }
};
