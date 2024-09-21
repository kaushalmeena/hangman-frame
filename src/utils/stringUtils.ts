export const isAlphabetic = (str?: string | null) => {
  if (!str) return false;
  return /^[a-zA-Z]+$/.test(str);
};
