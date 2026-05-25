 import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import { IMAGENES, PESOS, RATINGS, CATEGORIAS } from '../constants/products';

function ProductCard({ product, index }) {
  const imagen = product.imagen_url || IMAGENES[product.nombre_producto];
  const precio = parseFloat(product.precio).toFixed(2).replace('.', ',');
  const peso = PESOS[product.nombre_producto] || '';
  const rating = RATINGS[product.nombre_producto] || 0;
  const navigate = useNavigate();

  const goToProduct = () => {
    navigate(`/products/${product.id_producto}`); 
  };

  const handleComprarClick = (e) => {
    e.stopPropagation();
    goToProduct();
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      onClick={goToProduct}
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
            onClick={handleComprarClick}
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

  //backend

  useEffect(() => {
    api.get('/api/products')
      .then((respuestaProductos) => setProductos(respuestaProductos.data.products || []))
      .catch(() => setError('No se pudieron cargar los productos.'))
      .finally(() => setCargando(false));
  }, []);

  const productosFiltrados = productos.filter((producto) => producto.id_categoria === categoriaActiva);

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
