export default function ReservationCard(reservation, isManaging, currentUserId) {
  const { id, userId, movie, workspace, date, startHour, endHour, reason, status } = reservation;
  const statusColor = status === "approved" ? "text-green-600" : status === "cancelled" ? "text-red-600" : "text-yellow-600";
  const canEdit = date && startHour && new Date(`${date}T${startHour}`) > new Date();
  const isOwn = String(userId) === String(currentUserId);

  const adminButtons = isManaging ? `
    <div class="flex gap-2 mt-3 flex-wrap">
      ${status === "pending" ? `<button data-id="${id}" data-action="approve" class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm cursor-pointer">Aprobar</button>` : ""}
      ${status !== "cancelled" ? `<button data-id="${id}" data-action="cancel" class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm cursor-pointer">Cancelar</button>` : ""}
      <button data-id="${id}" data-action="edit" class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm cursor-pointer">Editar</button>
      <button data-id="${id}" data-action="delete" class="bg-red-700 hover:bg-red-800 text-white px-3 py-1 rounded text-sm cursor-pointer">Eliminar</button>
    </div>
  ` : "";

  const userButtons = !isManaging && isOwn && status !== "cancelled" ? `
    <div class="flex gap-2 mt-3 flex-wrap">
      ${status === "approved" && canEdit ? `<button data-id="${id}" data-action="userCancel" class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm cursor-pointer">Cancelar</button>` : ""}
      ${status === "pending" && canEdit ? `<button data-id="${id}" data-action="userEdit" class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm cursor-pointer">Editar</button>` : ""}
    </div>
  ` : "";

  const label = status === "approved" ? "Aprobada" : status === "cancelled" ? "Cancelada" : "Pendiente";

  return `
    <article class="rounded border border-black p-4 ${isManaging ? "ring-2 ring-blue-400" : ""}">
      ${movie ? `<p class="text-sm text-purple-600 font-semibold mb-1">🎬 ${movie}</p>` : ""}
      <h3 class="font-bold text-lg">${workspace}</h3>
      <div>
        <p>Fecha: ${date}</p>
        <p>Horario: ${startHour} - ${endHour}</p>
        <p>Motivo: ${reason}</p>
        <p>Estado: <span class="font-semibold ${statusColor}">${label}</span></p>
      </div>
      ${adminButtons}
      ${userButtons}
    </article>
  `;
}
