const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

async function sendContactEmail(req, res) {
  const { nombre, email, telefono, mensaje } = req.body;

  if (!nombre || !email || !mensaje) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  try {
    await transporter.sendMail({
      from: `"FitMeal" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      subject: `Nuevo mensaje de contacto — ${nombre}`,
      text: `Nombre: ${nombre}\nEmail: ${email}\nTeléfono: ${telefono || 'No proporcionado'}\n\nMensaje:\n${mensaje}`,
    });

    await transporter.sendMail({
      from: `"FitMeal" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Hemos recibido tu mensaje — FitMeal',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #ffffff; padding: 40px; border-radius: 12px;">
          <h1 style="color: #D30F15; font-style: italic; text-transform: uppercase; margin: 0 0 8px;">FITMEAL</h1>
          <h2 style="color: #ffffff; margin: 0 0 16px;">¡Mensaje recibido, ${nombre}!</h2>
          <p style="color: rgba(255,255,255,0.6); margin: 0 0 20px;">Hemos recibido tu mensaje y te responderemos en menos de 24 horas.</p>
          <div style="background: #111111; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 20px; margin-bottom: 24px;">
            <p style="color: rgba(255,255,255,0.4); font-size: 11px; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 8px;">Tu mensaje</p>
            <p style="color: #ffffff; margin: 0;">${mensaje}</p>
          </div>
          <p style="color: rgba(255,255,255,0.4); font-size: 12px; margin: 0;">El equipo de FitMeal</p>
        </div>
      `,
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error enviando email de contacto:', error);
    res.status(500).json({ error: 'Error al enviar el mensaje. Inténtalo de nuevo.' });
  }
}

module.exports = { sendContactEmail };
