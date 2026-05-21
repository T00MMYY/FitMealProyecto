-- MySQL dump 10.13  Distrib 8.0.45, for Linux (x86_64)
--
-- Host: localhost    Database: fitness_platform
-- ------------------------------------------------------
-- Server version	8.0.45

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
INSERT INTO `categorias_productos` VALUES (1,'Suplementos','Suplementos nutricionales y deportivos','2026-02-02 17:06:25'),(2,'Equipamiento','Equipamiento deportivo y de fitness','2026-02-02 17:06:25'),(3,'Alimentos','Alimentos saludables y planes de comida','2026-02-02 17:06:25'),(4,'Accesorios','Accesorios deportivos varios','2026-02-02 17:06:25'),(5,'Proteinas','Proteínas en polvo y suplementos proteicos','2026-04-27 14:27:28'),(6,'Vitaminas','Vitaminas y minerales esenciales','2026-04-27 14:27:28'),(7,'Barritas','Barritas proteicas y energéticas','2026-04-27 14:27:28');
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
  KEY `idx_pedido` (`id_pedido`),
  KEY `idx_producto` (`id_producto`),
  CONSTRAINT `detalle_pedidos_ibfk_1` FOREIGN KEY (`id_pedido`) REFERENCES `pedidos` (`id_pedido`) ON DELETE CASCADE,
  CONSTRAINT `detalle_pedidos_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`) ON DELETE RESTRICT,
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
INSERT INTO `ejercicios` VALUES (1,1,'Press de Banca','Media','https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400','El ejercicio fundamental para el desarrollo del pectoral. Mantén los codos a 45 grados.','Resistencia / Cardio','Mantén la espalda recta.|Controla la respiración en cada repetición.|No bloquees las articulaciones al final del movimiento.'),(2,1,'Aperturas con Mancuernas','Baja','https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400','Enfócate en el estiramiento de las fibras pectorales sin bajar excesivamente los brazos.','Fuerza / Hipertrofia',NULL),(3,2,'Curl con Barra','Baja','https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400','Mantén los codos pegados al torso y evita el balanceo con la espalda.','Fuerza / Hipertrofia',NULL),(4,2,'Curl Martillo','Baja','https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400','Excelente para trabajar el braquial y dar grosor al brazo.','Fuerza / Hipertrofia',NULL),(5,14,'Press Francés','Media','https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=400','Extiende los antebrazos hacia arriba manteniendo los hombros estables.','Fuerza / Hipertrofia',NULL),(6,14,'Extensión en Polea','Baja','https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=400','Bloquea los codos a los costados y realiza el movimiento completo de extensión.','Fuerza / Hipertrofia',NULL),(7,15,'Dominadas','Alta','https://images.unsplash.com/photo-1520948013839-62020f374478?w=400','Ejercicio de tracción vertical para amplitud dorsal. Pecho arriba al subir.','Fuerza / Hipertrofia',NULL),(8,15,'Remo con Barra','Alta','https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=400','Fundamental para el grosor de la espalda. Mantén el core firme.','Fuerza / Hipertrofia',NULL),(9,19,'Sentadilla Libre','Alta','https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400','El rey de los ejercicios de pierna. Baja hasta que la cadera rompa el paralelo.','Fuerza / Hipertrofia',NULL),(10,19,'Prensa de Piernas','Media','https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400','Empuja con los talones y no bloquees las rodillas al final del recorrido.','Fuerza / Hipertrofia',NULL),(11,20,'Peso Muerto Rumano','Alta','https://images.unsplash.com/photo-1616803689943-5601631c7fec?w=400','Mantén la espalda recta y baja la barra pegada a las piernas hasta sentir estiramiento.','Fuerza / Hipertrofia',NULL),(12,20,'Curl Femoral Tumbado','Baja','https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400','Aísla el isquiotibial controlando la bajada (fase excéntrica).','Fuerza / Hipertrofia',NULL),(13,16,'Press Militar','Alta','https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?w=400','Empuje vertical sobre la cabeza. No arquees la zona lumbar.','Fuerza / Hipertrofia',NULL),(14,16,'Elevaciones Laterales','Baja','https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400','Trabajo del deltoides lateral para hombros anchos.','Fuerza / Hipertrofia',NULL),(15,17,'Crunch Abdominal','Baja','https://images.unsplash.com/photo-1544216428-6a8f3c9b246a?w=400','Flexiona la columna elevando los hombros del suelo sin tirar del cuello.','Fuerza / Hipertrofia',NULL),(16,17,'Plancha Isométrica','Media','https://images.unsplash.com/photo-1562088287-bde35a1ea917?w=400','Mantén el cuerpo recto como una tabla activando abdomen y glúteos.','Fuerza / Hipertrofia',NULL),(17,18,'Curl de Muñeca','Baja','https://images.unsplash.com/photo-1598575468023-85b6a3be3b6b?w=400','Apoya los brazos en un banco y flexiona las muñecas hacia arriba.','Fuerza / Hipertrofia',NULL),(18,18,'Paseo del Granjero','Media','https://images.unsplash.com/photo-1597452485669-2c7bb5fef90d?w=400','Sujeta mancuernas pesadas y camina manteniendo la espalda erguida.','Fuerza / Hipertrofia',NULL),(19,21,'Hip Thrust','Media','https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?w=400','Apoya la espalda en un banco y eleva la cadera explosivamente.','Fuerza / Hipertrofia',NULL),(20,21,'Zancadas (Lunges)','Media','https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=400','Da un paso largo y baja la rodilla trasera casi hasta tocar el suelo.','Fuerza / Hipertrofia',NULL),(21,22,'Elevación de Talones','Baja','https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400','Ponte de puntillas y mantén la contracción un segundo arriba.','Fuerza / Hipertrofia',NULL),(22,22,'Puntillas en Prensa','Baja','https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400','Utiliza la máquina de prensa para realizar extensiones de tobillo.','Fuerza / Hipertrofia',NULL);
/*!40000 ALTER TABLE `ejercicios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `entrenador_cliente`
--

DROP TABLE IF EXISTS `entrenador_cliente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `entrenador_cliente` (
  `id_entrenador` int NOT NULL,
  `id_cliente` int NOT NULL,
  `estado` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'activo',
  `fecha_asignacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_entrenador`,`id_cliente`),
  KEY `id_cliente` (`id_cliente`),
  CONSTRAINT `entrenador_cliente_ibfk_1` FOREIGN KEY (`id_entrenador`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE,
  CONSTRAINT `entrenador_cliente_ibfk_2` FOREIGN KEY (`id_cliente`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `entrenador_cliente`
--

LOCK TABLES `entrenador_cliente` WRITE;
/*!40000 ALTER TABLE `entrenador_cliente` DISABLE KEYS */;
/*!40000 ALTER TABLE `entrenador_cliente` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `favoritos_ejercicios`
--

DROP TABLE IF EXISTS `favoritos_ejercicios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `favoritos_ejercicios` (
  `id_usuario` int NOT NULL,
  `id_ejercicio` int NOT NULL,
  PRIMARY KEY (`id_usuario`,`id_ejercicio`),
  KEY `id_ejercicio` (`id_ejercicio`),
  CONSTRAINT `favoritos_ejercicios_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE,
  CONSTRAINT `favoritos_ejercicios_ibfk_2` FOREIGN KEY (`id_ejercicio`) REFERENCES `ejercicios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favoritos_ejercicios`
--

LOCK TABLES `favoritos_ejercicios` WRITE;
/*!40000 ALTER TABLE `favoritos_ejercicios` DISABLE KEYS */;
/*!40000 ALTER TABLE `favoritos_ejercicios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `favoritos_recetas`
--

DROP TABLE IF EXISTS `favoritos_recetas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `favoritos_recetas` (
  `id_usuario` int NOT NULL,
  `id_receta` int NOT NULL,
  PRIMARY KEY (`id_usuario`,`id_receta`),
  KEY `id_receta` (`id_receta`),
  CONSTRAINT `favoritos_recetas_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE,
  CONSTRAINT `favoritos_recetas_ibfk_2` FOREIGN KEY (`id_receta`) REFERENCES `recetas` (`id_receta`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favoritos_recetas`
--

LOCK TABLES `favoritos_recetas` WRITE;
/*!40000 ALTER TABLE `favoritos_recetas` DISABLE KEYS */;
/*!40000 ALTER TABLE `favoritos_recetas` ENABLE KEYS */;
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
-- Table structure for table `notificaciones`
--

DROP TABLE IF EXISTS `notificaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notificaciones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `titulo` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `mensaje` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `tipo` enum('info','recordatorio','logro','sistema') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'info',
  `leida` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_notif_usuario` (`id_usuario`),
  KEY `idx_notif_leida` (`id_usuario`,`leida`),
  CONSTRAINT `fk_notif_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notificaciones`
--

LOCK TABLES `notificaciones` WRITE;
/*!40000 ALTER TABLE `notificaciones` DISABLE KEYS */;
/*!40000 ALTER TABLE `notificaciones` ENABLE KEYS */;
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
  `metodo_pago` enum('tarjeta','paypal','transferencia','efectivo') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id_pedido`),
  KEY `idx_usuario` (`id_usuario`),
  KEY `idx_estado` (`estado`),
  KEY `idx_fecha` (`fecha_pedido`),
  CONSTRAINT `fk_pedido_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE,
  CONSTRAINT `pedidos_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE
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
-- Table structure for table `plan_comida`
--

DROP TABLE IF EXISTS `plan_comida`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plan_comida` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `id_receta` int NOT NULL,
  `momento` enum('desayuno','almuerzo','comida','merienda','cena') COLLATE utf8mb4_unicode_ci NOT NULL,
  `fecha` date NOT NULL,
  `generado_ia` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_pc_usuario` (`id_usuario`),
  KEY `fk_pc_receta` (`id_receta`),
  CONSTRAINT `fk_pc_receta` FOREIGN KEY (`id_receta`) REFERENCES `recetas` (`id_receta`) ON DELETE CASCADE,
  CONSTRAINT `fk_pc_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plan_comida`
--

LOCK TABLES `plan_comida` WRITE;
/*!40000 ALTER TABLE `plan_comida` DISABLE KEYS */;
/*!40000 ALTER TABLE `plan_comida` ENABLE KEYS */;
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
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_plan`),
  UNIQUE KEY `nombre_plan` (`nombre_plan`),
  KEY `idx_estado` (`estado`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `planes_suscripcion`
--

LOCK TABLES `planes_suscripcion` WRITE;
/*!40000 ALTER TABLE `planes_suscripcion` DISABLE KEYS */;
INSERT INTO `planes_suscripcion` VALUES (1,'Plan Básico','Acceso gratuito a funciones básicas de la plataforma',0.00,30,'Catálogo de workouts,Favoritos de ejercicios y recetas,Dashboard de progreso,Ver rutinas','activo','2026-02-02 17:06:25','2026-05-19 14:35:51'),(2,'Plan Avanzado','Rutinas y recetas generadas por IA según tu perfil',9.99,30,'Todo del Básico,Rutinas generadas por IA,Plan de recetas personalizado por IA,Recomendaciones adaptadas a tu objetivo','activo','2026-02-02 17:06:25','2026-05-19 14:36:07'),(3,'Plan Experto','Entrenador personal real asignado con seguimiento completo',19.99,30,'Todo del Avanzado,Entrenador personal asignado,Seguimiento de rutinas personalizado,Plan de alimentación supervisado,Soporte directo con el entrenador','activo','2026-05-12 17:15:45','2026-05-19 14:35:51');
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
  KEY `idx_categoria` (`id_categoria`),
  KEY `idx_estado` (`estado`),
  CONSTRAINT `fk_prod_cat` FOREIGN KEY (`id_categoria`) REFERENCES `categorias_productos` (`id_categoria`) ON DELETE SET NULL,
  CONSTRAINT `productos_ibfk_1` FOREIGN KEY (`id_categoria`) REFERENCES `categorias_productos` (`id_categoria`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productos`
--

LOCK TABLES `productos` WRITE;
/*!40000 ALTER TABLE `productos` DISABLE KEYS */;
INSERT INTO `productos` VALUES (1,'Vitamina Omega-3','Suplemento de ácidos grasos Omega-3 ESN Total Kinetic Sport',30.99,50,6,'products/vitamina-omega3.jpg','disponible','2026-04-27 14:27:28','2026-05-12 17:15:45'),(2,'Vitamina Zinc','Suplemento de Zinc ESN TKS para el sistema inmunológico',31.99,50,6,'products/vitamina-zinc.jpg','disponible','2026-04-27 14:27:28','2026-05-12 17:15:45'),(3,'Melatonina','Melatonina ESN Total Kinetic Sport para mejorar el descanso',22.99,50,6,'products/melatonina.jpg','disponible','2026-04-27 14:27:28','2026-05-12 17:15:45'),(4,'Vitamina Kidney','Suplemento vitamínico para la salud renal',20.99,50,6,'products/vitamina-kidney.png','disponible','2026-04-27 14:27:28','2026-05-12 17:15:45'),(5,'Vitamina Magnesium','Suplemento de Magnesio para músculos y sistema nervioso',22.99,50,6,'products/vitamina-magnesium.png','disponible','2026-04-27 14:27:28','2026-05-12 17:15:45'),(6,'Protein Probiotic+','Suplemento probiótico con proteína para la salud digestiva',18.99,50,6,'products/protein-probiotic.jpg','disponible','2026-04-27 14:27:28','2026-05-12 17:15:45'),(7,'Protein Whey Coffee Bar','Barrita proteica sabor café con whey protein',30.99,50,7,'products/bar-whey-coffee.jpg','disponible','2026-04-27 14:27:28','2026-05-12 17:15:45'),(8,'Protein Cacahuetes Bar','Barrita proteica sabor cacahuetes',31.99,50,7,'products/bar-cacahuetes.png','disponible','2026-04-27 14:27:28','2026-05-12 17:15:45'),(9,'Protein Avellanas Bar','Barrita proteica sabor avellanas',22.99,50,7,'products/bar-avellanas.jpg','disponible','2026-04-27 14:27:28','2026-05-12 17:15:45'),(10,'Protein Stracciatella Bar','Barrita proteica sabor stracciatella',20.99,50,7,'products/bar-stracciatella.jpg','disponible','2026-04-27 14:27:28','2026-05-12 17:15:45'),(11,'Protein Coconut Bar','Barrita proteica sabor coco',22.99,50,7,'products/bar-coconut.png','disponible','2026-04-27 14:27:28','2026-05-12 17:15:45'),(12,'Protein Pistacho Bar','Barrita proteica sabor pistacho',18.99,50,7,'products/bar-pistacho.png','disponible','2026-04-27 14:27:28','2026-05-12 17:15:45'),(13,'Protein Whey Coffee','Proteína en polvo sabor café con whey protein premium',43.99,50,5,'products/whey-coffee.png','disponible','2026-04-27 14:27:28','2026-05-12 17:15:45'),(14,'Protein Whey Chocolate','Proteína en polvo sabor chocolate con whey protein premium',43.99,50,5,'products/whey-chocolate.jpg','disponible','2026-04-27 14:27:28','2026-05-12 17:15:45'),(15,'Protein Whey Vanilla','Proteína en polvo sabor vainilla con whey protein premium',43.99,50,5,'products/whey-vanilla.png','disponible','2026-04-27 14:27:28','2026-05-12 17:15:45'),(16,'Protein Cacahuetes','Proteína en polvo sabor cacahuetes premium',49.99,50,5,'products/cacahuetes.png','disponible','2026-04-27 14:27:28','2026-05-12 17:15:45'),(17,'Protein Avellanas','Proteína en polvo sabor avellanas premium',38.99,50,5,'products/avellanas.jpg','disponible','2026-04-27 14:27:28','2026-05-12 17:15:45'),(18,'Protein Stracciatella','Proteína en polvo sabor stracciatella premium',42.99,50,5,'products/stracciatella.png','disponible','2026-04-27 14:27:28','2026-05-12 17:15:45'),(19,'Protein Coconut','Proteína en polvo sabor coco premium',35.99,50,5,'products/coconut.png','disponible','2026-04-27 14:27:28','2026-05-12 17:15:45'),(20,'Protein Pistacho','Proteína en polvo sabor pistacho premium',49.99,50,5,'products/pistacho.png','disponible','2026-04-27 14:27:28','2026-05-12 17:15:45');
/*!40000 ALTER TABLE `productos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `progreso_ejercicios`
--

DROP TABLE IF EXISTS `progreso_ejercicios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `progreso_ejercicios` (
  `id_progreso` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `id_ejercicio` int NOT NULL,
  `series` int DEFAULT NULL,
  `peso` decimal(8,2) DEFAULT NULL,
  `repeticiones` int DEFAULT NULL,
  `fecha` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_progreso`),
  KEY `id_usuario` (`id_usuario`),
  KEY `id_ejercicio` (`id_ejercicio`),
  CONSTRAINT `progreso_ejercicios_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE,
  CONSTRAINT `progreso_ejercicios_ibfk_2` FOREIGN KEY (`id_ejercicio`) REFERENCES `ejercicios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `progreso_ejercicios`
--

LOCK TABLES `progreso_ejercicios` WRITE;
/*!40000 ALTER TABLE `progreso_ejercicios` DISABLE KEYS */;
/*!40000 ALTER TABLE `progreso_ejercicios` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'admin','Administrador del sistema con acceso completo','2026-02-02 17:06:25'),(2,'usuario','Usuario normal con acceso básico','2026-02-02 17:06:25'),(3,'premium','Usuario premium con acceso a funciones avanzadas','2026-02-02 17:06:25'),(4,'entrenador','Entrenador personal con acceso a gestión de clientes','2026-05-19 14:35:51');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rutina_ejercicios`
--

DROP TABLE IF EXISTS `rutina_ejercicios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rutina_ejercicios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_rutina` int NOT NULL,
  `id_ejercicio` int NOT NULL,
  `series` int NOT NULL DEFAULT '3',
  `repeticiones` int NOT NULL DEFAULT '10',
  `peso_objetivo` decimal(8,2) DEFAULT NULL,
  `descanso_segundos` int DEFAULT '60',
  `orden` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `fk_re_rutina` (`id_rutina`),
  KEY `fk_re_ejercicio` (`id_ejercicio`),
  CONSTRAINT `fk_re_ejercicio` FOREIGN KEY (`id_ejercicio`) REFERENCES `ejercicios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_re_rutina` FOREIGN KEY (`id_rutina`) REFERENCES `rutinas` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rutina_ejercicios`
--

LOCK TABLES `rutina_ejercicios` WRITE;
/*!40000 ALTER TABLE `rutina_ejercicios` DISABLE KEYS */;
/*!40000 ALTER TABLE `rutina_ejercicios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rutinas`
--

DROP TABLE IF EXISTS `rutinas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rutinas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `nombre` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `dias_semana` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nivel` enum('Baja','Media','Alta') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'Media',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_rutina_usuario` (`id_usuario`),
  CONSTRAINT `fk_rutina_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rutinas`
--

LOCK TABLES `rutinas` WRITE;
/*!40000 ALTER TABLE `rutinas` DISABLE KEYS */;
/*!40000 ALTER TABLE `rutinas` ENABLE KEYS */;
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
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_suscripcion`),
  KEY `id_plan` (`id_plan`),
  KEY `idx_usuario` (`id_usuario`),
  KEY `idx_estado` (`estado`),
  KEY `idx_fechas` (`fecha_inicio`,`fecha_fin`),
  CONSTRAINT `fk_susc_plan` FOREIGN KEY (`id_plan`) REFERENCES `planes_suscripcion` (`id_plan`) ON DELETE RESTRICT,
  CONSTRAINT `fk_susc_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE,
  CONSTRAINT `suscripciones_usuarios_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE,
  CONSTRAINT `suscripciones_usuarios_ibfk_2` FOREIGN KEY (`id_plan`) REFERENCES `planes_suscripcion` (`id_plan`) ON DELETE RESTRICT
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
  `apellidos` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `foto_perfil` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telefono` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
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
  `estado_cuenta` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'activo',
  `plan` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'basic',
  `ultimo_acceso` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_email` (`email`),
  KEY `idx_rol` (`id_rol`),
  CONSTRAINT `fk_user_rol` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id_rol`) ON DELETE SET NULL,
  CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id_rol`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'admin@fitmeal.com','$2b$10$hg98ly5J12GKk3fQ4uvyROo3E.tKANao/SRQnGYVIGEUQiwQyYonC','Admin','FitMeal',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,1,'activo','basic',NULL,'2026-02-02 17:29:02','2026-02-02 17:29:02'),(2,'Kevincasled@gmail.com','$2b$10$vDLWug0/FwEIRzVIqPlKk.p79GxBjoPAVP7WuGbUt05dcRx299iuq','kevin','Castellon',NULL,'692552075','2004-04-08',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,2,'activo','basic','2026-04-08 17:20:45','2026-02-11 17:59:43','2026-04-08 17:20:45'),(3,'admin1@gmail.com','$2b$10$vJE7JaxjCbX4T25qaGUfU.oTolB6ZZr5mwM71r722AlbnApIbbMia','admin','1',NULL,NULL,'2004-04-08',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,2,'activo','basic',NULL,'2026-04-08 16:38:32','2026-04-08 16:38:32'),(4,'testuser2@test.com','$2b$10$ffT89/TcW3DI/G7bD5gIw.w5uAMLTDXhXc/9m7BAR7qbTE9IjPMFa','Test','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,2,'activo','basic',NULL,'2026-04-20 14:00:39','2026-04-20 14:00:39');
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

-- Dump completed on 2026-05-19 14:36:29
