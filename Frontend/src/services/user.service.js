import { getJson } from "./http";

export const getUsers = () => getJson("/users");
