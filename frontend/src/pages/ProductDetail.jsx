import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars
import api from '../api/axios';
import { useCart } from '../context/CartContext';

const IMAGENES = {
  'Protein Whey Coffee': '/products/whey-coffee.png',
  'Protein Whey Chocolate': '/products/whey-chocolate.jpg',
  'Protein Whey Vanilla': '/products/whey-vanilla.png',
  'Protein Cacahuetes': '/products/cacahuetes.png',
  'Protein Avellanas': '/products/avellanas.jpg',
  'Protein Stracciatella': '/products/stracciatella.png',
  'Protein Coconut': '/products/coconut.png',
  'Protein Pistacho': '/products/pistacho.png',
  'Vitamina Omega-3': '/products/vitamina-omega3.jpg',
  'Vitamina Zinc': '/products/vitamina-zinc.jpg',
  'Melatonina': '/products/melatonina.jpg',
  'Vitamina Kidney': '/products/vitamina-kidney.png',
  'Vitamina Magnesium': '/products/vitamina-magnesium.png',
  'Protein Probiotic+': '/products/protein-probiotic.jpg',
  'Protein Whey Coffee Bar': '/products/bar-whey-coffee.jpg',
  'Protein Cacahuetes Bar': '/products/bar-cacahuetes.png',
  'Protein Avellanas Bar': '/products/bar-avellanas.jpg',
  'Protein Stracciatella Bar': '/products/bar-stracciatella.jpg',
  'Protein Coconut Bar': '/products/bar-coconut.png',
  'Protein Pistacho Bar': '/products/bar-pistacho.png',
};

const OPCIONES_CATEGORIA = {
  5: {
    tieneSabor: true,
    sabores: ['Chocolate', 'Vainilla', 'Fresa', 'Cookies & Cream', 'Natural', 'Caramelo'],
    tallas: ['500g', '1kg', '2kg', '5kg'],
    precios: { '500g': 24.99, '1kg': null, '2kg': 41.99, '5kg': 89.99 },
    labelTallas: 'Cantidad',
  },
  6: {
    tieneSabor: false,
    sabores: [],
    tallas: ['30 caps', '60 caps', '90 caps', '180 caps'],
    precios: { '30 caps': 9.99, '60 caps': 17.99, '90 caps': 24.99, '180 caps': 44.99 },
    labelTallas: 'Unidades',
  },
  7: {
    tieneSabor: true,
    sabores: ['Chocolate', 'Vainilla', 'Caramelo', 'Stracciatella', 'Coco'],
    tallas: ['1 ud', 'Caja 6', 'Caja 12', 'Caja 24'],
    precios: { '1 ud': 2.49, 'Caja 6': 13.99, 'Caja 12': 25.99, 'Caja 24': 47.99 },
    labelTallas: 'Formato',
  },
};

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [estrellas, setEstrellas] = useState(0);
  const [hoverStar, setHoverStar] = useState(0);
  const [talla, setTalla] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [precioActual, setPrecioActual] = useState(null);

  useEffect(() => {
    api.get(`/api/products/${id}`)
      .then((res) => {
        const p = res.data.product;
        setProducto(p);
        const opciones = OPCIONES_CATEGORIA[p.id_categoria] || OPCIONES_CATEGORIA[5];
        const tallaPorDefecto = opciones.tallas[1] || opciones.tallas[0];
        setTalla(tallaPorDefecto);
        const precioPorDefecto = opciones.precios[tallaPorDefecto] ?? parseFloat(p.precio);
        setPrecioActual(precioPorDefecto);
      })
      .finally(() => setCargando(false));
  }, [id]);

  if (cargando) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <motion.p
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-primary font-black italic text-2xl uppercase tracking-widest"
        >
          Cargando...
        </motion.p>
      </div>
    );
  }

  if (!producto) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <p className="text-white/30 font-black italic text-xl uppercase tracking-widest">Producto no encontrado</p>
      </div>
    );
  }

  const opciones = OPCIONES_CATEGORIA[producto.id_categoria] || OPCIONES_CATEGORIA[5];
  const imagen = producto.imagen_url || IMAGENES[producto.nombre_producto];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-primary selection:text-black relative overflow-hidden">
      <div className="absolute top-0 left-1/3 w-[900px] h-[700px] bg-[radial-gradient(ellipse_at_center,rgba(211,15,21,0.05)_0%,transparent_65%)] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(211,15,21,0.03)_0%,transparent_70%)] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto px-8 pt-8 relative z-10"
      >
        <button
          onClick={() => navigate('/products')}
          className="text-white/30 hover:text-primary text-[10px] font-black uppercase tracking-[0.3em] transition-colors duration-300 cursor-pointer flex items-center gap-2 group"
        >
          <span className="text-base group-hover:-translate-x-1 transition-transform duration-300">&larr;</span> Volver a productos
        </button>
      </motion.div>

      <div className="max-w-7xl mx-auto px-8 py-10 grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16 items-start relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -60, scale: 0.92 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-3 relative"
        >
          <div className="rounded-3xl overflow-hidden group relative bg-gradient-to-br from-zinc-900 to-zinc-950" style={{ height: '600px' }}>
            {imagen ? (
              <img
                src={imagen}
                alt={producto.nombre_producto}
                className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-1000 ease-out"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-600 text-sm">
                Sin imagen
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/60 via-transparent to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0a0a0a]/20 pointer-events-none" />
            <div className="absolute inset-0 rounded-3xl pointer-events-none" style={{ boxShadow: 'inset 0 0 60px rgba(0,0,0,0.3)' }} />
          </div>
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-primary/10 blur-2xl rounded-full" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-2 flex flex-col gap-6 lg:sticky lg:top-28"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-primary/80 bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20">
              {producto.id_categoria === 5 ? 'Proteina' : producto.id_categoria === 6 ? 'Vitamina' : 'Barrita'}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-4xl lg:text-5xl font-black uppercase italic tracking-tighter leading-[0.9]"
          >
            {producto.nombre_producto}
          </motion.h1>

          {producto.descripcion && (
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="text-white/35 text-sm leading-relaxed"
            >
              {producto.descripcion}
            </motion.p>
          )}

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="flex gap-1.5 items-center"
          >
            {[1, 2, 3, 4, 5].map((n) => {
              const activa = n <= (hoverStar || estrellas);
              return (
                <span
                  key={n}
                  onClick={() => setEstrellas(n)}
                  onMouseEnter={() => setHoverStar(n)}
                  onMouseLeave={() => setHoverStar(0)}
                  className="cursor-pointer text-2xl transition-all duration-200 hover:scale-130"
                  style={{
                    color: activa ? '#FBBF24' : '#333',
                    filter: activa ? 'drop-shadow(0 0 4px rgba(251,191,36,0.4))' : 'none',
                  }}
                >
                  &#9733;
                </span>
              );
            })}
            {estrellas > 0 && (
              <span className="text-amber-400/60 text-xs ml-2 font-bold">{estrellas}.0</span>
            )}
            {estrellas === 0 && (
              <span className="text-white/15 text-[10px] ml-2 uppercase tracking-widest">Valorar</span>
            )}
          </motion.div>

          <div className="h-px bg-gradient-to-r from-white/5 via-white/10 to-white/5" />

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
          >
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/25 mb-3 font-black">{opciones.labelTallas}</p>
            <div className="grid grid-cols-2 gap-2">
              {opciones.tallas.map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setTalla(t);
                    const nuevoPrecio = opciones.precios[t] ?? parseFloat(producto.precio);
                    setPrecioActual(nuevoPrecio);
                  }}
                  className="py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 cursor-pointer"
                  style={{
                    background: talla === t ? '#D30F15' : 'rgba(255,255,255,0.03)',
                    color: talla === t ? '#fff' : 'rgba(255,255,255,0.35)',
                    border: `1px solid ${talla === t ? '#D30F15' : 'rgba(255,255,255,0.06)'}`,
                    boxShadow: talla === t ? '0 0 25px rgba(211,15,21,0.25)' : 'none',
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.7 }}
          >
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/25 mb-3 font-black">Unidades</p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold transition-all duration-200 cursor-pointer hover:bg-white/10"
                style={{ border: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)' }}
              >
                -
              </button>
              <span className="text-xl font-black w-8 text-center">{cantidad}</span>
              <button
                onClick={() => setCantidad(cantidad + 1)}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold transition-all duration-200 cursor-pointer hover:bg-white/10"
                style={{ border: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)' }}
              >
                +
              </button>
            </div>
          </motion.div>

          <div className="h-px bg-gradient-to-r from-white/5 via-white/10 to-white/5" />

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.8 }}
            className="flex flex-col gap-5"
          >
            <div>
              <p className="text-[9px] uppercase tracking-[0.4em] text-white/15 font-bold mb-1">Precio total</p>
              <p className="text-5xl font-black tracking-tight">
                {((precioActual ?? parseFloat(producto.precio)) * cantidad).toFixed(2)}
                <span className="text-2xl text-white/40 ml-1">EUR</span>
              </p>
            </div>

            <button
              onClick={() =>
                addToCart({
                  id: producto.id_producto,
                  nombre: producto.nombre_producto,
                  precio: precioActual ?? Number(producto.precio),
                  talla,
                  cantidad,
                  imagen,
                })
              }
              className="w-full py-4 rounded-2xl font-black uppercase tracking-[0.25em] text-[12px] cursor-pointer transition-all duration-400 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(211,15,21,0.4)] active:scale-[0.98]"
              style={{ background: 'linear-gradient(135deg, #D30F15 0%, #a00b10 100%)', color: '#fff' }}
            >
              Anadir al carrito
            </button>
            <p className="text-[9px] text-white/15 text-center uppercase tracking-widest">Envio gratis a partir de 49 EUR</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
