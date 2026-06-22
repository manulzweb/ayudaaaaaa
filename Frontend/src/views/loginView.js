import { loginController } from "@/controllers/login.controller";

export default function loginView() {
  setTimeout(() => loginController());

  return `
    <div class="min-h-screen flex justify-center items-center bg-gray-50 font-sans px-4">
      <div class="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 w-full max-w-md">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-extrabold text-gray-900 mb-2">Bienvenido</h1>
          <p class="text-gray-500 text-sm">Por favor, ingresa a tu cuenta para continuar</p>
        </div>
        <form id="loginForm" class="space-y-5">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              placeholder="ejemplo@correo.com" 
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-700"
            >
            
          </div>
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              placeholder="••••••••" 
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-700"
            >
          </div>
          <div class="flex items-center justify-between mt-2">
            <label class="flex items-center cursor-pointer">
              <input type="checkbox" class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer">
              <span class="ml-2 text-sm text-gray-600">Recordarme</span>
            </label>
            <a href="#" class="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors">
              ¿Olvidaste tu contraseña?
            </a>
          </div>
          <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg shadow transition-colors duration-200 cursor-pointer mt-4">Ingresar</button>
        </form>
        <p class="mt-8 text-center text-sm text-gray-500">
          ¿No tienes una cuenta? 
          <a href="#" class="font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors">
            Regístrate aquí
          </a>
        </p>
      </div>
    </div>
  `;
}
