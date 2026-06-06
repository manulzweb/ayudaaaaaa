export const saveSession = (user) => localStorage.setItem("user", JSON.stringify(user));
export const getSession = () => JSON.parse(localStorage.getItem("user"));
export const removeSession = () => localStorage.removeItem("user");
export const isAuthenticated = () => !!getSession();
export const isAdmin = () => getSession()?.role === "admin";
