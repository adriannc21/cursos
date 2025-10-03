let logoutCallback = null;

export const registerLogout = (fn) => {
  logoutCallback = fn;
};

export const triggerLogout = () => {
  if (logoutCallback) logoutCallback();
  else console.warn("❌ Logout no registrado aún");
};
