export default function Terminos() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-32 pb-16 px-6">
      <div className="max-w-3xl mx-auto">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-2">Legal</p>
        <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">Términos de <span className="text-[#D30F15]">Uso</span></h1>
        <p className="text-white/20 text-xs mb-10">Última actualización: enero 2026</p>

        <div className="flex flex-col gap-10 text-white/60 text-sm leading-relaxed">

          <section>
            <h2 className="text-white font-black uppercase tracking-widest text-xs mb-3">1. Aceptación de los términos</h2>
            <p>Al acceder y usar la plataforma FitMeal aceptas quedar vinculado por estos términos y condiciones de uso. Si no estás de acuerdo con alguno de los términos aquí expuestos, te pedimos que no uses la plataforma. El uso continuado de FitMeal implica la aceptación plena de estos términos.</p>
          </section>

          <section>
            <h2 className="text-white font-black uppercase tracking-widest text-xs mb-3">2. Descripción del servicio</h2>
            <p>FitMeal es una plataforma de nutrición y entrenamiento que ofrece planes de comida personalizados, recetas, rutinas de ejercicio, seguimiento de objetivos y una tienda de productos de suplementación. Algunos servicios requieren registro previo.</p>
          </section>

          <section>
            <h2 className="text-white font-black uppercase tracking-widest text-xs mb-3">3. Registro y cuentas</h2>
            <p className="mb-3">Para acceder a determinadas funcionalidades debes crear una cuenta. Al registrarte te comprometes a:</p>
            <ul className="flex flex-col gap-2 pl-4 list-disc">
              <li>Proporcionar información veraz, completa y actualizada.</li>
              <li>Mantener la confidencialidad de tu contraseña.</li>
              <li>Notificar inmediatamente cualquier uso no autorizado de tu cuenta a <a href="mailto:fitmealtks@gmail.com" className="text-[#D30F15] hover:underline">fitmealtks@gmail.com</a>.</li>
              <li>Ser responsable de todas las actividades realizadas bajo tu cuenta.</li>
            </ul>
            <p className="mt-3">FitMeal se reserva el derecho de suspender o eliminar cuentas que incumplan estos términos.</p>
          </section>

          <section>
            <h2 className="text-white font-black uppercase tracking-widest text-xs mb-3">4. Uso permitido</h2>
            <p className="mb-3">Queda expresamente prohibido:</p>
            <ul className="flex flex-col gap-2 pl-4 list-disc">
              <li>Usar la plataforma para actividades ilegales o contrarias a la moral.</li>
              <li>Intentar acceder a sistemas o datos de otros usuarios sin autorización.</li>
              <li>Reproducir, distribuir o modificar contenidos de FitMeal sin permiso expreso.</li>
              <li>Usar bots, scrapers u otros medios automatizados para acceder a la plataforma.</li>
              <li>Enviar spam, publicidad no solicitada o contenido malicioso.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-black uppercase tracking-widest text-xs mb-3">5. Compras y pedidos</h2>
            <p className="mb-3">Al realizar una compra en FitMeal:</p>
            <ul className="flex flex-col gap-2 pl-4 list-disc">
              <li>Los pedidos realizados son vinculantes una vez confirmados.</li>
              <li>Los precios incluyen IVA y pueden cambiar sin previo aviso.</li>
              <li>El envío es gratuito en pedidos superiores a 49 EUR. Para pedidos inferiores se aplica un coste de 4,99 EUR.</li>
              <li>Recibirás una confirmación de pedido por email en la dirección que proporcionaste.</li>
              <li>Los precios finales de los productos se calculan en el servidor para garantizar su integridad.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-black uppercase tracking-widest text-xs mb-3">6. Propiedad intelectual</h2>
            <p>Todos los contenidos de FitMeal (textos, imágenes, logotipos, código, diseño) son propiedad de FitMeal o de sus licenciantes y están protegidos por las leyes de propiedad intelectual. No se concede ninguna licencia sobre dichos contenidos salvo para el uso personal y no comercial de la plataforma.</p>
          </section>

          <section>
            <h2 className="text-white font-black uppercase tracking-widest text-xs mb-3">7. Limitación de responsabilidad</h2>
            <p>FitMeal no se hace responsable de los daños derivados del uso o imposibilidad de uso de la plataforma, interrupciones del servicio, errores en los contenidos o pérdida de datos. Los contenidos de nutrición y entrenamiento tienen carácter informativo y no sustituyen el consejo de un profesional de la salud.</p>
          </section>

          <section>
            <h2 className="text-white font-black uppercase tracking-widest text-xs mb-3">8. Modificaciones del servicio</h2>
            <p>FitMeal se reserva el derecho de modificar, suspender o discontinuar cualquier parte del servicio en cualquier momento, con o sin previo aviso. También podemos actualizar estos términos periódicamente, publicando la nueva versión en esta página.</p>
          </section>

          <section>
            <h2 className="text-white font-black uppercase tracking-widest text-xs mb-3">9. Legislación aplicable</h2>
            <p>Estos términos se rigen por la legislación española. Para cualquier controversia derivada del uso de la plataforma, las partes se someten a los juzgados y tribunales de Barcelona, salvo que la normativa de consumidores establezca otro fuero.</p>
          </section>

          <section>
            <h2 className="text-white font-black uppercase tracking-widest text-xs mb-3">10. Contacto</h2>
            <p>Si tienes cualquier duda sobre estos términos, escríbenos a <a href="mailto:fitmealtks@gmail.com" className="text-[#D30F15] hover:underline">fitmealtks@gmail.com</a>.</p>
          </section>

        </div>
      </div>
    </div>
  );
}
