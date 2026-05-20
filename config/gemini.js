const { GoogleGenerativeAI } = require('@google/generative-ai');

if (!process.env.GEMINI_API_KEY) {
  console.warn('⚠️  GEMINI_API_KEY no configurada — funciones de IA desactivadas');
}

const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

const getModel = () => {
  if (!genAI) throw new Error('GEMINI_API_KEY no configurada en el servidor');
  return genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
};

module.exports = { getModel };
