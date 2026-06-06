import ReservationCard from "@/components/ReservationCard";
import { getReservations, updateReservation, deleteReservation } from "@/services/reservation.service";
import { getScreenings, updateScreening } from "@/services/screening.service";
import { getSession } from "@/services/auth.service";
import { editReservationModal } from "@/components/ReservationModal";

let isManaging = false;
let manageBtn = null;
let manageIndicator = null;

async function findReservation(id) {
  const all = await getReservations();
  return all.find(r => r.id === id);
}

async function restoreSpot(reservation) {
  if (!reservation?.screeningId) return;
  const screenings = await getScreenings();
  const screening = screenings.find(s => s.id === reservation.screeningId);
  if (screening) {
    screening.availableSpots++;
    await updateScreening(screening.id, screening);
  }
}

export const homeController = async () => {
  const container = document.querySelector("#reservationsContainer");
  const user = getSession();

  const reservations = user.role === "admin" ? await getReservations() : await getReservations(user.id);

  container.innerHTML = reservations.length
    ? reservations.map(r => ReservationCard(r, isManaging, user.id)).join("")
    : `<div class="w-full text-center py-8 col-span-2"><p class="text-slate-500">No hay reservas disponibles</p></div>`;

  if (user.role === "admin") setupAdminActions(container);
  else setupUserActions(container);
};

export function toggleManageMode() {
  isManaging = !isManaging;
  if (manageBtn) {
    manageBtn.textContent = isManaging ? "Salir de Gestión" : "Gestionar Reservas";
    manageBtn.classList.toggle("bg-blue-600", !isManaging);
    manageBtn.classList.toggle("bg-orange-600", isManaging);
  }
  if (manageIndicator) {
    manageIndicator.textContent = isManaging ? "Modo gestión activado" : "Mostrando todas las reservas";
    manageIndicator.classList.toggle("text-orange-500", isManaging);
    manageIndicator.classList.toggle("text-slate-500", !isManaging);
  }
  homeController();
}

export function setManageElements(btn, indicator) {
  manageBtn = btn;
  manageIndicator = indicator;
}

function setupUserActions(container) {
  if (container.dataset.userSetup) return;
  container.dataset.userSetup = "1";

  container.addEventListener("click", async (e) => {
    const btn = e.target.closest("[data-action]");
    if (!btn) return;
    const { id, action } = btn.dataset;

    if (action === "userCancel" && confirm("¿Cancelar esta reserva?")) {
      const reservation = await findReservation(id);
      if (!reservation) return;
      reservation.status = "cancelled";
      await updateReservation(id, reservation);
      await restoreSpot(reservation);
      homeController();
    } else if (action === "userEdit") {
      const reservation = await findReservation(id);
      if (!reservation) return;
      if (new Date(`${reservation.date}T${reservation.startHour}`) <= new Date()) {
        alert("No puedes modificar una reserva cuya función ya comenzó.");
        return;
      }
      editReservationModal(reservation);
    }
  });
}

function setupAdminActions(container) {
  if (container.dataset.adminSetup) return;
  container.dataset.adminSetup = "1";

  container.addEventListener("click", async (e) => {
    const btn = e.target.closest("[data-action]");
    if (!btn) return;
    const { id, action } = btn.dataset;

    const reservation = await findReservation(id);
    if (!reservation) return;

    if (action === "approve" && confirm("¿Aprobar esta reserva?")) {
      reservation.status = "approved";
      await updateReservation(id, reservation);
      homeController();
    } else if (action === "cancel" && confirm("¿Cancelar esta reserva?")) {
      reservation.status = "cancelled";
      await updateReservation(id, reservation);
      await restoreSpot(reservation);
      homeController();
    } else if (action === "delete" && confirm("¿Eliminar esta reserva? Esta acción no se puede deshacer.")) {
      if (reservation.status !== "cancelled") await restoreSpot(reservation);
      await deleteReservation(id);
      homeController();
    } else if (action === "edit") {
      editReservationModal(reservation);
    }
  });
}
