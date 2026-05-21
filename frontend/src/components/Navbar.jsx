import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useState, useEffect } from 'react';
import api from '../api/axios';

function CartButton({ cartCount, onClick }) {
  return (
    <Link
      to="/cart"
      onClick={onClick}
      className="relative border border-white/25 text-white p-2 rounded-full hover:bg-white/10 transition-colors flex items-center justify-center"
      aria-label="Ir al carrito"
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
  );
}

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();
  const location = useLocation();
  const [hasTrainer, setHasTrainer] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const isHome = location.pathname === '/';
  const hideNav = ['/login', '/register', '/auth/success'].includes(location.pathname);

  // Obtener si el usuario tiene entrenador asignado
  useEffect(() => {
    const fetchTrainerStatus = async () => {
      if (!isAuthenticated) {
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
        const hasTrainerActive = res.data.hasTrainer === true || !!res.data.id_usuario;
        
        setHasTrainer(hasTrainerActive);
      } catch (err) {
        console.error("Error fetching trainer status en Navbar:", err);
        setHasTrainer(false);
      }
    };
    fetchTrainerStatus();
  }, [isAuthenticated, user]);

  if (hideNav) return null;

  const navLinks = [
    { to: '/workouts', label: 'Workouts' },
    { to: '/recetas', label: 'Recetas' },
    { to: '/products', label: 'Productos' },
    { to: '/contacto', label: 'Contacto' },
  ];
  
  if (isAuthenticated && hasTrainer) {
    navLinks.push({ to: '/rutina', label: 'Mi Rutina' });
  }

  if (isAuthenticated) {
    navLinks.push({ to: '/pedidos', label: 'Mis pedidos' });
  }
  
  if (isAuthenticated && user && (Number(user.id_rol) === 1 || Number(user.rol) === 1)) {
    navLinks.push({ to: '/admin', label: 'Admin' });
  }
  if (isAuthenticated && user && (Number(user.id_rol) === 4 || Number(user.rol) === 4)) {
    navLinks.push({ to: '/entrenador', label: 'Entrenador' });
  }

  return (
    <nav className={`${isHome ? 'absolute top-0 left-0 w-full z-20' : 'relative bg-gray-900 border-b border-gray-800'} px-4 py-4 md:px-8 md:py-5`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2">
          <img src="/FitMeal_logoblanco.png" alt="FitMeal" className="h-10 w-10 object-contain md:h-12 md:w-12" />
        </Link>

        {/* Links centrales de escritorio */}
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
                <span
                  className="block h-0.5 rounded-full transition-all duration-300"
                  style={{
                    width: isActive ? '100%' : '0%',
                    backgroundColor: '#d30f15',
                    boxShadow: isActive ? '0 0 8px rgba(211,15,21,0.7)' : 'none',
                  }}
                />
                {!isActive && (
                  <span className="block h-0.5 w-0 group-hover:w-full rounded-full bg-white/40 transition-all duration-300 absolute bottom-0" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Bloque de acciones derecha */}
        <div className="flex items-center gap-3 md:gap-4">
          
          {/* Vista Escritorio con condiciones de extremo derecho */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                {/* Usuario a la izquierda */}
                <Link to="/perfil" className="text-white/80 hover:text-white text-sm italic font-bold whitespace-nowrap">
                  {user?.nombre || user?.email}
                </Link>
                
                {/* Carrito en el medio */}
                <CartButton cartCount={cartCount} />
                
                {/* Salir en el extremo derecho */}
                <button
                  onClick={logout}
                  className="border border-white text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-white hover:text-black transition-colors"
                >
                  Salir
                </button>
              </>
            ) : (
              <>
                {/* Carrito pasa a la izquierda si no hay sesión iniciada */}
                <CartButton cartCount={cartCount} />

                {/* Login en el extremo derecho */}
                <Link
                  to="/login"
                  className="border border-white text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-white hover:text-black transition-colors"
                >
                  Login
                </Link>
              </>
            )}
          </div>

          {/* Vista Móvil (Mantiene el flujo compacto para pantallas pequeñas) */}
          <div className="flex md:hidden items-center gap-3">
            <CartButton cartCount={cartCount} onClick={() => setMobileMenuOpen(false)} />
            <button
              type="button"
              onClick={() => setMobileMenuOpen((current) => !current)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white transition hover:border-white/40"
              aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            >
              <span className="sr-only">Abrir menú</span>
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
                )}
              </svg>
            </button>
          </div>

        </div>
      </div>

      {/* Menú Móvil Desplegable */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 rounded-3xl border border-white/10 bg-gray-950/95 backdrop-blur-xl p-5 shadow-2xl shadow-black/40">
          <div className="space-y-3">
            {navLinks.map(({ to, label }) => {
              const isActive = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block rounded-2xl px-4 py-3 text-base font-medium transition ${isActive ? 'bg-white/10 text-white' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}
                >
                  {label}
                </Link>
              );
            })}
          </div>

          <div className="mt-5 border-t border-white/10 pt-5 space-y-3">
            {isAuthenticated ? (
              <>
                <Link
                  to="/perfil"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-2xl px-4 py-3 text-base font-medium text-white/80 hover:bg-white/10 hover:text-white"
                >
                  {user?.nombre || user?.email}
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full rounded-2xl bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-700 transition"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-2xl bg-white px-4 py-3 text-center text-sm font-semibold text-black hover:bg-gray-200 transition"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
