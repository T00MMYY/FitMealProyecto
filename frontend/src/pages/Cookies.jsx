export default function Cookies() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-32 pb-16 px-6">
      <div className="max-w-3xl mx-auto">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-2">Legal</p>
        <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">Política de <span className="text-[#D30F15]">Cookies</span></h1>
        <p className="text-white/20 text-xs mb-10">Última actualización: enero 2026</p>

        <div className="flex flex-col gap-10 text-white/60 text-sm leading-relaxed">

          <section>
            <h2 className="text-white font-black uppercase tracking-widest text-xs mb-3">1. ¿Qué son las cookies?</h2>
            <p>Las cookies son pequeños archivos de texto que los sitios web almacenan en tu navegador cuando los visitas. Sirven para recordar información sobre tu visita, como tus preferencias o tu sesión iniciada, y facilitan una mejor experiencia de uso.</p>
          </section>

          <section>
            <h2 className="text-white font-black uppercase tracking-widest text-xs mb-3">2. Tipos de cookies que usamos</h2>
            <p className="mb-4">FitMeal utiliza únicamente cookies necesarias para el funcionamiento de la plataforma:</p>

            <ul className="flex flex-col gap-2 pl-4 list-disc">
              <li><span className="text-white font-bold">Cookie de sesión:</span> mantiene tu sesión iniciada mientras navegas por la plataforma. Se elimina al cerrar sesión o al cabo de 24 horas.</li>
              <li><span className="text-white font-bold">Cookie de carrito:</span> recuerda los productos que has añadido al carrito aunque cambies de página.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-black uppercase tracking-widest text-xs mb-3">3. Cookies de terceros</h2>
            <p>FitMeal no utiliza cookies de publicidad, seguimiento ni analítica de terceros. No hay cookies de Google Analytics, Facebook Pixel ni ningún otro servicio de rastreo externo.</p>
            <p className="mt-3">Si utilizas la opción de inicio de sesión con Google, el proceso de autenticación es gestionado íntegramente por Google según su propia política de privacidad. FitMeal únicamente recibe los datos básicos de perfil necesarios para crear tu cuenta.</p>
          </section>

          <section>
            <h2 className="text-white font-black uppercase tracking-widest text-xs mb-3">4. ¿Son obligatorias?</h2>
            <p>Las cookies que usa FitMeal son estrictamente necesarias para el funcionamiento de la plataforma. Sin la cookie de sesión no podrás iniciar sesión ni acceder a tu cuenta. Sin el almacenamiento del carrito no podrás mantener productos entre páginas.</p>
            <p className="mt-3">No usamos cookies opcionales ni de marketing, por lo que no es necesario un banner de consentimiento de cookies según la normativa vigente para cookies técnicas esenciales.</p>
          </section>

          <section>
            <h2 className="text-white font-black uppercase tracking-widest text-xs mb-3">5. Cómo gestionar o eliminar las cookies</h2>
            <p className="mb-3">Puedes gestionar y eliminar cookies desde la configuración de tu navegador:</p>
            <ul className="flex flex-col gap-2 pl-4 list-disc">
              <li><span className="text-white font-bold">Chrome:</span> Configuración → Privacidad y seguridad → Cookies y otros datos de sitios</li>
              <li><span className="text-white font-bold">Firefox:</span> Configuración → Privacidad y seguridad → Cookies y datos del sitio</li>
              <li><span className="text-white font-bold">Safari:</span> Preferencias → Privacidad → Gestionar datos de sitios web</li>
              <li><span className="text-white font-bold">Edge:</span> Configuración → Privacidad, búsqueda y servicios → Cookies</li>
            </ul>
            <p className="mt-3">Ten en cuenta que deshabilitar las cookies necesarias puede afectar al funcionamiento de la plataforma e impedir el inicio de sesión.</p>
          </section>

          <section>
            <h2 className="text-white font-black uppercase tracking-widest text-xs mb-3">6. Cambios en esta política</h2>
            <p>Podemos actualizar esta política de cookies cuando sea necesario. Cualquier cambio relevante se comunicará mediante un aviso en la plataforma. La fecha de última actualización siempre aparecerá al inicio de este documento.</p>
          </section>

          <section>
            <h2 className="text-white font-black uppercase tracking-widest text-xs mb-3">7. Contacto</h2>
            <p>Para cualquier consulta sobre el uso de cookies en FitMeal, contáctanos en <a href="mailto:fitmealtks@gmail.com" className="text-[#D30F15] hover:underline">fitmealtks@gmail.com</a>.</p>
          </section>

        </div>
      </div>
    </div>
  );
}
