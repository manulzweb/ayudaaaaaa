import loginView from "@/views/loginView";
import homeView from "@/views/homeView";

export const routes = {
  "/": { render: loginView, requiresAuth: false, redirectIfAuthenticated: true },
  "/home": { render: homeView, requiresAuth: true },
};
