const KEY = "country_list";

export const getStoredCountries = () => {
  const raw = localStorage.getItem(KEY);
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setStoredCountries = (countries) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(countries));
  } catch (err) {
    console.error("Error guardando países en localStorage:", err);
  }
};

export const clearStoredCountries = () => {
  localStorage.removeItem(KEY);
};
