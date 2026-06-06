import { getScreenings, createScreening, updateScreening, deleteScreening } from "@/services/screening.service";

const ROOMS = ["Sala A", "Sala B", "Sala C", "Sala D"];

function roomOptions(selected) {
  return `<option value="">Selecciona una sala</option>
    ${ROOMS.map(r => `<option value="${r}" ${selected === r ? "selected" : ""}>${r}</option>`).join("")}`;
}

function formHtml(screening) {
  const isEdit = !!screening;
  return `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div class="bg-white rounded-lg shadow-lg w-full max-w-lg mx-4 p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold">${isEdit ? "Editar Función" : "Nueva Función"}</h2>
          <button id="closeScreeningFormBtn" class="text-slate-500 hover:text-slate-800 text-2xl leading-none cursor-pointer">&times;</button>
        </div>
        <form id="screeningForm">
          <div class="mb-3">
            <label class="block text-sm font-medium text-slate-700 mb-1">Película</label>
            <input type="text" name="movie" class="border w-full p-2 rounded" value="${isEdit ? screening.movie : ""}" placeholder="Nombre de la película" required>
          </div>
          <div class="mb-3">
            <label class="block text-sm font-medium text-slate-700 mb-1">Sala</label>
            <select name="room" class="border w-full p-2 rounded" required>${roomOptions(isEdit ? screening.room : "")}</select>
          </div>
          <div class="mb-3">
            <label class="block text-sm font-medium text-slate-700 mb-1">Fecha</label>
            <input type="date" name="date" class="border w-full p-2 rounded" value="${isEdit ? screening.date : ""}" required>
          </div>
          <div class="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Hora inicio</label>
              <input type="time" name="startTime" class="border w-full p-2 rounded" value="${isEdit ? screening.startTime : ""}" required>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Hora fin</label>
              <input type="time" name="endTime" class="border w-full p-2 rounded" value="${isEdit ? screening.endTime : ""}" required>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Capacidad total</label>
              <input type="number" min="1" name="totalCapacity" class="border w-full p-2 rounded" value="${isEdit ? screening.totalCapacity : ""}" placeholder="Ej: 50" required>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Precio ($)</label>
              <input type="number" step="0.01" min="0" name="price" class="border w-full p-2 rounded" value="${isEdit ? screening.price : ""}" placeholder="0.00" required>
            </div>
          </div>
          ${isEdit ? `<div class="mb-3"><label class="block text-sm font-medium text-slate-700 mb-1">Cupos disponibles</label><input type="number" name="availableSpots" class="border w-full p-2 rounded" value="${screening.availableSpots}" readonly></div>` : `<input type="hidden" name="availableSpots" value="0">`}
          <div class="mb-4">
            <label class="block text-sm font-medium text-slate-700 mb-1">Estado</label>
            <select name="status" class="border w-full p-2 rounded" required>
              <option value="activa" ${isEdit && screening.status === "activa" ? "selected" : ""}>Activa</option>
              <option value="cancelada" ${isEdit && screening.status === "cancelada" ? "selected" : ""}>Cancelada</option>
            </select>
          </div>
          <button type="submit" class="${isEdit ? "bg-blue-600 hover:bg-blue-700" : "bg-green-600 hover:bg-green-700"} text-white w-full py-2 rounded cursor-pointer transition-colors font-medium">${isEdit ? "Guardar Cambios" : "Crear Función"}</button>
        </form>
      </div>
    </div>
  `;
}

function listHtml(screenings) {
  const items = screenings.map(s => {
    const statusColor = s.status === "activa" ? "text-green-600" : "text-red-600";
    const spotsLeft = s.availableSpots ?? s.totalCapacity;
    return `
      <div class="border rounded p-3 flex justify-between items-center">
        <div>
          <p class="font-semibold">${s.movie}</p>
          <p class="text-sm text-slate-500">${s.room} | ${s.date} | ${s.startTime} - ${s.endTime} | $${s.price}</p>
          <p class="text-xs mt-1">
            <span>Capacidad: ${s.totalCapacity} | Cupos: ${spotsLeft}/${s.totalCapacity}</span>
            <span class="ml-2 font-semibold ${statusColor}">${s.status === "activa" ? "Activa" : "Cancelada"}</span>
          </p>
        </div>
        <div class="flex gap-2">
          <button data-id="${s.id}" data-action="editScreening" class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm cursor-pointer">Editar</button>
          <button data-id="${s.id}" data-action="deleteScreening" class="bg-red-700 hover:bg-red-800 text-white px-3 py-1 rounded text-sm cursor-pointer">Eliminar</button>
        </div>
      </div>
    `;
  }).join("");

  return `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div class="bg-white rounded-lg shadow-lg w-full max-w-2xl mx-4 p-6 max-h-[80vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold">Gestionar Funciones</h2>
          <button id="closeScreeningListBtn" class="text-slate-500 hover:text-slate-800 text-2xl leading-none cursor-pointer">&times;</button>
        </div>
        <button id="showCreateScreeningBtn" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded cursor-pointer mb-4">+ Nueva Función</button>
        <div class="flex flex-col gap-3">${screenings.length ? items : `<p class="text-slate-500 text-center py-4">No hay funciones creadas</p>`}</div>
      </div>
    </div>
  `;
}

export async function openScreeningManager() {
  const modal = document.createElement("div");

  function renderList() {
    getScreenings().then(screenings => {
      modal.innerHTML = listHtml(screenings);
      document.body.appendChild(modal);

      modal.querySelector("#closeScreeningListBtn")?.addEventListener("click", close);
      modal.querySelector("#showCreateScreeningBtn")?.addEventListener("click", () => renderForm(null));
      modal.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-action]");
        if (!btn) { if (e.target === modal) close(); return; }
        const id = btn.dataset.id;
        if (btn.dataset.action === "editScreening") {
          getScreenings().then(all => renderForm(all.find(s => s.id === id)));
        } else if (btn.dataset.action === "deleteScreening" && confirm("¿Eliminar esta función?")) {
          deleteScreening(id).then(renderList);
        }
      });
    });
  }

  function renderForm(screening) {
    modal.innerHTML = formHtml(screening);
    document.body.appendChild(modal);

    modal.querySelector("#closeScreeningFormBtn")?.addEventListener("click", close);
    modal.addEventListener("click", (e) => { if (e.target === modal) close(); });

    modal.querySelector("#screeningForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const totalCapacity = parseInt(formData.get("totalCapacity"), 10);

      if (screening) {
        const data = {
          movie: formData.get("movie"), room: formData.get("room"), date: formData.get("date"),
          startTime: formData.get("startTime"), endTime: formData.get("endTime"),
          price: parseFloat(formData.get("price")), totalCapacity,
          availableSpots: parseInt(formData.get("availableSpots"), 10),
          status: formData.get("status"),
        };
        const res = await updateScreening(screening.id, { ...screening, ...data });
        if (res?.ok) { alert("Función actualizada"); renderList(); }
        else alert("Error al actualizar la función");
      } else {
        const data = {
          movie: formData.get("movie"), room: formData.get("room"), date: formData.get("date"),
          startTime: formData.get("startTime"), endTime: formData.get("endTime"),
          price: parseFloat(formData.get("price")), totalCapacity,
          availableSpots: totalCapacity, status: "activa",
        };
        const res = await createScreening(data);
        if (res?.ok) { alert("Función creada"); renderList(); }
        else alert("Error al crear la función");
      }
    });
  }

  function close() { modal.remove(); }
  renderList();
}
