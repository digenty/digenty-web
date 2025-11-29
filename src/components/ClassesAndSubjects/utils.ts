export const toOrdinal = (num: number) => {
  const suffix = ["th", "st", "nd", "rd"],
    lastTwoDigits = num % 100;
  return num + (suffix[(lastTwoDigits - 20) % 10] || suffix[lastTwoDigits] || suffix[0]);
};
