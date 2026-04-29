import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light') setIsDark(false);
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    localStorage.setItem('theme', !isDark ? 'dark' : 'light');
  };

  const menuItems = [
    { path: '/admin', label: 'Dashboard' },
    { path: '/admin/recipes', label: 'Recetas'  },
    { path: '/admin/exercises', label: 'Ejercicios'  },
    { path: '/admin/users', label: 'Usuarios' },
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#0a0a0a] text-white' : 'bg-gray-100 text-black'} flex`}>
      {/* Sidebar */}
      <div className={`w-64 ${isDark ? 'bg-[#0d0d0d]' : 'bg-white'} border-r border-gray-300 flex flex-col`}>
        {/* Logo/Header */}
        <div className="p-6 border-b border-gray-300">
          <Link to="/" className="flex items-center gap-3">
            <span className="font-black italic text-xl">FitMeal</span>
          </Link>
          <p className={`${isDark ? 'text-white/40' : 'text-gray-600'} text-xs mt-2 uppercase tracking-widest`}>Panel Admin</p>
          <button onClick={toggleTheme} className="mt-2 text-sm underline">
            {isDark ? 'Modo Claro' : 'Modo Oscuro'}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    location.pathname === item.path
                      ? 'bg-primary text-black shadow-lg shadow-primary/20'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/5">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-all"
          >
            <span>←</span>
            <span className="font-medium">Volver al sitio</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;