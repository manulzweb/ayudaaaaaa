import Sidebar from "@/components/Sidebar";
import { getSession } from "@/services/auth.service";
import { homeController, toggleManageMode, setManageElements } from "@/controllers/home.controller";
import { ReservationModal } from "@/components/ReservationModal";
import { openScreeningManager } from "@/components/ScreeningModal";
import { openCartelera } from "@/components/CarteleraModal";

export default function homeView() {
  const user = getSession();

  setTimeout(() => {
    homeController();

    document.querySelector("#viewCarteleraBtn")?.addEventListener("click", openCartelera);
    document.querySelector("button.bg-green-600")?.addEventListener("click", ReservationModal);

    const manageBtn = document.querySelector("#manageReservasBtn");
    const manageIndicator = document.querySelector("#manageIndicator");
    if (manageBtn && manageIndicator) {
      setManageElements(manageBtn, manageIndicator);
      manageBtn.addEventListener("click", toggleManageMode);
    }

    document.querySelector("#manageScreeningsBtn")?.addEventListener("click", openScreeningManager);
  });

  const adminPanel = user?.role === "admin" ? `
    <section class="bg-white p-5 rounded-lg shadow mb-6">
      <h2 class="font-bold text-xl mb-2">Panel Administrador</h2>
      <p>Puedes visualizar y gestionar todas las reservas.</p>
      <div class="flex gap-2 items-center mt-3">
        <button id="manageReservasBtn" class="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer">Gestionar Reservas</button>
        <span id="manageIndicator" class="text-sm text-slate-500">Mostrando todas las reservas</span>
      </div>
      <button id="manageScreeningsBtn" class="mt-3 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded cursor-pointer">Gestionar Funciones</button>
    </section>
  ` : `
    <section class="bg-white p-5">
      <h2 class="font-bold text-xl mb-2">Panel Usuario</h2>
      <p>Consulta la cartelera y gestiona tus reservas.</p>
      <div class="flex gap-2 mt-3">
        <button id="viewCarteleraBtn" class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded cursor-pointer">Ver Cartelera</button>
        <button class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded cursor-pointer">Nueva Reserva</button>
      </div>
    </section>
  `;

  const subtitle = user?.role === "admin" ? "Mostrando todas las reservas" : "Mostrando únicamente tus reservas";

  return `
    <div class="flex min-h-screen">
      ${Sidebar()}
      <main class="flex-1 p-6 bg-slate-100">
        <div class="mb-6">
          <h1 class="text-3xl font-bold">Bienvenido ${user?.name}</h1>
          <p class="text-orange-500">Rol: ${user?.role}</p>
        </div>
        ${adminPanel}
        <section class="bg-white p-5 rounded-lg shadow">
          <div class="flex justify-between items-center mb-4">
            <h2 class="font-bold text-xl">Reservas</h2>
            <span class="text-sm text-slate-500">${subtitle}</span>
          </div>
          <div id="reservationsContainer" class="grid gap-4 md:grid-cols-2">
            <div class="w-full text-center py-8 col-span-2">
              <p class="text-emerald-800">Cargando reservas ...</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  `;
}
