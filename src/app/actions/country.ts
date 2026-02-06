export const getCountries = async () => {
  const response = await fetch(`/api/countries`);
  try {
    const data = await response.json();
    if (data) {
      console.log(data);
      return data.countries;
    } else {
      return [];
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return [];
  }
};

export const getStatesForCountry = async (code: string) => {
  const response = await fetch(`/api/states?code=${code}`);
  try {
    const data = await response.json();
    if (data) {
      return data.states;
    } else {
      return [];
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return [];
  }
};
