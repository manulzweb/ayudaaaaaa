import { getScreenings } from "@/services/screening.service";
import { ReservationModal } from "@/components/ReservationModal";

export async function openCartelera() {
  const screenings = await getScreenings();
  const active = screenings.filter(s => s.status === "activa");

  if (!active.length) { alert("No hay funciones disponibles en cartelera."); return; }

  const modal = document.createElement("div");
  modal.innerHTML = `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div class="bg-white rounded-lg shadow-lg w-full max-w-3xl mx-4 p-6 max-h-[85vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold">Cartelera de Cine</h2>
          <button id="closeCarteleraBtn" class="text-slate-500 hover:text-slate-800 text-2xl leading-none cursor-pointer">&times;</button>
        </div>
        <div class="grid gap-4 md:grid-cols-2">
          ${active.map(s => {
            const soldOut = s.availableSpots <= 0;
            const spotsText = soldOut ? "Agotada" : `${s.availableSpots}/${s.totalCapacity}`;
            return `
              <div class="border rounded-lg p-4 shadow-sm ${soldOut ? "opacity-60" : ""}">
                <h3 class="font-bold text-lg text-purple-700">${s.movie}</h3>
                <p class="text-sm text-slate-500 mt-1">${s.room}</p>
                <div class="mt-2 text-sm">
                  <p>Fecha: <span class="font-medium">${s.date}</span></p>
                  <p>Horario: <span class="font-medium">${s.startTime} - ${s.endTime}</span></p>
                  <p>Cupos: <span class="font-medium ${soldOut ? "text-red-600" : "text-green-600"}">${spotsText}</span></p>
                  <p>Precio: <span class="font-medium text-green-600">$${s.price}</span></p>
                </div>
                ${soldOut
                  ? `<p class="mt-3 text-center text-red-600 font-semibold text-sm">Sin cupos disponibles</p>`
                  : `<button data-screening-id="${s.id}" class="reservarFromCartelera mt-3 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm cursor-pointer w-full">Reservar</button>`
                }
              </div>
            `;
          }).join("")}
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const close = () => modal.remove();
  modal.querySelector("#closeCarteleraBtn").addEventListener("click", close);
  modal.addEventListener("click", (e) => { if (e.target === modal) close(); });

  modal.querySelectorAll(".reservarFromCartelera").forEach(btn => {
    btn.addEventListener("click", () => { close(); setTimeout(ReservationModal, 100); });
  });
}
