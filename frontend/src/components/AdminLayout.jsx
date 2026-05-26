import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { path: '/admin', label: 'Dashboard' },
    { path: '/admin/orders', label: 'Pedidos' },
    { path: '/admin/trainers', label: 'Entrenadores' },
    { path: '/admin/recipes', label: 'Recetas' },
    { path: '/admin/exercises', label: 'Ejercicios' },
    { path: '/admin/users', label: 'Usuarios' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col md:flex-row pt-20">
      
      {/* 1. BARRA SUPERIOR HAMBURGUESA (Móvil) - Con z-40 para que no choque con tus otros componentes */}
      <div className="flex items-center justify-between border-b border-white/5 bg-[#0a0a0a] px-4 py-3 md:hidden sticky top-0 z-40 w-full">
        <span className="font-black italic text-lg">Panel Admin</span>
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 p-2 text-white transition hover:border-white/20 hover:bg-white/10"
          aria-label="Abrir menú"
        >
          {/* Icono de Hamburguesa */}
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* 2. SIDEBAR (En móvil usa z-[100] para pasar por encima de todo lo demás de la pantalla) */}
      <aside
        className={`fixed inset-y-0 left-0 z-[100] w-64 transform bg-[#0d0d0d] border-r border-white/5 flex flex-col transition-transform duration-300 ease-in-out 
          md:static md:translate-x-0 md:h-[calc(100vh-80px)] md:sticky md:top-20 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Cabecera del Sidebar */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div>
            <Link to="/" className="flex items-center gap-3" onClick={() => setIsSidebarOpen(false)}>
              <span className="font-black italic text-xl">FitMeal</span>
            </Link>
            <p className="text-white/40 text-xs mt-2 uppercase tracking-widest">Panel Admin</p>
          </div>
          
          {/* Botón Cerrar (X) */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="rounded-xl border border-white/10 bg-white/5 p-2 text-white/70 transition hover:text-white hover:bg-white/10 md:hidden"
            aria-label="Cerrar menú"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Enlaces de Navegación */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    location.pathname === item.path
                      ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' // Color rojo de tu captura
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer del Sidebar */}
        <div className="p-4 border-t border-white/5">
          <Link
            to="/"
            onClick={() => setIsSidebarOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-all"
          >
            <span>←</span>
            <span className="font-medium">Volver al sitio</span>
          </Link>
        </div>
      </aside>

      {/* 3. OVERLAY OSCURO (Para cerrar al hacer clic fuera del menú) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* 4. CONTENIDO PRINCIPAL */}
      <main className="flex-1 min-h-screen w-full">
        <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>

    </div>
  );
};

export default AdminLayout;