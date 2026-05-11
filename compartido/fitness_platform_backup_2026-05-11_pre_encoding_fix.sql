mysqldump: [Warning] Using a password on the command line interface can be insecure.
-- MySQL dump 10.13  Distrib 8.0.44, for Linux (x86_64)
--
-- Host: localhost    Database: fitness_platform
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
mysqldump: Error: 'Access denied; you need (at least one of) the PROCESS privilege(s) for this operation' when trying to dump tablespaces

--
-- Table structure for table `categorias_productos`
--

DROP TABLE IF EXISTS `categorias_productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categorias_productos` (
  `id_categoria` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_categoria`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categorias_productos`
--

LOCK TABLES `categorias_productos` WRITE;
/*!40000 ALTER TABLE `categorias_productos` DISABLE KEYS */;
INSERT INTO `categorias_productos` VALUES (5,'Proteinas','ProteÃ­nas en polvo y suplementos proteicos','2026-04-27 14:27:28'),(6,'Vitaminas','Vitaminas y minerales esenciales','2026-04-27 14:27:28'),(7,'Barritas','Barritas proteicas y energÃ©ticas','2026-04-27 14:27:28');
/*!40000 ALTER TABLE `categorias_productos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detalle_pedidos`
--

DROP TABLE IF EXISTS `detalle_pedidos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detalle_pedidos` (
  `id_detalle` int NOT NULL AUTO_INCREMENT,
  `id_pedido` int NOT NULL,
  `id_producto` int NOT NULL,
  `cantidad` int NOT NULL,
  `precio_unitario` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id_detalle`),
  KEY `fk_det_pedido` (`id_pedido`),
  KEY `fk_det_prod` (`id_producto`),
  CONSTRAINT `fk_det_pedido` FOREIGN KEY (`id_pedido`) REFERENCES `pedidos` (`id_pedido`) ON DELETE CASCADE,
  CONSTRAINT `fk_det_prod` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detalle_pedidos`
--

LOCK TABLES `detalle_pedidos` WRITE;
/*!40000 ALTER TABLE `detalle_pedidos` DISABLE KEYS */;
/*!40000 ALTER TABLE `detalle_pedidos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ejercicios`
--

DROP TABLE IF EXISTS `ejercicios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ejercicios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `musculo_id` int DEFAULT NULL,
  `titulo` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `dificultad` enum('Baja','Media','Alta','No disponible') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'Media',
  `imagen` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `descripcion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `tipo` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'Fuerza / Hipertrofia',
  `puntos_clave` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  KEY `fk_ejercicio_musculo` (`musculo_id`),
  CONSTRAINT `fk_ejercicio_musculo` FOREIGN KEY (`musculo_id`) REFERENCES `musculos` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ejercicios`
--

LOCK TABLES `ejercicios` WRITE;
/*!40000 ALTER TABLE `ejercicios` DISABLE KEYS */;
INSERT INTO `ejercicios` VALUES (1,1,'Press de Banca','Media','','El ejercicio fundamental para el desarrollo del pectoral. Mantén los codos a 45 grados.','Resistencia / Cardio','Mantén la espalda recta.|Controla la respiración en cada repetición.|No bloquees las articulaciones al final del movimiento.'),(2,1,'Aperturas con Mancuernas','Baja','','Enfócate en el estiramiento de las fibras pectorales sin bajar excesivamente los brazos.','Fuerza / Hipertrofia',NULL),(3,2,'Curl con Barra','Baja','','Mantén los codos pegados al torso y evita el balanceo con la espalda.','Fuerza / Hipertrofia',NULL),(4,2,'Curl Martillo','Baja','','Excelente para trabajar el braquial y dar grosor al brazo.','Fuerza / Hipertrofia',NULL),(5,14,'Press Francés','Media','','Extiende los antebrazos hacia arriba manteniendo los hombros estables.','Fuerza / Hipertrofia',NULL),(6,14,'Extensión en Polea','Baja','','Bloquea los codos a los costados y realiza el movimiento completo de extensión.','Fuerza / Hipertrofia',NULL),(7,15,'Dominadas','Alta','','Ejercicio de tracción vertical para amplitud dorsal. Pecho arriba al subir.','Fuerza / Hipertrofia',NULL),(8,15,'Remo con Barra','Alta','','Fundamental para el grosor de la espalda. Mantén el core firme.','Fuerza / Hipertrofia',NULL),(9,19,'Sentadilla Libre','Alta','','El rey de los ejercicios de pierna. Baja hasta que la cadera rompa el paralelo.','Fuerza / Hipertrofia',NULL),(10,19,'Prensa de Piernas','Media','','Empuja con los talones y no bloquees las rodillas al final del recorrido.','Fuerza / Hipertrofia',NULL),(11,20,'Peso Muerto Rumano','Alta','','Mantén la espalda recta y baja la barra pegada a las piernas hasta sentir estiramiento.','Fuerza / Hipertrofia',NULL),(12,20,'Curl Femoral Tumbado','Baja','','Aísla el isquiotibial controlando la bajada (fase excéntrica).','Fuerza / Hipertrofia',NULL),(13,16,'Press Militar','Alta','','Empuje vertical sobre la cabeza. No arquees la zona lumbar.','Fuerza / Hipertrofia',NULL),(14,16,'Elevaciones Laterales','Baja','','Trabajo del deltoides lateral para hombros anchos.','Fuerza / Hipertrofia',NULL),(15,17,'Crunch Abdominal','Baja','','Flexiona la columna elevando los hombros del suelo sin tirar del cuello.','Fuerza / Hipertrofia',NULL),(16,17,'Plancha Isométrica','Media','','Mantén el cuerpo recto como una tabla activando abdomen y glúteos.','Fuerza / Hipertrofia',NULL),(17,18,'Curl de Muñeca','Baja','','Apoya los brazos en un banco y flexiona las muñecas hacia arriba.','Fuerza / Hipertrofia',NULL),(18,18,'Paseo del Granjero','Media','','Sujeta mancuernas pesadas y camina manteniendo la espalda erguida.','Fuerza / Hipertrofia',NULL),(19,21,'Hip Thrust','Media','','Apoya la espalda en un banco y eleva la cadera explosivamente.','Fuerza / Hipertrofia',NULL),(20,21,'Zancadas (Lunges)','Media','','Da un paso largo y baja la rodilla trasera casi hasta tocar el suelo.','Fuerza / Hipertrofia',NULL),(21,22,'Elevación de Talones','Baja','','Ponte de puntillas y mantén la contracción un segundo arriba.','Fuerza / Hipertrofia',NULL),(22,22,'Puntillas en Prensa','Baja','','Utiliza la máquina de prensa para realizar extensiones de tobillo.','Fuerza / Hipertrofia',NULL);
/*!40000 ALTER TABLE `ejercicios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `musculos`
--

DROP TABLE IF EXISTS `musculos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `musculos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre_key` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `grupo_muscular` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre_key` (`nombre_key`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `musculos`
--

LOCK TABLES `musculos` WRITE;
/*!40000 ALTER TABLE `musculos` DISABLE KEYS */;
INSERT INTO `musculos` VALUES (1,'PECHO','Tren Superior'),(2,'BICEPS','Tren Superior'),(14,'TRICEPS','Tren Superior'),(15,'ESPALDA','Tren Superior'),(16,'HOMBROS','Tren Superior'),(17,'ABDOMEN','Core'),(18,'ANTEBRAZO','Tren Superior'),(19,'CUADRICEPS','Tren Inferior'),(20,'FEMORAL','Tren Inferior'),(21,'GLUTEOS','Tren Inferior'),(22,'GEMELOS','Tren Inferior');
/*!40000 ALTER TABLE `musculos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pedidos`
--

DROP TABLE IF EXISTS `pedidos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pedidos` (
  `id_pedido` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `fecha_pedido` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `total` decimal(10,2) NOT NULL,
  `estado` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'pendiente',
  `direccion_envio` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `metodo_pago` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id_pedido`),
  KEY `fk_pedido_usuario` (`id_usuario`),
  CONSTRAINT `fk_pedido_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedidos`
--

LOCK TABLES `pedidos` WRITE;
/*!40000 ALTER TABLE `pedidos` DISABLE KEYS */;
/*!40000 ALTER TABLE `pedidos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `planes_suscripcion`
--

DROP TABLE IF EXISTS `planes_suscripcion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `planes_suscripcion` (
  `id_plan` int NOT NULL AUTO_INCREMENT,
  `nombre_plan` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `precio_mensual` decimal(10,2) NOT NULL,
  `duracion_dias` int DEFAULT '30',
  `caracteristicas` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `estado` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'activo',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_plan`),
  UNIQUE KEY `nombre_plan` (`nombre_plan`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `planes_suscripcion`
--

LOCK TABLES `planes_suscripcion` WRITE;
/*!40000 ALTER TABLE `planes_suscripcion` DISABLE KEYS */;
/*!40000 ALTER TABLE `planes_suscripcion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productos`
--

DROP TABLE IF EXISTS `productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productos` (
  `id_producto` int NOT NULL AUTO_INCREMENT,
  `nombre_producto` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `precio` decimal(10,2) NOT NULL,
  `stock` int DEFAULT '0',
  `id_categoria` int DEFAULT NULL,
  `imagen_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `estado` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'disponible',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_producto`),
  KEY `fk_prod_cat` (`id_categoria`),
  CONSTRAINT `fk_prod_cat` FOREIGN KEY (`id_categoria`) REFERENCES `categorias_productos` (`id_categoria`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productos`
--

LOCK TABLES `productos` WRITE;
/*!40000 ALTER TABLE `productos` DISABLE KEYS */;
INSERT INTO `productos` VALUES (1,'Vitamina Omega-3','Suplemento de Ã¡cidos grasos Omega-3 ESN Total Kinetic Sport',30.99,50,6,NULL,'disponible','2026-04-27 14:27:28','2026-04-27 14:27:28'),(2,'Vitamina Zinc','Suplemento de Zinc ESN TKS para el sistema inmunolÃ³gico',31.99,50,6,NULL,'disponible','2026-04-27 14:27:28','2026-04-27 14:27:28'),(3,'Melatonina','Melatonina ESN Total Kinetic Sport para mejorar el descanso',22.99,50,6,NULL,'disponible','2026-04-27 14:27:28','2026-04-27 14:27:28'),(4,'Vitamina Kidney','Suplemento vitamÃ­nico para la salud renal',20.99,50,6,NULL,'disponible','2026-04-27 14:27:28','2026-04-27 14:27:28'),(5,'Vitamina Magnesium','Suplemento de Magnesio para mÃºsculos y sistema nervioso',22.99,50,6,NULL,'disponible','2026-04-27 14:27:28','2026-04-27 14:27:28'),(6,'Protein Probiotic+','Suplemento probiÃ³tico con proteÃ­na para la salud digestiva',18.99,50,6,NULL,'disponible','2026-04-27 14:27:28','2026-04-27 14:27:28'),(7,'Protein Whey Coffee Bar','Barrita proteica sabor cafÃ© con whey protein',30.99,50,7,NULL,'disponible','2026-04-27 14:27:28','2026-04-27 14:27:28'),(8,'Protein Cacahuetes Bar','Barrita proteica sabor cacahuetes',31.99,50,7,NULL,'disponible','2026-04-27 14:27:28','2026-04-27 14:27:28'),(9,'Protein Avellanas Bar','Barrita proteica sabor avellanas',22.99,50,7,NULL,'disponible','2026-04-27 14:27:28','2026-04-27 14:27:28'),(10,'Protein Stracciatella Bar','Barrita proteica sabor stracciatella',20.99,50,7,NULL,'disponible','2026-04-27 14:27:28','2026-04-27 14:27:28'),(11,'Protein Coconut Bar','Barrita proteica sabor coco',22.99,50,7,NULL,'disponible','2026-04-27 14:27:28','2026-04-27 14:27:28'),(12,'Protein Pistacho Bar','Barrita proteica sabor pistacho',18.99,50,7,NULL,'disponible','2026-04-27 14:27:28','2026-04-27 14:27:28'),(13,'Protein Whey Coffee','ProteÃ­na en polvo sabor cafÃ© con whey protein premium',43.99,50,5,NULL,'disponible','2026-04-27 14:27:28','2026-04-27 14:27:28'),(14,'Protein Whey Chocolate','ProteÃ­na en polvo sabor chocolate con whey protein premium',43.99,50,5,NULL,'disponible','2026-04-27 14:27:28','2026-04-27 14:27:28'),(15,'Protein Whey Vanilla','ProteÃ­na en polvo sabor vainilla con whey protein premium',43.99,50,5,NULL,'disponible','2026-04-27 14:27:28','2026-04-27 14:27:28'),(16,'Protein Cacahuetes','ProteÃ­na en polvo sabor cacahuetes premium',49.99,50,5,NULL,'disponible','2026-04-27 14:27:28','2026-04-27 14:27:28'),(17,'Protein Avellanas','ProteÃ­na en polvo sabor avellanas premium',38.99,50,5,NULL,'disponible','2026-04-27 14:27:28','2026-04-27 14:27:28'),(18,'Protein Stracciatella','ProteÃ­na en polvo sabor stracciatella premium',42.99,50,5,NULL,'disponible','2026-04-27 14:27:28','2026-04-27 14:27:28'),(19,'Protein Coconut','ProteÃ­na en polvo sabor coco premium',35.99,50,5,NULL,'disponible','2026-04-27 14:27:28','2026-04-27 14:27:28'),(20,'Protein Pistacho','ProteÃ­na en polvo sabor pistacho premium',49.99,50,5,NULL,'disponible','2026-04-27 14:27:28','2026-04-27 14:27:28');
/*!40000 ALTER TABLE `productos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recetas`
--

DROP TABLE IF EXISTS `recetas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recetas` (
  `id_receta` int NOT NULL AUTO_INCREMENT,
  `titulo` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `calorias` int NOT NULL,
  `proteina` int NOT NULL,
  `tiempo` int NOT NULL,
  `tipo` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `imagen` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `carbohidratos` int DEFAULT '0',
  `grasas` int DEFAULT '0',
  `ingredientes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `instrucciones` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id_receta`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recetas`
--

LOCK TABLES `recetas` WRITE;
/*!40000 ALTER TABLE `recetas` DISABLE KEYS */;
INSERT INTO `recetas` VALUES (1,'Curry de Garbanzos y Espinacas',380,18,20,'Vegano','https://images.unsplash.com/photo-1585937421612-70a008356fbe',55,12,'Garbanzos, Leche de coco, Espinacas, Curry',NULL),(2,'Pasta Integral con Ternera',750,45,18,'Volumen','https://images.unsplash.com/photo-1551183053-bf91a1d81141',85,15,'Pasta integral, Ternera magra, Tomate, Albahaca',NULL),(3,'Merluza al Vapor con Calabacín',280,35,15,'Definición','https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2',8,5,'Merluza, Calabacín, Limón, Pimienta',NULL),(4,'Yogur Griego con Nueces',250,20,5,'Snack','https://images.unsplash.com/photo-1488477181946-6428a0291777',15,12,'Yogur griego, Nueces, Miel, Arándanos',NULL);
/*!40000 ALTER TABLE `recetas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id_rol` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_rol`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'admin','Administrador del sistema','2026-04-29 16:50:08'),(2,'usuario','Usuario normal','2026-04-29 16:50:08'),(3,'premium','Usuario premium','2026-04-29 16:50:08');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `suscripciones_usuarios`
--

DROP TABLE IF EXISTS `suscripciones_usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `suscripciones_usuarios` (
  `id_suscripcion` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `id_plan` int NOT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NOT NULL,
  `estado` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'activa',
  PRIMARY KEY (`id_suscripcion`),
  KEY `fk_susc_usuario` (`id_usuario`),
  KEY `fk_susc_plan` (`id_plan`),
  CONSTRAINT `fk_susc_plan` FOREIGN KEY (`id_plan`) REFERENCES `planes_suscripcion` (`id_plan`) ON DELETE RESTRICT,
  CONSTRAINT `fk_susc_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `suscripciones_usuarios`
--

LOCK TABLES `suscripciones_usuarios` WRITE;
/*!40000 ALTER TABLE `suscripciones_usuarios` DISABLE KEYS */;
/*!40000 ALTER TABLE `suscripciones_usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nombre` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `apellidos` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT '',
  `telefono` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `peso` decimal(5,2) DEFAULT NULL,
  `altura` decimal(5,2) DEFAULT NULL,
  `genero` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nivel_actividad` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `experiencia` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lugar_entrenamiento` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `objetivo` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `preferencia_alimentaria` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tiempo_cocinar` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `onboarding_completado` tinyint(1) NOT NULL DEFAULT '0',
  `id_rol` int DEFAULT '2',
  `estado_cuenta` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'activo',
  `ultimo_acceso` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `email` (`email`),
  KEY `fk_user_rol` (`id_rol`),
  CONSTRAINT `fk_user_rol` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id_rol`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'admin@fitmeal.com','$2b$10$dOw.nOIikLcFgN5Sgj4iW.Zcu6aGBGXqRjTHADGcc5naFm483Z.VC','Admin','FitMeal',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,1,'activo','2026-05-04 14:55:01','2026-04-29 16:50:09','2026-05-04 14:55:01');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-11 14:02:08
