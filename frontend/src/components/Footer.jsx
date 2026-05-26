import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-white/5 pt-10 pb-6">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">

          {/* Marca */}
          <div className="col-span-2 md:col-span-1">
            <img src="/FitMeal_logoblanco.png" alt="FitMeal" className="h-8 w-auto mb-3" />
            <p className="text-white/30 text-xs leading-relaxed">
              Nutrición inteligente y entrenamiento efectivo para transformar tu vida.
            </p>
            <a href="mailto:fitmealtks@gmail.com" className="text-white/30 hover:text-white text-xs mt-3 block transition-colors">
              fitmealtks@gmail.com
            </a>
          </div>

          {/* Plataforma */}
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 mb-3">Plataforma</p>
            <ul className="flex flex-col gap-2 text-xs text-white/40">
              <li><Link to="/workouts" className="hover:text-white transition-colors">Workouts</Link></li>
              <li><Link to="/recetas" className="hover:text-white transition-colors">Recetas</Link></li>
              <li><Link to="/products" className="hover:text-white transition-colors">Productos</Link></li>
              <li><Link to="/suscripcion" className="hover:text-white transition-colors">Suscripción</Link></li>
            </ul>
          </div>

          {/* Cuenta */}
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 mb-3">Cuenta</p>
            <ul className="flex flex-col gap-2 text-xs text-white/40">
              <li><Link to="/login" className="hover:text-white transition-colors">Iniciar sesión</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">Registrarse</Link></li>
              <li><Link to="/perfil" className="hover:text-white transition-colors">Mi perfil</Link></li>
              <li><Link to="/pedidos" className="hover:text-white transition-colors">Mis pedidos</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 mb-3">Legal</p>
            <ul className="flex flex-col gap-2 text-xs text-white/40">
              <li><Link to="/privacidad" className="hover:text-white transition-colors">Privacidad</Link></li>
              <li><Link to="/terminos" className="hover:text-white transition-colors">Términos de uso</Link></li>
              <li><Link to="/cookies" className="hover:text-white transition-colors">Cookies</Link></li>
              <li><Link to="/contacto" className="hover:text-white transition-colors">Contacto</Link></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-white/5 pt-5 flex flex-col md:flex-row justify-between items-center gap-2">
          <p className="text-white/15 text-xs">© 2026 FitMeal. Todos los derechos reservados.</p>
          <p className="text-white/15 text-xs">Hecho con ❤️ en Barcelona</p>
        </div>
      </div>
    </footer>
  );
}
