import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const inputClass = "w-full px-4 py-3 bg-white/[0.04] border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-red-500 transition-colors text-sm";

export default function Register() {
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    email: '',
    password: '',
    confirmPassword: '',
    telefono: '',
    fecha_nacimiento: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Por favor introduce un email válido');
      return;
    }
    if (formData.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword: _confirmPassword, ...dataToSend } = formData;
      await register(dataToSend);
      navigate('/onboarding');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al registrar usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 py-16">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[radial-gradient(ellipse_at_center,rgba(211,15,21,0.07)_0%,transparent_70%)] pointer-events-none" />

      <div className="w-full max-w-4xl rounded-3xl overflow-hidden flex min-h-[600px] backdrop-blur-xl" style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' }}>

        {/* Panel izquierdo: formulario */}
        <div className="flex flex-col justify-center w-full md:w-1/2 p-10 overflow-y-auto" style={{ background: 'rgba(10,10,10,0.6)' }}>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-2">Registro</p>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-white mb-8">Crear cuenta</h1>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-300 px-4 py-3 rounded-xl mb-5 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-white/30 mb-2">Nombre *</label>
                <input name="nombre" type="text" value={formData.nombre} onChange={handleChange} required className={inputClass} placeholder="Tu nombre" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-white/30 mb-2">Apellidos</label>
                <input name="apellidos" type="text" value={formData.apellidos} onChange={handleChange} className={inputClass} placeholder="Tus apellidos" />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-white/30 mb-2">Correo electrónico *</label>
              <input name="email" type="email" value={formData.email} onChange={handleChange} required className={inputClass} placeholder="nombre@ejemplo.com" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-white/30 mb-2">Contraseña *</label>
                <input name="password" type="password" value={formData.password} onChange={handleChange} required className={inputClass} placeholder="Mín. 8 caracteres" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-white/30 mb-2">Confirmar *</label>
                <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required className={inputClass} placeholder="Repetir" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-white/30 mb-2">Teléfono</label>
                <input name="telefono" type="tel" value={formData.telefono} onChange={handleChange} className={inputClass} placeholder="612345678" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-white/30 mb-2">Fecha nacimiento</label>
                <input name="fecha_nacimiento" type="date" value={formData.fecha_nacimiento} onChange={handleChange} className={inputClass} />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-black uppercase tracking-widest text-[11px] text-white transition-all duration-300 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              style={{ background: '#D30F15' }}
            >
              {loading ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
          </form>

          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-white/10" />
            <span className="px-4 text-white/20 text-[10px] uppercase tracking-widest">O</span>
            <div className="flex-1 border-t border-white/10" />
          </div>

          <a
            href={`${import.meta.env.VITE_API_URL || 'https://fitmeal.website'}/auth/google`}
            className="flex items-center justify-center gap-3 w-full bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 text-white py-3 rounded-xl text-sm font-bold transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continuar con Google
          </a>

          <p className="text-center text-white/30 mt-6 text-sm">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-white font-black hover:text-white/70 transition-colors">Inicia sesión</Link>
          </p>
        </div>

        {/* Panel derecho: branding */}
        <div className="hidden md:flex flex-col justify-between w-1/2 p-10" style={{ borderLeft: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-white/30 hover:text-white transition-colors text-xs font-black uppercase tracking-widest w-fit"
            >
              ← Atrás
            </button>
            <img src="/FitMeal_logoblanco.png" alt="FitMeal" className="h-12 w-12 object-contain mt-2" />
          </div>

          <div>
            <h2 className="text-5xl font-black text-white uppercase leading-tight tracking-tighter mb-4">
              Únete a<br /><span style={{ color: '#D30F15' }}>FitMeal</span>
            </h2>
            <p className="text-white/40 text-sm leading-relaxed">
              Crea tu cuenta y empieza hoy mismo tu camino hacia una vida más saludable.
            </p>
          </div>

          <div className="flex gap-4 text-white/20 text-xs">
            <Link to="/privacidad" className="hover:text-white/40 transition-colors">Política de privacidad</Link>
            <span>•</span>
            <Link to="/terminos" className="hover:text-white/40 transition-colors">Términos de uso</Link>
          </div>
        </div>

      </div>
    </div>
  );
}
