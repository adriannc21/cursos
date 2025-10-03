export const setCurrentLanguage = (language) => {
  localStorage.setItem("language", language);
};

export const getCurrentLanguage = () => {
  return localStorage.getItem("language") || "es";
};
