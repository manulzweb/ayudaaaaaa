import { getJson, postJson, putJson, deleteReq } from "./http";

export const getReservations = (userId) => getJson(userId ? `/reservations?userId=${userId}` : "/reservations");
export const createReservations = (data) => postJson("/reservations", data);
export const updateReservation = (id, data) => putJson(`/reservations/${id}`, data);
export const deleteReservation = (id) => deleteReq(`/reservations/${id}`);
