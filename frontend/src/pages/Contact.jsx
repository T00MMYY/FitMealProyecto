import { useState } from 'react';
import { motion } from 'framer-motion';
import api from '../api/axios';
import toast from 'react-hot-toast';

const infoCards = [
  { icon: 'phone', label: 'Teléfono', value: '+688 493 491', sub: 'Lun–Vie, 9:00–18:00' },
  { icon: 'mail', label: 'Correo electrónico', value: 'FitMeal@gmail.com', sub: 'Respuesta en 24h' },
  { icon: 'chat_bubble', label: 'WhatsApp', value: '+688 493 491', sub: 'Respuesta inmediata' },
  { icon: 'location_on', label: 'Oficina', value: 'Calle FitMeal, Barcelona', sub: 'España' },
];

export default function Contact() {
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '', mensaje: '' });
  const [sent, setSent] = useState(false);
  const [enviando, setEnviando] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setEnviando(true);
    try {
      await api.post('/api/contact', form);
      setSent(true);
    } catch {
      toast.error('Error al enviar el mensaje. Inténtalo de nuevo.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-primary selection:text-black pt-28 pb-20">
      <div className="max-w-[1350px] mx-auto px-6">

        {/* HEADER */}
        <div className="mb-20 relative">
          <div className="absolute -top-20 left-0 w-[600px] h-[300px] bg-[radial-gradient(ellipse_at_center,rgba(211,15,21,0.08)_0%,transparent_70%)] pointer-events-none" />
          <motion.h1
            initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-8xl md:text-[9rem] font-black italic uppercase leading-[0.85] tracking-tighter mb-5"
          >
            CON<span className="text-primary">TACTO</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-white/40 text-sm tracking-[0.3em] uppercase font-medium"
          >
            ¿Tienes dudas? Estamos aquí para ayudarte
          </motion.p>
        </div>

        {/* GRID PRINCIPAL */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8">

          {/* FORMULARIO */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="bg-[#111] rounded-[30px] border border-white/5 p-10"
          >
            {sent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="h-full flex flex-col items-center justify-center text-center gap-5 py-16"
              >
                <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-4xl">check_circle</span>
                </div>
                <h2 className="text-4xl font-black italic uppercase">
                  ¡MENSAJE<br /><span className="text-primary">ENVIADO!</span>
                </h2>
                <p className="text-white/40 text-sm tracking-wider max-w-xs">
                  Te responderemos en menos de 24 horas.
                </p>
                <button
                  onClick={() => { setSent(false); setForm({ nombre: '', email: '', telefono: '', mensaje: '' }); }}
                  className="mt-2 px-8 py-3 rounded-full border border-white/20 text-[10px] font-black uppercase tracking-widest hover:border-primary hover:text-primary transition-all duration-300"
                >
                  Enviar otro mensaje
                </button>
              </motion.div>
            ) : (
              <>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-8">
                  Formulario de contacto
                </p>
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/40">
                        Nombre *
                      </label>
                      <input
                        type="text" name="nombre" value={form.nombre} onChange={handleChange} required
                        placeholder="Tu nombre"
                        className="bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-white text-sm placeholder-white/20 focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/40">
                        Email *
                      </label>
                      <input
                        type="email" name="email" value={form.email} onChange={handleChange} required
                        placeholder="ejemplo@gmail.com"
                        className="bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-white text-sm placeholder-white/20 focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40">
                      Teléfono
                    </label>
                    <input
                      type="tel" name="telefono" value={form.telefono} onChange={handleChange}
                      placeholder="+34 600 000 000"
                      className="bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-white text-sm placeholder-white/20 focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40">
                      Mensaje *
                    </label>
                    <textarea
                      name="mensaje" value={form.mensaje} onChange={handleChange} required rows={6}
                      placeholder="¿En qué podemos ayudarte?"
                      className="bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-white text-sm placeholder-white/20 focus:outline-none focus:border-primary transition-colors resize-none"
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={enviando}
                    whileHover={enviando ? {} : { scale: 1.02, boxShadow: '0 0 30px rgba(211,15,21,0.4)' }}
                    whileTap={enviando ? {} : { scale: 0.97 }}
                    className="w-full py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{ background: '#D30F15', color: '#fff' }}
                  >
                    {enviando ? 'Enviando...' : 'Enviar mensaje'}
                    {!enviando && (
                      <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">send</span>
                    )}
                  </motion.button>
                </form>
              </>
            )}
          </motion.div>

          {/* SIDEBAR: INFO + MAPA */}
          <div className="flex flex-col gap-5">

            {/* INFO CARDS */}
            <motion.div
              className="flex flex-col gap-3"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.1, delayChildren: 0.4 } },
              }}
            >
              {infoCards.map((card) => (
                <motion.div
                  key={card.label}
                  variants={{
                    hidden: { opacity: 0, x: 30 },
                    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
                  }}
                  whileHover={{ x: 4, transition: { duration: 0.2 } }}
                  className="bg-[#111] rounded-2xl border border-white/5 hover:border-primary/40 transition-colors p-5 flex items-center gap-4 group cursor-default"
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: 'rgba(211,15,21,0.15)' }}
                  >
                    <span className="material-symbols-outlined text-primary text-xl">{card.icon}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-0.5">{card.label}</p>
                    <p className="text-sm font-black text-white truncate">{card.value}</p>
                    <p className="text-[10px] text-white/30">{card.sub}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* MAPA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl overflow-hidden border border-white/5 flex-1 min-h-[200px]"
            >
              <iframe
                title="FitMeal ubicación"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d96872.38157985609!2d2.0741051!3d41.3873974!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12a49816718e30e5%3A0x44b0fb3d4f47660a!2sBarcelona!5e0!3m2!1ses!2ses!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0, display: 'block', minHeight: '200px', filter: 'invert(90%) hue-rotate(180deg)' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </motion.div>

          </div>
        </div>

      </div>
    </div>
  );
}
