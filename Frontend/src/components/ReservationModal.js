import { getSession } from "@/services/auth.service";
import { createReservations, updateReservation } from "@/services/reservation.service";
import { getScreenings, updateScreening } from "@/services/screening.service";
import { homeController } from "@/controllers/home.controller";

function modalHtml(reservation, screenings) {
  const isEdit = !!reservation;
  const available = screenings?.filter(s => s.status === "activa" && s.availableSpots > 0) || [];
  const screeningOptions = available.length ? `
    <div class="mb-4 p-3 bg-slate-50 rounded border">
      <label class="block text-sm font-medium text-slate-700 mb-2">Seleccionar función de cine</label>
      <select id="screeningSelect" class="border w-full p-2 rounded">
        <option value="">-- Elegir función (autocompleta) --</option>
        ${available.map(s => `<option value="${s.id}" data-movie="${s.movie}" data-room="${s.room}" data-date="${s.date}" data-start="${s.startTime}" data-end="${s.endTime}">${s.movie} - ${s.room} - ${s.date} ${s.startTime} (Cupos: ${s.availableSpots}/${s.totalCapacity}) - $${s.price}</option>`).join("")}
      </select>
    </div>
  ` : `<p class="text-sm text-red-500 mb-4">No hay funciones disponibles con cupos en este momento.</p>`;

  return `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div class="bg-white rounded-lg shadow-lg w-full max-w-lg mx-4 p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold">${isEdit ? "Editar Reserva" : "Nueva Reserva"}</h2>
          <button id="closeModalBtn" class="text-slate-500 hover:text-slate-800 text-2xl leading-none cursor-pointer">&times;</button>
        </div>
        <form id="createReservationForm">
          ${isEdit ? "" : screeningOptions}
          <input type="hidden" name="screeningId" value="">
          <div class="mb-3">
            <label class="block text-sm font-medium text-slate-700 mb-1">Película</label>
            <input type="text" name="movie" class="border w-full p-2 rounded" value="${isEdit && reservation.movie ? reservation.movie : ""}" placeholder="Nombre de la película (opcional)">
          </div>
          <div class="mb-3">
            <label class="block text-sm font-medium text-slate-700 mb-1">Sala</label>
            <select name="workspace" class="border w-full p-2 rounded" required>
              <option value="">Selecciona una sala</option>
              ${["Sala A", "Sala B", "Sala C", "Sala D"].map(r => `<option value="${r}" ${isEdit && reservation.workspace === r ? "selected" : ""}>${r}</option>`).join("")}
            </select>
          </div>
          <div class="mb-3">
            <label class="block text-sm font-medium text-slate-700 mb-1">Fecha</label>
            <input type="date" name="date" class="border w-full p-2 rounded" value="${isEdit ? reservation.date : ""}" required>
          </div>
          <div class="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Hora inicio</label>
              <input type="time" name="startHour" class="border w-full p-2 rounded" value="${isEdit ? reservation.startHour : ""}" required>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Hora fin</label>
              <input type="time" name="endHour" class="border w-full p-2 rounded" value="${isEdit ? reservation.endHour : ""}" required>
            </div>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-slate-700 mb-1">Motivo</label>
            <textarea name="reason" rows="3" class="border w-full p-2 rounded" placeholder="Describe el motivo de la reserva" required>${isEdit ? reservation.reason : ""}</textarea>
          </div>
          <button type="submit" class="${isEdit ? "bg-blue-600 hover:bg-blue-700" : "bg-green-600 hover:bg-green-700"} text-white w-full py-2 rounded cursor-pointer transition-colors font-medium">${isEdit ? "Guardar Cambios" : "Crear Reserva"}</button>
        </form>
      </div>
    </div>
  `;
}

function attachModal(modalEl) {
  const close = () => modalEl.remove();
  modalEl.querySelector("#closeModalBtn").addEventListener("click", close);
  modalEl.addEventListener("click", (e) => { if (e.target === modalEl) close(); });
  return close;
}

export async function ReservationModal() {
  const screenings = await getScreenings();
  const modal = document.createElement("div");
  modal.id = "createReservationModal";
  modal.innerHTML = modalHtml(null, screenings);
  document.body.appendChild(modal);

  const close = attachModal(modal);
  const form = modal.querySelector("#createReservationForm");
  const screeningSelect = modal.querySelector("#screeningSelect");

  if (screeningSelect) {
    screeningSelect.addEventListener("change", () => {
      const opt = screeningSelect.selectedOptions[0];
      if (opt?.value) {
        form.screeningId.value = opt.value;
        form.movie.value = opt.dataset.movie;
        form.workspace.value = opt.dataset.room;
        form.date.value = opt.dataset.date;
        form.startHour.value = opt.dataset.start;
        form.endHour.value = opt.dataset.end;
      }
    });
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const user = getSession();
    const formData = new FormData(form);
    const screeningId = formData.get("screeningId");

    if (screeningId) {
      const fresh = await getScreenings();
      const screening = fresh.find(s => s.id === screeningId);
      if (!screening || screening.status !== "activa") { alert("Esta función ya no está disponible."); close(); homeController(); return; }
      if (screening.availableSpots <= 0) { alert("No hay cupos disponibles para esta función."); close(); homeController(); return; }
    }

    const reservation = {
      userId: user.id,
      screeningId,
      movie: formData.get("movie"),
      workspace: formData.get("workspace"),
      date: formData.get("date"),
      startHour: formData.get("startHour"),
      endHour: formData.get("endHour"),
      reason: formData.get("reason"),
      status: "pending",
    };

    const response = await createReservations(reservation);
    if (response?.ok) {
      if (screeningId) {
        const fresh = await getScreenings();
        const s = fresh.find(s => s.id === screeningId);
        if (s && s.availableSpots > 0) { s.availableSpots--; await updateScreening(s.id, s); }
      }
      alert("Reserva creada exitosamente");
      close();
      homeController();
    } else {
      alert("Error al crear la reserva");
    }
  });
}

export function editReservationModal(reservation) {
  const modal = document.createElement("div");
  modal.id = "editReservationModal";
  modal.innerHTML = modalHtml(reservation, []);
  document.body.appendChild(modal);

  const close = attachModal(modal);
  const form = modal.querySelector("#createReservationForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const updated = {
      ...reservation,
      movie: formData.get("movie"),
      workspace: formData.get("workspace"),
      date: formData.get("date"),
      startHour: formData.get("startHour"),
      endHour: formData.get("endHour"),
      reason: formData.get("reason"),
    };

    const response = await updateReservation(reservation.id, updated);
    if (response?.ok) {
      alert("Reserva actualizada exitosamente");
      close();
      homeController();
    } else {
      alert("Error al actualizar la reserva");
    }
  });
}
