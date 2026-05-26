export default function Privacidad() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-32 pb-16 px-6">
      <div className="max-w-3xl mx-auto">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-2">Legal</p>
        <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">Política de <span className="text-[#D30F15]">Privacidad</span></h1>
        <p className="text-white/20 text-xs mb-10">Última actualización: enero 2026</p>

        <div className="flex flex-col gap-10 text-white/60 text-sm leading-relaxed">

          <section>
            <h2 className="text-white font-black uppercase tracking-widest text-xs mb-3">1. Responsable del tratamiento</h2>
            <p>FitMeal es el responsable del tratamiento de los datos personales recogidos a través de esta plataforma. Para cualquier consulta relacionada con el tratamiento de tus datos personales puedes contactarnos en: <a href="mailto:fitmealtks@gmail.com" className="text-[#D30F15] hover:underline">fitmealtks@gmail.com</a></p>
          </section>

          <section>
            <h2 className="text-white font-black uppercase tracking-widest text-xs mb-3">2. Datos que recogemos</h2>
            <p className="mb-3">Recogemos los siguientes tipos de datos personales:</p>
            <ul className="flex flex-col gap-2 pl-4 list-disc">
              <li><span className="text-white font-bold">Datos de registro:</span> nombre, apellidos, dirección de email y contraseña cifrada.</li>
              <li><span className="text-white font-bold">Datos de perfil:</span> fecha de nacimiento, teléfono, datos físicos (peso, altura, objetivo) introducidos voluntariamente en el onboarding.</li>
              <li><span className="text-white font-bold">Datos de pedidos:</span> dirección de envío, productos comprados, importe total y fecha.</li>
              <li><span className="text-white font-bold">Datos de uso:</span> páginas visitadas, rutinas guardadas y recetas consultadas dentro de la plataforma.</li>
              <li><span className="text-white font-bold">Datos de contacto:</span> nombre, email y mensaje cuando usas el formulario de contacto.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-black uppercase tracking-widest text-xs mb-3">3. Finalidad del tratamiento</h2>
            <p className="mb-3">Utilizamos tus datos para los siguientes fines:</p>
            <ul className="flex flex-col gap-2 pl-4 list-disc">
              <li>Gestionar tu cuenta y acceso a la plataforma.</li>
              <li>Procesar y gestionar tus pedidos de productos.</li>
              <li>Enviarte confirmaciones de pedido y comunicaciones relacionadas con tu cuenta por email.</li>
              <li>Personalizar tu experiencia en la plataforma según tu perfil y objetivos.</li>
              <li>Responder a tus consultas enviadas a través del formulario de contacto.</li>
              <li>Mejorar el funcionamiento y los contenidos de la plataforma.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-black uppercase tracking-widest text-xs mb-3">4. Base legal</h2>
            <p>El tratamiento de tus datos se basa en la ejecución del contrato de uso de la plataforma (art. 6.1.b del RGPD), el cumplimiento de obligaciones legales (art. 6.1.c del RGPD) y, en su caso, tu consentimiento expreso (art. 6.1.a del RGPD).</p>
          </section>

          <section>
            <h2 className="text-white font-black uppercase tracking-widest text-xs mb-3">5. Conservación de los datos</h2>
            <p>Los datos se conservan durante el tiempo en que tu cuenta esté activa. Si eliminas tu cuenta, tus datos serán suprimidos en un plazo máximo de 30 días, salvo que la normativa aplicable exija su conservación por un período mayor (por ejemplo, datos de facturación que deben conservarse durante 5 años según la legislación fiscal española).</p>
          </section>

          <section>
            <h2 className="text-white font-black uppercase tracking-widest text-xs mb-3">6. Cesión de datos a terceros</h2>
            <p>No cedemos tus datos personales a terceros con fines comerciales. Únicamente podemos compartir datos con proveedores de servicios técnicos necesarios para el funcionamiento de la plataforma (como el servicio de envío de emails), siempre bajo acuerdos de confidencialidad y en cumplimiento del RGPD.</p>
          </section>

          <section>
            <h2 className="text-white font-black uppercase tracking-widest text-xs mb-3">7. Transferencias internacionales</h2>
            <p>No realizamos transferencias internacionales de datos fuera del Espacio Económico Europeo. En caso de que algún proveedor técnico esté ubicado fuera del EEE, nos aseguraremos de que existan las garantías adecuadas conforme al RGPD.</p>
          </section>

          <section>
            <h2 className="text-white font-black uppercase tracking-widest text-xs mb-3">8. Tus derechos</h2>
            <p className="mb-3">Como titular de los datos tienes derecho a:</p>
            <ul className="flex flex-col gap-2 pl-4 list-disc">
              <li><span className="text-white font-bold">Acceso:</span> obtener confirmación sobre si tratamos tus datos y acceder a ellos.</li>
              <li><span className="text-white font-bold">Rectificación:</span> corregir datos inexactos o incompletos.</li>
              <li><span className="text-white font-bold">Supresión:</span> solicitar la eliminación de tus datos cuando ya no sean necesarios.</li>
              <li><span className="text-white font-bold">Oposición:</span> oponerte al tratamiento de tus datos en determinadas circunstancias.</li>
              <li><span className="text-white font-bold">Portabilidad:</span> recibir tus datos en un formato estructurado y de uso común.</li>
              <li><span className="text-white font-bold">Limitación:</span> solicitar la restricción del tratamiento en ciertos supuestos.</li>
            </ul>
            <p className="mt-3">Para ejercer cualquiera de estos derechos, escríbenos a <a href="mailto:fitmealtks@gmail.com" className="text-[#D30F15] hover:underline">fitmealtks@gmail.com</a>. También tienes derecho a presentar una reclamación ante la Agencia Española de Protección de Datos (aepd.es).</p>
          </section>

          <section>
            <h2 className="text-white font-black uppercase tracking-widest text-xs mb-3">9. Seguridad</h2>
            <p>Aplicamos medidas técnicas y organizativas adecuadas para proteger tus datos personales frente a accesos no autorizados, pérdida o destrucción. Las contraseñas se almacenan cifradas y las sesiones se gestionan mediante tokens httpOnly para mayor seguridad.</p>
          </section>

          <section>
            <h2 className="text-white font-black uppercase tracking-widest text-xs mb-3">10. Cambios en esta política</h2>
            <p>Podemos actualizar esta política de privacidad periódicamente. Te notificaremos cualquier cambio significativo por email o mediante un aviso destacado en la plataforma. La fecha de última actualización siempre aparecerá al inicio de este documento.</p>
          </section>

        </div>
      </div>
    </div>
  );
}
