-- =============================================================
-- MIGRACIÓN: Fixes generales de la BD fitness_platform
-- Fecha: 2026-05-12
-- =============================================================

START TRANSACTION;

-- -------------------------------------------------------------
-- 1. IMÁGENES DE PRODUCTOS
--    Las imágenes ya existen en frontend/public/products/
--    Se usa ruta relativa que el frontend sirve como estático.
-- -------------------------------------------------------------

UPDATE `productos` SET `imagen_url` = 'products/vitamina-omega3.jpg'    WHERE `id_producto` = 1;
UPDATE `productos` SET `imagen_url` = 'products/vitamina-zinc.jpg'       WHERE `id_producto` = 2;
UPDATE `productos` SET `imagen_url` = 'products/melatonina.jpg'          WHERE `id_producto` = 3;
UPDATE `productos` SET `imagen_url` = 'products/vitamina-kidney.png'     WHERE `id_producto` = 4;
UPDATE `productos` SET `imagen_url` = 'products/vitamina-magnesium.png'  WHERE `id_producto` = 5;
UPDATE `productos` SET `imagen_url` = 'products/protein-probiotic.jpg'   WHERE `id_producto` = 6;
UPDATE `productos` SET `imagen_url` = 'products/bar-whey-coffee.jpg'     WHERE `id_producto` = 7;
UPDATE `productos` SET `imagen_url` = 'products/bar-cacahuetes.png'      WHERE `id_producto` = 8;
UPDATE `productos` SET `imagen_url` = 'products/bar-avellanas.jpg'       WHERE `id_producto` = 9;
UPDATE `productos` SET `imagen_url` = 'products/bar-stracciatella.jpg'   WHERE `id_producto` = 10;
UPDATE `productos` SET `imagen_url` = 'products/bar-coconut.png'         WHERE `id_producto` = 11;
UPDATE `productos` SET `imagen_url` = 'products/bar-pistacho.png'        WHERE `id_producto` = 12;
UPDATE `productos` SET `imagen_url` = 'products/whey-coffee.png'         WHERE `id_producto` = 13;
UPDATE `productos` SET `imagen_url` = 'products/whey-chocolate.jpg'      WHERE `id_producto` = 14;
UPDATE `productos` SET `imagen_url` = 'products/whey-vanilla.png'        WHERE `id_producto` = 15;
UPDATE `productos` SET `imagen_url` = 'products/cacahuetes.png'          WHERE `id_producto` = 16;
UPDATE `productos` SET `imagen_url` = 'products/avellanas.jpg'           WHERE `id_producto` = 17;
UPDATE `productos` SET `imagen_url` = 'products/stracciatella.png'       WHERE `id_producto` = 18;
UPDATE `productos` SET `imagen_url` = 'products/coconut.png'             WHERE `id_producto` = 19;
UPDATE `productos` SET `imagen_url` = 'products/pistacho.png'            WHERE `id_producto` = 20;

-- -------------------------------------------------------------
-- 2. IMÁGENES DE EJERCICIOS (Unsplash — dominio público)
-- -------------------------------------------------------------

UPDATE `ejercicios` SET `imagen` = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400' WHERE `id` = 1;  -- Press de Banca
UPDATE `ejercicios` SET `imagen` = 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400' WHERE `id` = 2;  -- Aperturas Mancuernas
UPDATE `ejercicios` SET `imagen` = 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400' WHERE `id` = 3;  -- Curl Barra
UPDATE `ejercicios` SET `imagen` = 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400' WHERE `id` = 4;  -- Curl Martillo
UPDATE `ejercicios` SET `imagen` = 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=400' WHERE `id` = 5;  -- Press Francés
UPDATE `ejercicios` SET `imagen` = 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=400' WHERE `id` = 6;  -- Extensión en Polea
UPDATE `ejercicios` SET `imagen` = 'https://images.unsplash.com/photo-1520948013839-62020f374478?w=400' WHERE `id` = 7;  -- Dominadas
UPDATE `ejercicios` SET `imagen` = 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=400' WHERE `id` = 8;  -- Remo con Barra
UPDATE `ejercicios` SET `imagen` = 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400' WHERE `id` = 9;  -- Sentadilla Libre
UPDATE `ejercicios` SET `imagen` = 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400' WHERE `id` = 10; -- Prensa de Piernas
UPDATE `ejercicios` SET `imagen` = 'https://images.unsplash.com/photo-1616803689943-5601631c7fec?w=400' WHERE `id` = 11; -- Peso Muerto Rumano
UPDATE `ejercicios` SET `imagen` = 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400' WHERE `id` = 12; -- Curl Femoral
UPDATE `ejercicios` SET `imagen` = 'https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?w=400' WHERE `id` = 13; -- Press Militar
UPDATE `ejercicios` SET `imagen` = 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400' WHERE `id` = 14; -- Elevaciones Laterales
UPDATE `ejercicios` SET `imagen` = 'https://images.unsplash.com/photo-1544216428-6a8f3c9b246a?w=400' WHERE `id` = 15; -- Crunch Abdominal
UPDATE `ejercicios` SET `imagen` = 'https://images.unsplash.com/photo-1562088287-bde35a1ea917?w=400' WHERE `id` = 16; -- Plancha Isométrica
UPDATE `ejercicios` SET `imagen` = 'https://images.unsplash.com/photo-1598575468023-85b6a3be3b6b?w=400' WHERE `id` = 17; -- Curl de Muñeca
UPDATE `ejercicios` SET `imagen` = 'https://images.unsplash.com/photo-1597452485669-2c7bb5fef90d?w=400' WHERE `id` = 18; -- Paseo del Granjero
UPDATE `ejercicios` SET `imagen` = 'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?w=400' WHERE `id` = 19; -- Hip Thrust
UPDATE `ejercicios` SET `imagen` = 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=400' WHERE `id` = 20; -- Zancadas
UPDATE `ejercicios` SET `imagen` = 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400' WHERE `id` = 21; -- Elevación de Talones
UPDATE `ejercicios` SET `imagen` = 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400' WHERE `id` = 22; -- Puntillas en Prensa

-- -------------------------------------------------------------
-- 3. SINCRONIZAR PLANES CON EL FRONTEND
--    Frontend: Básico (FREE), Avanzado (9.99), Premium (19.99)
-- -------------------------------------------------------------

-- Actualizar Plan Básico a gratuito
UPDATE `planes_suscripcion`
SET `precio_mensual` = 0.00,
    `descripcion`    = 'Acceso gratuito a funciones básicas de la plataforma',
    `caracteristicas` = 'Evaluación inicial simple,Plan de alimentación general,Rutina de ejercicios 3x por semana,Dashboard de progreso,Tips semanales'
WHERE `id_plan` = 1;

-- Actualizar Plan Premium al precio correcto
UPDATE `planes_suscripcion`
SET `nombre_plan`    = 'Plan Premium',
    `precio_mensual` = 19.99,
    `descripcion`    = 'Acceso completo con seguimiento personalizado y asesor',
    `caracteristicas` = 'Todo del Avanzado,Revisión mensual con asesor,Alimentación adaptable,Recordatorios personalizados,Desafíos con recompensas'
WHERE `id_plan` = 2;

-- Insertar Plan Avanzado (nuevo)
INSERT INTO `planes_suscripcion` (`nombre_plan`, `descripcion`, `precio_mensual`, `duracion_dias`, `caracteristicas`, `estado`)
VALUES (
  'Plan Avanzado',
  'Plan personalizado con seguimiento y acceso a comunidad',
  9.99,
  30,
  'Todo del Básico,Plan personalizado (calorías),Rutinas 4-5 por semana,Seguimiento mensual,Acceso a comunidad',
  'activo'
);

-- -------------------------------------------------------------
-- 4. CORREGIR nivel_actividad INVÁLIDO EN USUARIOS
--    El usuario id=3 tiene '1.55' (multiplicador TDEE) en lugar
--    de un valor descriptivo.
-- -------------------------------------------------------------

UPDATE `usuarios`
SET `nivel_actividad` = 'Moderadamente activo'
WHERE `id_usuario` = 3 AND `nivel_actividad` = '1.55';

UPDATE `usuarios`
SET `nivel_actividad` = 'Moderadamente activo'
WHERE `id_usuario` = 4 AND `nivel_actividad` = '1.55';

-- -------------------------------------------------------------
-- 5. AÑADIR COLUMNA series A progreso_ejercicios
-- -------------------------------------------------------------

ALTER TABLE `progreso_ejercicios`
  ADD COLUMN `series` int DEFAULT NULL AFTER `id_ejercicio`;

-- -------------------------------------------------------------
-- 6. AÑADIR foto_perfil A usuarios
-- -------------------------------------------------------------

ALTER TABLE `usuarios`
  ADD COLUMN `foto_perfil` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL AFTER `apellidos`;

-- -------------------------------------------------------------
-- 7. TABLA rutinas + rutina_ejercicios
-- -------------------------------------------------------------

CREATE TABLE `rutinas` (
  `id`          int NOT NULL AUTO_INCREMENT,
  `id_usuario`  int NOT NULL,
  `nombre`      varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `dias_semana` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nivel`       enum('Baja','Media','Alta') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'Media',
  `created_at`  timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_rutina_usuario` (`id_usuario`),
  CONSTRAINT `fk_rutina_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `rutina_ejercicios` (
  `id`                int NOT NULL AUTO_INCREMENT,
  `id_rutina`         int NOT NULL,
  `id_ejercicio`      int NOT NULL,
  `series`            int NOT NULL DEFAULT 3,
  `repeticiones`      int NOT NULL DEFAULT 10,
  `peso_objetivo`     decimal(8,2) DEFAULT NULL,
  `descanso_segundos` int DEFAULT 60,
  `orden`             int NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `fk_re_rutina` (`id_rutina`),
  KEY `fk_re_ejercicio` (`id_ejercicio`),
  CONSTRAINT `fk_re_rutina`    FOREIGN KEY (`id_rutina`)    REFERENCES `rutinas` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_re_ejercicio` FOREIGN KEY (`id_ejercicio`) REFERENCES `ejercicios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------
-- 8. TABLA notificaciones
-- -------------------------------------------------------------

CREATE TABLE `notificaciones` (
  `id`         int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `titulo`     varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `mensaje`    text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `tipo`       enum('info','recordatorio','logro','sistema') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'info',
  `leida`      tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_notif_usuario` (`id_usuario`),
  KEY `idx_notif_leida` (`id_usuario`, `leida`),
  CONSTRAINT `fk_notif_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------
-- 9. NORMALIZAR metodo_pago EN pedidos
--    Cambia de varchar libre a ENUM para evitar valores inválidos.
-- -------------------------------------------------------------

ALTER TABLE `pedidos`
  MODIFY COLUMN `metodo_pago` enum('tarjeta','paypal','transferencia','efectivo')
    CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL;

COMMIT;
