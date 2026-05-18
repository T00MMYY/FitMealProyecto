import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function Navbar() {
  const { user, token, isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();
  const location = useLocation();
  const [hasTrainer, setHasTrainer] = useState(false);
  
  const isHome = location.pathname === '/';
  const hideNav = ['/login', '/register', '/auth/success'].includes(location.pathname);

  // Obtener si el usuario tiene entrenador asignado
  useEffect(() => {
    const fetchTrainerStatus = async () => {
      if (!isAuthenticated || !token) {
        setHasTrainer(false);
        return;
      }
      // Solo usuarios normales o premium necesitan este estado
      const role = Number(user?.id_rol || user?.rol);
      if (role === 1 || role === 4) {
        setHasTrainer(false);
        return;
      }
      try {
        const res = await api.get('/api/trainers/my-trainer');
        // Soporte para formato nuevo ({hasTrainer: true}) y antiguo ({id_usuario: 8})
        const hasTrainerActive = res.data.hasTrainer === true || !!res.data.id_usuario;
        
        setHasTrainer(hasTrainerActive);
      } catch (err) {
        console.error("Error fetching trainer status en Navbar:", err);
        setHasTrainer(false);
      }
    };
    fetchTrainerStatus();
  }, [isAuthenticated, token, user]);
  if (hideNav) return null;

  const navLinks = [
    { to: '/workouts', label: 'Workouts' },
    { to: '/recetas', label: 'Recetas' },
    { to: '/products', label: 'Productos' },
    { to: '/contacto', label: 'Contacto' },
  ];
  
  // CORREGIDO: Se elimina la propiedad 'special: true' para integrarlo al diseño estándar
  if (isAuthenticated && hasTrainer) {
    navLinks.push({ to: '/rutina', label: 'Mi Rutina' });
  }
  
  if (isAuthenticated && user && (Number(user.id_rol) === 1 || Number(user.rol) === 1)) {
    navLinks.push({ to: '/admin', label: 'Admin' });
  }
  if (isAuthenticated && user && (Number(user.id_rol) === 4 || Number(user.rol) === 4)) {
    navLinks.push({ to: '/entrenador', label: 'Entrenador' });
  }

  return (
    <nav
      className={`${isHome
          ? 'absolute top-0 left-0 w-full z-20'
          : 'relative bg-gray-900 border-b border-gray-800'
        } px-8 py-5`}
    >
      <div className="flex items-center justify-between relative w-full">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/FitMeal_logoblanco.png"
            alt="FitMeal"
            className="h-12 w-12 object-contain"
          />
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          {navLinks.map(({ to, label }) => {
            const isActive = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className="relative text-sm font-medium italic transition-colors group flex flex-col items-center gap-1"
                style={{ color: isActive ? '#fff' : 'rgba(255,255,255,0.7)' }}
              >
                {label}
                {/* Active Red underline style */}
                <span
                  className="block h-[2px] rounded-full transition-all duration-300"
                  style={{
                    width: isActive ? '100%' : '0%',
                    backgroundColor: '#d30f15',
                    boxShadow: isActive ? '0 0 8px rgba(211,15,21,0.7)' : 'none',
                  }}
                />
                {/* hover bar for non-active */}
                {!isActive && (
                  <span className="block h-[2px] w-0 group-hover:w-full rounded-full bg-white/40 transition-all duration-300 absolute bottom-0" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right side */}
        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            <Link to="/perfil" className="text-white/80 hover:text-white text-sm italic font-bold">
              {user?.nombre || user?.email}
            </Link>
            <Link
              to="/cart"
              className="relative border border-white/25 text-white p-2 rounded-full hover:bg-white/10 transition-colors flex items-center justify-center"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={logout}
              className="border border-white text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-white hover:text-black transition-colors cursor-pointer"
            >
              Cerrar sesión
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link
              to="/cart"
              className="relative border border-white/25 text-white p-2 rounded-full hover:bg-white/10 transition-colors flex items-center justify-center"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link
              to="/login"
              className="border border-white text-white px-8 py-2.5 rounded-full text-lg font-medium hover:bg-white hover:text-black transition-colors"
            >
              Login
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}