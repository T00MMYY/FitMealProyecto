import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line no-unused-vars
import api from '../api/axios';


const IMAGENES = {
  // Proteinas
  'Protein Whey Coffee':    '/products/whey-coffee.png',
  'Protein Whey Chocolate': '/products/whey-chocolate.jpg',
  'Protein Whey Vanilla':   '/products/whey-vanilla.png',
  'Protein Cacahuetes':     '/products/cacahuetes.png',
  'Protein Avellanas':      '/products/avellanas.jpg',
  'Protein Stracciatella':  '/products/stracciatella.png',
  'Protein Coconut':        '/products/coconut.png',
  'Protein Pistacho':       '/products/pistacho.png',
  // Vitaminas
  'Vitamina Omega-3':    '/products/vitamina-omega3.jpg',
  'Vitamina Zinc':       '/products/vitamina-zinc.jpg',
  'Melatonina':          '/products/melatonina.jpg',
  'Vitamina Kidney':     '/products/vitamina-kidney.png',
  'Vitamina Magnesium':  '/products/vitamina-magnesium.png',
  'Protein Probiotic+':  '/products/protein-probiotic.jpg',
  // Barritas
  'Protein Whey Coffee Bar':   '/products/bar-whey-coffee.jpg',
  'Protein Cacahuetes Bar':    '/products/bar-cacahuetes.png',
  'Protein Avellanas Bar':     '/products/bar-avellanas.jpg',
  'Protein Stracciatella Bar': '/products/bar-stracciatella.jpg',
  'Protein Coconut Bar':       '/products/bar-coconut.png',
  'Protein Pistacho Bar':      '/products/bar-pistacho.png',
};


const PESOS = {
  'Protein Whey Coffee': '1 kg', 'Protein Whey Chocolate': '1 kg', 'Protein Whey Vanilla': '1 kg',
  'Protein Cacahuetes': '750 g', 'Protein Avellanas': '750 g', 'Protein Stracciatella': '1 kg',
  'Protein Coconut': '1 kg', 'Protein Pistacho': '750 g',
  'Vitamina Omega-3': '90 cáps', 'Vitamina Zinc': '120 cáps', 'Melatonina': '60 cáps',
  'Vitamina Kidney': '90 cáps', 'Vitamina Magnesium': '120 cáps', 'Protein Probiotic+': '60 cáps',
  'Protein Whey Coffee Bar': '12x55g', 'Protein Cacahuetes Bar': '12x55g', 'Protein Avellanas Bar': '12x50g',
  'Protein Stracciatella Bar': '12x55g', 'Protein Coconut Bar': '12x50g', 'Protein Pistacho Bar': '12x50g',
};

const RATINGS = {
  'Protein Whey Coffee': 5, 'Protein Whey Chocolate': 4, 'Protein Whey Vanilla': 4,
  'Protein Cacahuetes': 5, 'Protein Avellanas': 4, 'Protein Stracciatella': 5,
  'Protein Coconut': 3, 'Protein Pistacho': 4,
  'Vitamina Omega-3': 5, 'Vitamina Zinc': 4, 'Melatonina': 5,
  'Vitamina Kidney': 3, 'Vitamina Magnesium': 4, 'Protein Probiotic+': 4,
  'Protein Whey Coffee Bar': 5, 'Protein Cacahuetes Bar': 4, 'Protein Avellanas Bar': 4,
  'Protein Stracciatella Bar': 5, 'Protein Coconut Bar': 3, 'Protein Pistacho Bar': 4,
};

const CATEGORIAS = [
  { label: 'Proteinas', id: 5 },
  { label: 'Vitaminas', id: 6 },
  { label: 'Barritas',  id: 7 },
];

function ProductCard({ product, index }) {
  const imagen = product.imagen_url || IMAGENES[product.nombre_producto];
  const precio = parseFloat(product.precio).toFixed(2).replace('.', ',');
  const peso = PESOS[product.nombre_producto] || '';
  const rating = RATINGS[product.nombre_producto] || 0;
  const navigate = useNavigate();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => navigate(`/products/${product.id_producto}`)}
      className="rounded-2xl overflow-hidden cursor-pointer group bg-zinc-950 flex flex-col hover:shadow-[0_0_30px_rgba(211,15,21,0.15)] transition-shadow duration-500"
      style={{ border: '1px solid #222' }}
    >
      <div className="relative overflow-hidden" style={{ height: '280px' }}>
        {imagen ? (
          <img
            src={imagen}
            alt={product.nombre_producto}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-gray-600 text-sm">
            Sin imagen
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        {peso && (
          <span className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-white/10">
            {peso}
          </span>
        )}
      </div>

      <div className="p-5 border-t flex flex-col flex-1 gap-2" style={{ borderColor: '#222' }}>
        <p className="text-white font-black text-sm uppercase tracking-wide">{product.nombre_producto}</p>
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((n) => (
            <span key={n} className="text-sm"
              style={{ color: n <= rating ? '#FBBF24' : '#333' }}>&#9733;</span>
          ))}
          <span className="text-white/20 text-[10px] ml-1.5 self-center">{rating}/5</span>
        </div>
        <div className="flex items-center justify-between mt-auto pt-3" style={{ borderTop: '1px solid #1a1a1a' }}>
          <p className="text-white font-black text-xl">{precio}&euro;</p>
          <button
            onClick={(e) => { e.stopPropagation(); navigate(`/products/${product.id_producto}`); }}
            className="text-[10px] font-black uppercase tracking-widest px-5 py-2 rounded-full transition-all duration-300 cursor-pointer hover:shadow-[0_0_15px_rgba(211,15,21,0.5)] hover:scale-105"
            style={{ background: '#D30F15', color: '#fff' }}
          >
            Comprar
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function Products() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [categoriaActiva, setCategoriaActiva] = useState(5);

  useEffect(() => {
    api.get('/api/products')
      .then((res) => setProductos(res.data.products || []))
      .catch(() => setError('No se pudieron cargar los productos.'))
      .finally(() => setCargando(false));
  }, []);

  const productosFiltrados = productos.filter((p) => p.id_categoria === categoriaActiva);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-primary selection:text-black">

      {/* COVER */}
      <div className="flex flex-col items-center justify-center py-20 gap-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(211,15,21,0.08)_0%,transparent_70%)]" />
        <motion.h1
          initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-7xl md:text-8xl font-black uppercase italic tracking-tighter leading-[0.85] relative"
        >
          PRO<span className="text-primary">DUCTOS</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-white/40 text-sm tracking-[0.3em] uppercase font-medium relative"
        >
          Suplementación de élite
        </motion.p>
      </div>

      {/* CATEGORIAS */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="flex justify-center gap-3 pb-10"
      >
        {CATEGORIAS.map((cat) => ( 
          <button
            key={cat.id}
            onClick={() => setCategoriaActiva(cat.id)}
            className="px-7 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 cursor-pointer"
            style={{
              background: categoriaActiva === cat.id ? '#D30F15' : 'transparent',
              color:      categoriaActiva === cat.id ? '#fff' : 'rgba(255,255,255,0.5)',
              border:     '1px solid ' + (categoriaActiva === cat.id ? '#D30F15' : 'rgba(255,255,255,0.1)'),
              boxShadow:  categoriaActiva === cat.id ? '0 0 20px rgba(211,15,21,0.4)' : 'none',
            }}
          >
            {cat.label}
          </button>
        ))}
      </motion.div>

      {/* GRID */}
      <div className="max-w-6xl mx-auto px-6 pb-20">
        {cargando && (
          <div className="flex items-center justify-center py-20">
            <motion.p
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-primary font-black italic text-2xl uppercase tracking-widest"
            >
              Cargando...
            </motion.p>
          </div>
        )}
        {error && <p className="text-center text-red-400">{error}</p>}
        {!cargando && !error && productosFiltrados.length === 0 && (
          <p className="text-center text-white/20 tracking-widest uppercase text-sm py-20">Próximamente</p>
        )}
        {!cargando && !error && productosFiltrados.length > 0 && (
          <AnimatePresence mode="wait">
            <motion.div
              key={categoriaActiva}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7"
            >
              {productosFiltrados.map((producto, i) => (
                <ProductCard key={producto.id_producto} product={producto} index={i} />
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
