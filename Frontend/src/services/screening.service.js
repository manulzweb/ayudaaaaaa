import { getJson, postJson, putJson, deleteReq } from "./http";

export const getScreenings = () => getJson("/screenings");
export const createScreening = (data) => postJson("/screenings", data);
export const updateScreening = (id, data) => putJson(`/screenings/${id}`, data);
export const deleteScreening = (id) => deleteReq(`/screenings/${id}`);
