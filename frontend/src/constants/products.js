export const IMAGENES = {
  'Protein Whey Coffee':    '/products/whey-coffee.png',
  'Protein Whey Chocolate': '/products/whey-chocolate.jpg',
  'Protein Whey Vanilla':   '/products/whey-vanilla.png',
  'Protein Cacahuetes':     '/products/cacahuetes.png',
  'Protein Avellanas':      '/products/avellanas.jpg',
  'Protein Stracciatella':  '/products/stracciatella.png',
  'Protein Coconut':        '/products/coconut.png',
  'Protein Pistacho':       '/products/pistacho.png',
  'Vitamina Omega-3':       '/products/vitamina-omega3.jpg',
  'Vitamina Zinc':          '/products/vitamina-zinc.jpg',
  'Melatonina':             '/products/melatonina.jpg',
  'Vitamina Kidney':        '/products/vitamina-kidney.png',
  'Vitamina Magnesium':     '/products/vitamina-magnesium.png',
  'Protein Probiotic+':     '/products/protein-probiotic.jpg',
  'Protein Whey Coffee Bar':   '/products/bar-whey-coffee.jpg',
  'Protein Cacahuetes Bar':    '/products/bar-cacahuetes.png',
  'Protein Avellanas Bar':     '/products/bar-avellanas.jpg',
  'Protein Stracciatella Bar': '/products/bar-stracciatella.jpg',
  'Protein Coconut Bar':       '/products/bar-coconut.png',
  'Protein Pistacho Bar':      '/products/bar-pistacho.png',
};

export const PESOS = {
  'Protein Whey Coffee': '1 kg', 'Protein Whey Chocolate': '1 kg', 'Protein Whey Vanilla': '1 kg',
  'Protein Cacahuetes': '750 g', 'Protein Avellanas': '750 g', 'Protein Stracciatella': '1 kg',
  'Protein Coconut': '1 kg', 'Protein Pistacho': '750 g',
  'Vitamina Omega-3': '90 cáps', 'Vitamina Zinc': '120 cáps', 'Melatonina': '60 cáps',
  'Vitamina Kidney': '90 cáps', 'Vitamina Magnesium': '120 cáps', 'Protein Probiotic+': '60 cáps',
  'Protein Whey Coffee Bar': '12x55g', 'Protein Cacahuetes Bar': '12x55g', 'Protein Avellanas Bar': '12x50g',
  'Protein Stracciatella Bar': '12x55g', 'Protein Coconut Bar': '12x50g', 'Protein Pistacho Bar': '12x50g',
};

export const RATINGS = {
  'Protein Whey Coffee': 5, 'Protein Whey Chocolate': 4, 'Protein Whey Vanilla': 4,
  'Protein Cacahuetes': 5, 'Protein Avellanas': 4, 'Protein Stracciatella': 5,
  'Protein Coconut': 3, 'Protein Pistacho': 4,
  'Vitamina Omega-3': 5, 'Vitamina Zinc': 4, 'Melatonina': 5,
  'Vitamina Kidney': 3, 'Vitamina Magnesium': 4, 'Protein Probiotic+': 4,
  'Protein Whey Coffee Bar': 5, 'Protein Cacahuetes Bar': 4, 'Protein Avellanas Bar': 4,
  'Protein Stracciatella Bar': 5, 'Protein Coconut Bar': 3, 'Protein Pistacho Bar': 4,
};

export const CATEGORIAS = [
  { label: 'Proteinas', id: 5 },
  { label: 'Vitaminas', id: 6 },
  { label: 'Barritas',  id: 7 },
];

export const OPCIONES_CATEGORIA = {
  5: {
    tieneSabor: true,
    sabores: ['Chocolate', 'Vainilla', 'Fresa', 'Cookies & Cream', 'Natural', 'Caramelo'],
    tallas: ['500g', '1kg', '2kg', '5kg'],
    precios: { '500g': 24.99, '1kg': 39.99, '2kg': 69.99, '5kg': 149.99 },
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
