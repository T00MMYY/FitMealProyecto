-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Servidor: fitmeal-db:3306
-- Tiempo de generación: 29-04-2026 a las 17:07:44
-- Versión del servidor: 8.0.44
-- Versión de PHP: 8.3.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `fitness_platform`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias_productos`
--

CREATE TABLE `categorias_productos` (
  `id_categoria` int NOT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `categorias_productos`
--

INSERT INTO `categorias_productos` (`id_categoria`, `nombre`, `descripcion`, `created_at`) VALUES
(5, 'Proteinas', 'ProteÃ­nas en polvo y suplementos proteicos', '2026-04-27 14:27:28'),
(6, 'Vitaminas', 'Vitaminas y minerales esenciales', '2026-04-27 14:27:28'),
(7, 'Barritas', 'Barritas proteicas y energÃ©ticas', '2026-04-27 14:27:28');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_pedidos`
--

CREATE TABLE `detalle_pedidos` (
  `id_detalle` int NOT NULL,
  `id_pedido` int NOT NULL,
  `id_producto` int NOT NULL,
  `cantidad` int NOT NULL,
  `precio_unitario` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ejercicios`
--

CREATE TABLE `ejercicios` (
  `id` int NOT NULL,
  `musculo_id` int DEFAULT NULL,
  `titulo` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dificultad` enum('Baja','Media','Alta','No disponible') COLLATE utf8mb4_unicode_ci DEFAULT 'Media',
  `imagen` text COLLATE utf8mb4_unicode_ci,
  `descripcion` text COLLATE utf8mb4_unicode_ci,
  `tipo` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'Fuerza / Hipertrofia',
  `puntos_clave` text COLLATE utf8mb4_unicode_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `ejercicios`
--

INSERT INTO `ejercicios` (`id`, `musculo_id`, `titulo`, `dificultad`, `imagen`, `descripcion`, `tipo`, `puntos_clave`) VALUES
(1, 1, 'Press de Banca', 'Media', '', 'El ejercicio fundamental para el desarrollo del pectoral. Mantén los codos a 45 grados.', 'Resistencia / Cardio', 'Mantén la espalda recta.|Controla la respiración en cada repetición.|No bloquees las articulaciones al final del movimiento.'),
(2, 1, 'Aperturas con Mancuernas', 'Baja', '', 'Enfócate en el estiramiento de las fibras pectorales sin bajar excesivamente los brazos.', 'Fuerza / Hipertrofia', NULL),
(3, 2, 'Curl con Barra', 'Baja', '', 'Mantén los codos pegados al torso y evita el balanceo con la espalda.', 'Fuerza / Hipertrofia', NULL),
(4, 2, 'Curl Martillo', 'Baja', '', 'Excelente para trabajar el braquial y dar grosor al brazo.', 'Fuerza / Hipertrofia', NULL),
(5, 14, 'Press Francés', 'Media', '', 'Extiende los antebrazos hacia arriba manteniendo los hombros estables.', 'Fuerza / Hipertrofia', NULL),
(6, 14, 'Extensión en Polea', 'Baja', '', 'Bloquea los codos a los costados y realiza el movimiento completo de extensión.', 'Fuerza / Hipertrofia', NULL),
(7, 15, 'Dominadas', 'Alta', '', 'Ejercicio de tracción vertical para amplitud dorsal. Pecho arriba al subir.', 'Fuerza / Hipertrofia', NULL),
(8, 15, 'Remo con Barra', 'Alta', '', 'Fundamental para el grosor de la espalda. Mantén el core firme.', 'Fuerza / Hipertrofia', NULL),
(9, 19, 'Sentadilla Libre', 'Alta', '', 'El rey de los ejercicios de pierna. Baja hasta que la cadera rompa el paralelo.', 'Fuerza / Hipertrofia', NULL),
(10, 19, 'Prensa de Piernas', 'Media', '', 'Empuja con los talones y no bloquees las rodillas al final del recorrido.', 'Fuerza / Hipertrofia', NULL),
(11, 20, 'Peso Muerto Rumano', 'Alta', '', 'Mantén la espalda recta y baja la barra pegada a las piernas hasta sentir estiramiento.', 'Fuerza / Hipertrofia', NULL),
(12, 20, 'Curl Femoral Tumbado', 'Baja', '', 'Aísla el isquiotibial controlando la bajada (fase excéntrica).', 'Fuerza / Hipertrofia', NULL),
(13, 16, 'Press Militar', 'Alta', '', 'Empuje vertical sobre la cabeza. No arquees la zona lumbar.', 'Fuerza / Hipertrofia', NULL),
(14, 16, 'Elevaciones Laterales', 'Baja', '', 'Trabajo del deltoides lateral para hombros anchos.', 'Fuerza / Hipertrofia', NULL),
(15, 17, 'Crunch Abdominal', 'Baja', '', 'Flexiona la columna elevando los hombros del suelo sin tirar del cuello.', 'Fuerza / Hipertrofia', NULL),
(16, 17, 'Plancha Isométrica', 'Media', '', 'Mantén el cuerpo recto como una tabla activando abdomen y glúteos.', 'Fuerza / Hipertrofia', NULL),
(17, 18, 'Curl de Muñeca', 'Baja', '', 'Apoya los brazos en un banco y flexiona las muñecas hacia arriba.', 'Fuerza / Hipertrofia', NULL),
(18, 18, 'Paseo del Granjero', 'Media', '', 'Sujeta mancuernas pesadas y camina manteniendo la espalda erguida.', 'Fuerza / Hipertrofia', NULL),
(19, 21, 'Hip Thrust', 'Media', '', 'Apoya la espalda en un banco y eleva la cadera explosivamente.', 'Fuerza / Hipertrofia', NULL),
(20, 21, 'Zancadas (Lunges)', 'Media', '', 'Da un paso largo y baja la rodilla trasera casi hasta tocar el suelo.', 'Fuerza / Hipertrofia', NULL),
(21, 22, 'Elevación de Talones', 'Baja', '', 'Ponte de puntillas y mantén la contracción un segundo arriba.', 'Fuerza / Hipertrofia', NULL),
(22, 22, 'Puntillas en Prensa', 'Baja', '', 'Utiliza la máquina de prensa para realizar extensiones de tobillo.', 'Fuerza / Hipertrofia', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `musculos`
--

CREATE TABLE `musculos` (
  `id` int NOT NULL,
  `nombre_key` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `grupo_muscular` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `musculos`
--

INSERT INTO `musculos` (`id`, `nombre_key`, `grupo_muscular`) VALUES
(1, 'PECHO', 'Tren Superior'),
(2, 'BICEPS', 'Tren Superior'),
(14, 'TRICEPS', 'Tren Superior'),
(15, 'ESPALDA', 'Tren Superior'),
(16, 'HOMBROS', 'Tren Superior'),
(17, 'ABDOMEN', 'Core'),
(18, 'ANTEBRAZO', 'Tren Superior'),
(19, 'CUADRICEPS', 'Tren Inferior'),
(20, 'FEMORAL', 'Tren Inferior'),
(21, 'GLUTEOS', 'Tren Inferior'),
(22, 'GEMELOS', 'Tren Inferior');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedidos`
--

CREATE TABLE `pedidos` (
  `id_pedido` int NOT NULL,
  `id_usuario` int NOT NULL,
  `fecha_pedido` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `total` decimal(10,2) NOT NULL,
  `estado` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT 'pendiente',
  `direccion_envio` text COLLATE utf8mb4_unicode_ci,
  `metodo_pago` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `planes_suscripcion`
--

CREATE TABLE `planes_suscripcion` (
  `id_plan` int NOT NULL,
  `nombre_plan` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_unicode_ci,
  `precio_mensual` decimal(10,2) NOT NULL,
  `duracion_dias` int DEFAULT '30',
  `caracteristicas` text COLLATE utf8mb4_unicode_ci,
  `estado` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT 'activo',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id_producto` int NOT NULL,
  `nombre_producto` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_unicode_ci,
  `precio` decimal(10,2) NOT NULL,
  `stock` int DEFAULT '0',
  `id_categoria` int DEFAULT NULL,
  `imagen_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `estado` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT 'disponible',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id_producto`, `nombre_producto`, `descripcion`, `precio`, `stock`, `id_categoria`, `imagen_url`, `estado`, `created_at`, `updated_at`) VALUES
(1, 'Vitamina Omega-3', 'Suplemento de Ã¡cidos grasos Omega-3 ESN Total Kinetic Sport', 30.99, 50, 6, NULL, 'disponible', '2026-04-27 14:27:28', '2026-04-27 14:27:28'),
(2, 'Vitamina Zinc', 'Suplemento de Zinc ESN TKS para el sistema inmunolÃ³gico', 31.99, 50, 6, NULL, 'disponible', '2026-04-27 14:27:28', '2026-04-27 14:27:28'),
(3, 'Melatonina', 'Melatonina ESN Total Kinetic Sport para mejorar el descanso', 22.99, 50, 6, NULL, 'disponible', '2026-04-27 14:27:28', '2026-04-27 14:27:28'),
(4, 'Vitamina Kidney', 'Suplemento vitamÃ­nico para la salud renal', 20.99, 50, 6, NULL, 'disponible', '2026-04-27 14:27:28', '2026-04-27 14:27:28'),
(5, 'Vitamina Magnesium', 'Suplemento de Magnesio para mÃºsculos y sistema nervioso', 22.99, 50, 6, NULL, 'disponible', '2026-04-27 14:27:28', '2026-04-27 14:27:28'),
(6, 'Protein Probiotic+', 'Suplemento probiÃ³tico con proteÃ­na para la salud digestiva', 18.99, 50, 6, NULL, 'disponible', '2026-04-27 14:27:28', '2026-04-27 14:27:28'),
(7, 'Protein Whey Coffee Bar', 'Barrita proteica sabor cafÃ© con whey protein', 30.99, 50, 7, NULL, 'disponible', '2026-04-27 14:27:28', '2026-04-27 14:27:28'),
(8, 'Protein Cacahuetes Bar', 'Barrita proteica sabor cacahuetes', 31.99, 50, 7, NULL, 'disponible', '2026-04-27 14:27:28', '2026-04-27 14:27:28'),
(9, 'Protein Avellanas Bar', 'Barrita proteica sabor avellanas', 22.99, 50, 7, NULL, 'disponible', '2026-04-27 14:27:28', '2026-04-27 14:27:28'),
(10, 'Protein Stracciatella Bar', 'Barrita proteica sabor stracciatella', 20.99, 50, 7, NULL, 'disponible', '2026-04-27 14:27:28', '2026-04-27 14:27:28'),
(11, 'Protein Coconut Bar', 'Barrita proteica sabor coco', 22.99, 50, 7, NULL, 'disponible', '2026-04-27 14:27:28', '2026-04-27 14:27:28'),
(12, 'Protein Pistacho Bar', 'Barrita proteica sabor pistacho', 18.99, 50, 7, NULL, 'disponible', '2026-04-27 14:27:28', '2026-04-27 14:27:28'),
(13, 'Protein Whey Coffee', 'ProteÃ­na en polvo sabor cafÃ© con whey protein premium', 43.99, 50, 5, NULL, 'disponible', '2026-04-27 14:27:28', '2026-04-27 14:27:28'),
(14, 'Protein Whey Chocolate', 'ProteÃ­na en polvo sabor chocolate con whey protein premium', 43.99, 50, 5, NULL, 'disponible', '2026-04-27 14:27:28', '2026-04-27 14:27:28'),
(15, 'Protein Whey Vanilla', 'ProteÃ­na en polvo sabor vainilla con whey protein premium', 43.99, 50, 5, NULL, 'disponible', '2026-04-27 14:27:28', '2026-04-27 14:27:28'),
(16, 'Protein Cacahuetes', 'ProteÃ­na en polvo sabor cacahuetes premium', 49.99, 50, 5, NULL, 'disponible', '2026-04-27 14:27:28', '2026-04-27 14:27:28'),
(17, 'Protein Avellanas', 'ProteÃ­na en polvo sabor avellanas premium', 38.99, 50, 5, NULL, 'disponible', '2026-04-27 14:27:28', '2026-04-27 14:27:28'),
(18, 'Protein Stracciatella', 'ProteÃ­na en polvo sabor stracciatella premium', 42.99, 50, 5, NULL, 'disponible', '2026-04-27 14:27:28', '2026-04-27 14:27:28'),
(19, 'Protein Coconut', 'ProteÃ­na en polvo sabor coco premium', 35.99, 50, 5, NULL, 'disponible', '2026-04-27 14:27:28', '2026-04-27 14:27:28'),
(20, 'Protein Pistacho', 'ProteÃ­na en polvo sabor pistacho premium', 49.99, 50, 5, NULL, 'disponible', '2026-04-27 14:27:28', '2026-04-27 14:27:28');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `recetas`
--

CREATE TABLE `recetas` (
  `id_receta` int NOT NULL,
  `titulo` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `calorias` int NOT NULL,
  `proteina` int NOT NULL,
  `tiempo` int NOT NULL,
  `tipo` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `imagen` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `carbohidratos` int DEFAULT '0',
  `grasas` int DEFAULT '0',
  `ingredientes` text COLLATE utf8mb4_unicode_ci,
  `instrucciones` text COLLATE utf8mb4_unicode_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `recetas`
--

INSERT INTO `recetas` (`id_receta`, `titulo`, `calorias`, `proteina`, `tiempo`, `tipo`, `imagen`, `carbohidratos`, `grasas`, `ingredientes`, `instrucciones`) VALUES
(1, 'Curry de Garbanzos y Espinacas', 380, 18, 20, 'Vegano', 'https://images.unsplash.com/photo-1585937421612-70a008356fbe', 55, 12, 'Garbanzos, Leche de coco, Espinacas, Curry', NULL),
(2, 'Pasta Integral con Ternera', 750, 45, 18, 'Volumen', 'https://images.unsplash.com/photo-1551183053-bf91a1d81141', 85, 15, 'Pasta integral, Ternera magra, Tomate, Albahaca', NULL),
(3, 'Merluza al Vapor con Calabacín', 280, 35, 15, 'Definición', 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2', 8, 5, 'Merluza, Calabacín, Limón, Pimienta', NULL),
(4, 'Yogur Griego con Nueces', 250, 20, 5, 'Snack', 'https://images.unsplash.com/photo-1488477181946-6428a0291777', 15, 12, 'Yogur griego, Nueces, Miel, Arándanos', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `id_rol` int NOT NULL,
  `nombre` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`id_rol`, `nombre`, `descripcion`, `created_at`) VALUES
(1, 'admin', 'Administrador del sistema', '2026-04-29 16:50:08'),
(2, 'usuario', 'Usuario normal', '2026-04-29 16:50:08'),
(3, 'premium', 'Usuario premium', '2026-04-29 16:50:08');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `suscripciones_usuarios`
--

CREATE TABLE `suscripciones_usuarios` (
  `id_suscripcion` int NOT NULL,
  `id_usuario` int NOT NULL,
  `id_plan` int NOT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NOT NULL,
  `estado` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT 'activa'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `apellidos` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT '',
  `telefono` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `peso` decimal(5,2) DEFAULT NULL,
  `altura` decimal(5,2) DEFAULT NULL,
  `genero` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nivel_actividad` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `experiencia` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lugar_entrenamiento` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `objetivo` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `preferencia_alimentaria` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tiempo_cocinar` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `onboarding_completado` tinyint(1) NOT NULL DEFAULT '0',
  `id_rol` int DEFAULT '2',
  `estado_cuenta` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT 'activo',
  `ultimo_acceso` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `email`, `password_hash`, `nombre`, `apellidos`, `telefono`, `fecha_nacimiento`, `peso`, `altura`, `genero`, `nivel_actividad`, `experiencia`, `lugar_entrenamiento`, `objetivo`, `preferencia_alimentaria`, `tiempo_cocinar`, `onboarding_completado`, `id_rol`, `estado_cuenta`, `ultimo_acceso`, `created_at`, `updated_at`) VALUES
(1, 'admin@fitmeal.com', '$2b$10$vDLWug0/FwEIRzVIqPlKk.p79GxBjoPAVP7WuGbUt05dcRx299iuq', 'Admin', 'FitMeal', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 1, 'activo', NULL, '2026-04-29 16:50:09', '2026-04-29 16:50:09');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `categorias_productos`
--
ALTER TABLE `categorias_productos`
  ADD PRIMARY KEY (`id_categoria`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `detalle_pedidos`
--
ALTER TABLE `detalle_pedidos`
  ADD PRIMARY KEY (`id_detalle`),
  ADD KEY `fk_det_pedido` (`id_pedido`),
  ADD KEY `fk_det_prod` (`id_producto`);

--
-- Indices de la tabla `ejercicios`
--
ALTER TABLE `ejercicios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_ejercicio_musculo` (`musculo_id`);

--
-- Indices de la tabla `musculos`
--
ALTER TABLE `musculos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre_key` (`nombre_key`);

--
-- Indices de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD PRIMARY KEY (`id_pedido`),
  ADD KEY `fk_pedido_usuario` (`id_usuario`);

--
-- Indices de la tabla `planes_suscripcion`
--
ALTER TABLE `planes_suscripcion`
  ADD PRIMARY KEY (`id_plan`),
  ADD UNIQUE KEY `nombre_plan` (`nombre_plan`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id_producto`),
  ADD KEY `fk_prod_cat` (`id_categoria`);

--
-- Indices de la tabla `recetas`
--
ALTER TABLE `recetas`
  ADD PRIMARY KEY (`id_receta`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id_rol`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `suscripciones_usuarios`
--
ALTER TABLE `suscripciones_usuarios`
  ADD PRIMARY KEY (`id_suscripcion`),
  ADD KEY `fk_susc_usuario` (`id_usuario`),
  ADD KEY `fk_susc_plan` (`id_plan`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `fk_user_rol` (`id_rol`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `categorias_productos`
--
ALTER TABLE `categorias_productos`
  MODIFY `id_categoria` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `detalle_pedidos`
--
ALTER TABLE `detalle_pedidos`
  MODIFY `id_detalle` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `ejercicios`
--
ALTER TABLE `ejercicios`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT de la tabla `musculos`
--
ALTER TABLE `musculos`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  MODIFY `id_pedido` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `planes_suscripcion`
--
ALTER TABLE `planes_suscripcion`
  MODIFY `id_plan` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id_producto` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de la tabla `recetas`
--
ALTER TABLE `recetas`
  MODIFY `id_receta` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `id_rol` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `suscripciones_usuarios`
--
ALTER TABLE `suscripciones_usuarios`
  MODIFY `id_suscripcion` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `detalle_pedidos`
--
ALTER TABLE `detalle_pedidos`
  ADD CONSTRAINT `fk_det_pedido` FOREIGN KEY (`id_pedido`) REFERENCES `pedidos` (`id_pedido`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_det_prod` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`) ON DELETE RESTRICT;

--
-- Filtros para la tabla `ejercicios`
--
ALTER TABLE `ejercicios`
  ADD CONSTRAINT `fk_ejercicio_musculo` FOREIGN KEY (`musculo_id`) REFERENCES `musculos` (`id`);

--
-- Filtros para la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD CONSTRAINT `fk_pedido_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE;

--
-- Filtros para la tabla `productos`
--
ALTER TABLE `productos`
  ADD CONSTRAINT `fk_prod_cat` FOREIGN KEY (`id_categoria`) REFERENCES `categorias_productos` (`id_categoria`) ON DELETE SET NULL;

--
-- Filtros para la tabla `suscripciones_usuarios`
--
ALTER TABLE `suscripciones_usuarios`
  ADD CONSTRAINT `fk_susc_plan` FOREIGN KEY (`id_plan`) REFERENCES `planes_suscripcion` (`id_plan`) ON DELETE RESTRICT,
  ADD CONSTRAINT `fk_susc_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE;

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `fk_user_rol` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id_rol`) ON DELETE SET NULL;

--
-- Estructura de tabla para la tabla `favoritos_ejercicios`
--

CREATE TABLE `favoritos_ejercicios` (
  `id_usuario` int NOT NULL,
  `id_ejercicio` int NOT NULL,
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE `favoritos_ejercicios`
  ADD PRIMARY KEY (`id_usuario`,`id_ejercicio`),
  ADD KEY `fk_favej_ejercicio` (`id_ejercicio`);

ALTER TABLE `favoritos_ejercicios`
  ADD CONSTRAINT `fk_favej_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_favej_ejercicio` FOREIGN KEY (`id_ejercicio`) REFERENCES `ejercicios` (`id`) ON DELETE CASCADE;

--
-- Estructura de tabla para la tabla `progreso_ejercicios`
--

CREATE TABLE `progreso_ejercicios` (
  `id_progreso` int NOT NULL,
  `id_usuario` int NOT NULL,
  `id_ejercicio` int NOT NULL,
  `peso` decimal(5,2) NOT NULL,
  `repeticiones` int DEFAULT NULL,
  `fecha` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE `progreso_ejercicios`
  ADD PRIMARY KEY (`id_progreso`),
  ADD KEY `fk_progej_usuario` (`id_usuario`),
  ADD KEY `fk_progej_ejercicio` (`id_ejercicio`);

ALTER TABLE `progreso_ejercicios`
  MODIFY `id_progreso` int NOT NULL AUTO_INCREMENT;

ALTER TABLE `progreso_ejercicios`
  ADD CONSTRAINT `fk_progej_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_progej_ejercicio` FOREIGN KEY (`id_ejercicio`) REFERENCES `ejercicios` (`id`) ON DELETE CASCADE;

ALTER TABLE `usuarios` ADD COLUMN `plan` ENUM('basic', 'premium') DEFAULT 'basic' AFTER `estado_cuenta`;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
