import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function PlansSection({ plans = [], onPlanClick }) {
  const sectionRef = useRef(null)

  useGSAP(() => {
    gsap.fromTo(
      '.plans-title span',
      { y: '110%', opacity: 0 },
      {
        y: '0%',
        opacity: 1,
        duration: 1,
        stagger: 0.1,
        ease: 'power4.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
      }
    )

    gsap.fromTo(
      '.plans-sub',
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' },
      }
    )
  }, { scope: sectionRef })

  return (
    <section ref={sectionRef} id="plans" className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* Header */}
        <div className="text-center mb-16 overflow-hidden">
          <h2 className="plans-title flex flex-wrap justify-center gap-x-4 font-display italic text-5xl md:text-7xl mb-4 overflow-hidden">
            {'Empieza tu plan personalizado'.split(' ').map((word, i) => (
              <span key={i} className="inline-block">{word}</span>
            ))}
          </h2>
          <p className="plans-sub text-gray-400 text-lg max-w-2xl mx-auto opacity-0">
            Planes basados en tus objetivos y datos personales para maximizar resultados.
          </p>
        </div>

        {/* Grid — mismo diseño que el <aside> de Suscripcion.jsx */}
        {plans.length === 0 && (
          <p className="text-center text-white/40 text-sm mt-4">Cargando planes...</p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => {
            const isFree = plan.price === 'GRATIS'
            return (
              <aside
                key={plan.id}
                className="plan-card rounded-3xl border border-primary/20 bg-card-lighter p-8 shadow-2xl relative overflow-hidden h-fit flex flex-col"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px]" />

                {/* Imagen + nombre */}
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/10 shrink-0">
                    <img src={plan.img} alt={plan.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-display italic text-white">{plan.name}</h3>
                    <p className="text-primary font-bold text-xl mt-1">{plan.price}</p>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-4 mb-8 flex-1">
                  <p className="text-sm font-bold uppercase tracking-widest text-white/40 mb-2">Incluye:</p>
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-gray-300">
                      <span className="text-primary material-symbols-outlined text-sm">check_circle</span>
                      <span className="text-sm">{feature.trim()}</span>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="pt-6 border-t border-white/10 flex justify-between items-center mb-6">
                  <span className="font-black uppercase">Total a pagar hoy</span>
                  <span className="text-3xl font-black">{isFree ? '0,00 €' : plan.price.split(' ')[0]}</span>
                </div>

                {/* CTA */}
                <button
                  onClick={() => onPlanClick?.(plan)}
                  className="w-full py-3 rounded-full bg-primary hover:bg-primary-hover text-white font-bold italic tracking-wide transition-colors shadow-[0_0_15px_rgba(211,15,21,0.3)]"
                >
                  {plan.price}
                </button>
              </aside>
            )
          })}
        </div>

      </div>
    </section>
  )
}
