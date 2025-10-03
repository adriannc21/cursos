export const setCurrentCountry = (newCountry) => {
  localStorage.setItem("country", newCountry);
};

export const getCurrentCountry = () => {
  return localStorage.getItem("country") || "PE";
};
