import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const inputClass =
  'w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition placeholder:text-white/25 focus:border-red-500';

function onlyDigits(value) {
  return value.replace(/\D/g, '');
}

function formatCardNumber(value) {
  return onlyDigits(value)
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, '$1 ')
    .trim();
}

function formatExpiry(value) {
  const digits = onlyDigits(value).slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

const planAssetsById = {
  1: {
    img: 'delicious-grain-bowl-with-chicken-and-vegetables-2026-03-19-01-52-11-utc.webp',
    imgAlt: 'Healthy Bowl',
    featured: false,
    dotColor: 'bg-white',
  },
  2: {
    img: 'healthy-chicken-salad-with-fresh-vegetables-2026-03-18-15-10-01-utc.webp',
    imgAlt: 'Chicken Meal',
    featured: true,
    dotColor: 'bg-primary',
  },
};

export default function Suscripcion() {
  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();
  const { user, login } = useAuth(); // asumiendo que login puede refrescar el user

  const planId = new URLSearchParams(location.search).get('planId');
  const [plan, setPlan] = useState(state?.plan ?? null);
  const [loadingPlan, setLoadingPlan] = useState(!state?.plan && !!planId);
  const [form, setForm] = useState({
    name: user?.nombre || '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  });
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (plan || !planId) return;

    const fetchPlan = async () => {
      setLoadingPlan(true);
      try {
        const response = await api.get(`/api/plans/${planId}`);
        const fetchedPlan = response.data.plan;
        if (!fetchedPlan) {
          navigate('/', { replace: true });
          return;
        }

        const asset = planAssetsById[fetchedPlan.id_plan] || {
          img: '',
          imgAlt: fetchedPlan.nombre_plan,
          featured: false,
          dotColor: 'bg-white',
        };

        setPlan({
          id: fetchedPlan.id_plan,
          name: fetchedPlan.nombre_plan,
          price: Number(fetchedPlan.precio_mensual) === 0 ? 'GRATIS' : `${fetchedPlan.precio_mensual} € /mes`,
          features: fetchedPlan.caracteristicas ? fetchedPlan.caracteristicas.split(',') : [],
          ...asset,
        });
      } catch (error) {
        console.error('Error fetching plan:', error);
        navigate('/', { replace: true });
      } finally {
        setLoadingPlan(false);
      }
    };

    fetchPlan();
  }, [plan, planId, navigate]);

  useEffect(() => {
    if (!plan && !planId && !loadingPlan) {
      navigate('/', { replace: true });
    }
  }, [plan, planId, loadingPlan, navigate]);

  if (loadingPlan) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] px-6 py-16 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold">Cargando plan...</p>
        </div>
      </div>
    );
  }

  if (!plan) {
    return null;
  }

  const isFree = plan.price === 'GRATIS';

  function updateField(field, value) {
    const formatters = {
      cardNumber: formatCardNumber,
      expiry: formatExpiry,
      cvv: (nextValue) => onlyDigits(nextValue).slice(0, 4),
    };
    const nextValue = formatters[field] ? formatters[field](value) : value;
    setForm((current) => ({ ...current, [field]: nextValue }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!isFree) {
      if (form.cardNumber.replace(/\s/g, '').length !== 16 || form.cvv.length < 3) {
        toast.error('Revisa los datos de la tarjeta.');
        return;
      }
    }

    setProcessing(true);

    try {
      // Determinamos el string del plan según el nombre del plan de suscripción
      let planString = 'basic';
      const nombrePlan = plan.name.toLowerCase();
      if (nombrePlan.includes('premium')) {
        planString = 'premium';
      } else if (nombrePlan.includes('básico') || nombrePlan.includes('basico') || nombrePlan.includes('basic')) {
        planString = 'basic';
      }

      // Actualizamos solo el plan en el perfil del usuario, el rol se mantiene intacto
      await api.put(`/api/users/${user.id_usuario || user.id}`, {
        plan: planString
      });

      setSuccess(true);
      toast.success(`¡Suscripción al ${plan.name} activada!`);
      
      // En un flujo real, aquí recargaríamos el token o los datos del usuario en el contexto
      // para que la interfaz se actualice al instante con los nuevos permisos.
      
    } catch (error) {
      toast.error(error.response?.data?.error || 'No se pudo procesar la suscripción.');
    } finally {
      setProcessing(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] px-6 py-12 text-white flex flex-col items-center justify-center">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-green-500 text-4xl font-black text-black shadow-[0_0_40px_rgba(34,197,94,0.4)]">
            ✓
          </div>
          <p className="text-sm font-black uppercase tracking-[0.25em] text-green-400">
            Suscripción Activa
          </p>
          <h1 className="mt-3 text-4xl font-black uppercase italic tracking-tight md:text-5xl">
            ¡Bienvenido al {plan.name}!
          </h1>
          <p className="mx-auto mt-4 text-white/60 text-lg">
            Tu cuenta ha sido actualizada. Ya puedes disfrutar de todas las ventajas de tu nuevo plan.
          </p>
          <Link
            to="/perfil"
            className="mt-10 inline-block cursor-pointer rounded-xl px-10 py-4 text-sm font-black uppercase tracking-widest text-white transition hover:scale-105"
            style={{ backgroundColor: '#D30F15' }}
          >
            Ir a mi Perfil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] px-6 py-16 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 text-center">
          <p className="mb-2 text-xs font-black uppercase tracking-[0.3em] text-red-400">Checkout</p>
          <h1 className="text-4xl font-black uppercase italic tracking-tight md:text-5xl">
            Confirmar Suscripción
          </h1>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          
          {/* Columna Resumen del Plan */}
          <aside className="rounded-3xl border border-primary/20 bg-card-lighter p-8 shadow-2xl relative overflow-hidden h-fit">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px]" />
            <h2 className="text-2xl font-black uppercase italic mb-6">Resumen</h2>
            
            <div className="flex items-center gap-6 mb-8">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/10 shrink-0">
                <img src={plan.img} alt={plan.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="text-3xl font-display italic text-white">{plan.name}</h3>
                <p className="text-primary font-bold text-xl mt-1">{plan.price}</p>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <p className="text-sm font-bold uppercase tracking-widest text-white/40 mb-2">Incluye:</p>
              {plan.features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3 text-gray-300">
                  <span className="text-primary material-symbols-outlined text-sm">check_circle</span>
                  <span className="text-sm">{feature.trim()}</span>
                </div>
              ))}
            </div>
            
            <div className="pt-6 border-t border-white/10 flex justify-between items-center">
              <span className="font-black uppercase">Total a pagar hoy</span>
              <span className="text-3xl font-black">{isFree ? '0,00 €' : plan.price.split(' ')[0]}</span>
            </div>
          </aside>

          {/* Columna Formulario de Pago */}
          <form onSubmit={handleSubmit} className="flex flex-col justify-center">
            {isFree ? (
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
                <span className="material-symbols-outlined text-6xl text-gray-400 mb-4">task_alt</span>
                <h3 className="text-xl font-bold mb-2">Suscripción Gratuita</h3>
                <p className="text-gray-400 text-sm mb-8">No se requiere tarjeta de crédito para activar el plan básico.</p>
                <button
                  type="submit"
                  disabled={processing}
                  className="w-full cursor-pointer rounded-xl py-4 text-sm font-black uppercase tracking-widest text-white transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-70"
                  style={{ backgroundColor: '#D30F15' }}
                >
                  {processing ? 'Activando...' : 'Activar Plan Básico'}
                </button>
              </div>
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">credit_card</span>
                  Datos de Pago (Simulado)
                </h3>
                
                <div className="space-y-5">
                  <label className="block">
                    <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-white/50">Titular de la tarjeta</span>
                    <input
                      required
                      value={form.name}
                      onChange={(e) => updateField('name', e.target.value)}
                      className={inputClass}
                      placeholder="Alex FitMeal"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-white/50">Número de tarjeta</span>
                    <input
                      required
                      value={form.cardNumber}
                      onChange={(e) => updateField('cardNumber', e.target.value)}
                      className={inputClass}
                      placeholder="4242 4242 4242 4242"
                      inputMode="numeric"
                      maxLength={19}
                    />
                  </label>

                  <div className="grid grid-cols-2 gap-5">
                    <label className="block">
                      <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-white/50">Caducidad</span>
                      <input
                        required
                        value={form.expiry}
                        onChange={(e) => updateField('expiry', e.target.value)}
                        className={inputClass}
                        placeholder="MM/AA"
                        maxLength={5}
                      />
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-white/50">CVV</span>
                      <input
                        required
                        value={form.cvv}
                        onChange={(e) => updateField('cvv', e.target.value)}
                        className={inputClass}
                        placeholder="123"
                        maxLength={4}
                        type="password"
                      />
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={processing}
                  className="mt-8 w-full cursor-pointer rounded-xl py-4 text-sm font-black uppercase tracking-widest text-white transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-70 flex justify-center items-center gap-2"
                  style={{ backgroundColor: '#D30F15' }}
                >
                  {processing ? (
                    'Procesando pago...'
                  ) : (
                    <>
                      Pagar Suscripción <span className="material-symbols-outlined text-sm">lock</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </form>

        </div>
      </div>
    </div>
  );
}
