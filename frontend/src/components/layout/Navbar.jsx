import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useState, useEffect, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import api from '../../api/axios';

function CartButton({ cartCount, onClick }) {
  return (
    <Link
      to="/cart"
      onClick={onClick}
      aria-label="Ir al carrito"
      className="relative border border-white/25 text-white w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
    >
      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
  const role = Number(user?.id_rol || user?.rol);
  const isUserRole = isAuthenticated && role === 2;
  const [hasTrainer, setHasTrainer] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({ delay: 0.2 });
    tl.fromTo(navRef.current, { y: -80, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' });
    tl.fromTo('.nav-link', { opacity: 0, y: -8 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: 'power2.out' }, '-=0.3');
  }, { scope: navRef });

  useEffect(() => {
    const fetchTrainerStatus = async () => {
      if (!isAuthenticated) { setHasTrainer(false); return; }
      const role = Number(user?.id_rol || user?.rol);
      if (role === 1 || role === 4) { setHasTrainer(false); return; }
      try {
        const res = await api.get('/api/trainers/my-trainer');
        setHasTrainer(res.data.hasTrainer === true || !!res.data.id_usuario);
      } catch {
        setHasTrainer(false);
      }
    };
    fetchTrainerStatus();
  }, [isAuthenticated, user]);

  const hideNav = ['/login', '/register', '/auth/success'].includes(location.pathname);

  const navLinks = [
    { to: '/workouts', label: 'Workouts' },
    { to: '/recetas', label: 'Recetas' },
    { to: '/products', label: 'Productos' },
    { to: '/contacto', label: 'Contacto' },
  ];
  if (isUserRole) navLinks.push({ to: '/rutina', label: 'Mi Rutina' });
  if (isAuthenticated && Number(user?.id_rol || user?.rol) !== 1) navLinks.push({ to: '/pedidos', label: 'Mis pedidos' });
  if (isAuthenticated && (Number(user?.id_rol) === 1 || Number(user?.rol) === 1)) navLinks.push({ to: '/admin', label: 'Admin' });
  if (isAuthenticated && (Number(user?.id_rol) === 4 || Number(user?.rol) === 4)) navLinks.push({ to: '/entrenador', label: 'Entrenador' });

  return (
    <nav
      ref={navRef}
      style={{ display: hideNav ? 'none' : undefined }}
      className={`fixed top-5 left-1/2 -translate-x-1/2 z-[100] w-[min(1200px,calc(100%-40px))] opacity-0
                 bg-white/[0.08] backdrop-blur-[18px] border border-white/15
                 shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-[border-radius] duration-300
                 ${mobileMenuOpen ? 'rounded-3xl' : 'rounded-full'}`}
    >
      <div className="flex items-center justify-between px-6 py-3">

        {/* Logo */}
        <Link to="/">
          <img src="/FitMeal_logoblanco.png" alt="FitMeal" className="h-9 w-auto object-contain brightness-0 invert" />
        </Link>

        {/* Links centrales — solo desktop */}
        <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          {navLinks.map(({ to, label }) => {
            const isActive = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className="nav-link relative flex flex-col items-center gap-0.5 text-[0.9rem] font-medium italic transition-colors"
                style={{ color: isActive ? '#fff' : 'rgba(255,255,255,0.85)' }}
              >
                {label}
                <span
                  className="block h-0.5 rounded-full transition-all duration-300"
                  style={{
                    width: isActive ? '100%' : '0%',
                    backgroundColor: '#D30F15',
                    boxShadow: isActive ? '0 0 8px rgba(211,15,21,0.7)' : 'none',
                  }}
                />
              </Link>
            );
          })}
        </div>

        {/* Acciones derecha */}
        <div className="flex items-center gap-3">

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link to="/perfil" className="text-white/80 hover:text-white text-sm italic font-bold whitespace-nowrap transition-colors">
                  {user?.nombre || user?.email}
                </Link>
                <CartButton cartCount={cartCount} />
                <button
                  onClick={logout}
                  className="border border-white/40 rounded-full px-[18px] py-[5px] text-[0.85rem] font-medium text-white hover:border-[#D30F15] hover:bg-[#D30F15] transition-all"
                >
                  Salir
                </button>
              </>
            ) : (
              <>
                <CartButton cartCount={cartCount} />
                <Link
                  to="/login"
                  className="border border-white/40 rounded-full px-[18px] py-[5px] text-[0.85rem] font-medium text-white hover:border-[#D30F15] hover:bg-[#D30F15] transition-all"
                >
                  Login
                </Link>
              </>
            )}
          </div>

          {/* Mobile */}
          <div className="flex md:hidden items-center gap-3">
            <CartButton cartCount={cartCount} onClick={() => setMobileMenuOpen(false)} />
            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="w-10 h-10 rounded-full border border-white/20 bg-white/5 text-white flex items-center justify-center hover:border-white/40 transition-colors"
              aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {mobileMenuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
          </div>

        </div>
      </div>

      {/* Menú móvil */}
      {mobileMenuOpen && (
        <div className="md:hidden mx-2 mb-2 rounded-3xl border border-white/10 bg-gray-950/95 backdrop-blur-xl p-5">
          <div className="space-y-1">
            {navLinks.map(({ to, label }) => {
              const isActive = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block rounded-2xl px-4 py-3 text-base font-medium transition-colors ${isActive ? 'bg-white/10 text-white' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}
                >
                  {label}
                </Link>
              );
            })}
          </div>
          <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
            {isAuthenticated ? (
              <>
                <Link to="/perfil" onClick={() => setMobileMenuOpen(false)} className="block rounded-2xl px-4 py-3 text-base font-medium text-white/80 hover:bg-white/10 hover:text-white transition-colors">
                  {user?.nombre || user?.email}
                </Link>
                <button
                  onClick={() => { setMobileMenuOpen(false); logout(); }}
                  className="w-full rounded-2xl bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-700 transition-colors"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-2xl bg-white px-4 py-3 text-center text-sm font-semibold text-black hover:bg-gray-200 transition-colors"
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
