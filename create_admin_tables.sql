-- Crear tabla de recetas si no existe
CREATE TABLE IF NOT EXISTS recetas (
  id_receta INT PRIMARY KEY AUTO_INCREMENT,
  titulo VARCHAR(255) NOT NULL,
  descripcion TEXT,
  instrucciones TEXT,
  tiempo_preparacion INT,
  dificultad ENUM('facil', 'medio', 'dificil'),
  calorias INT,
  proteinas DECIMAL(5,2),
  carbohidratos DECIMAL(5,2),
  grasas DECIMAL(5,2),
  imagen VARCHAR(500),
  id_usuario INT,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE SET NULL
);

-- Crear tabla de ejercicios si no existe
CREATE TABLE IF NOT EXISTS ejercicios (
  id_ejercicio INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  grupo_muscular VARCHAR(100),
  dificultad ENUM('principiante', 'intermedio', 'avanzado'),
  instrucciones TEXT,
  imagen VARCHAR(500),
  video_url VARCHAR(500),
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Crear tabla de roles si no existe
CREATE TABLE IF NOT EXISTS roles (
  id_rol INT PRIMARY KEY AUTO_INCREMENT,
  nombre_rol VARCHAR(50) NOT NULL UNIQUE,
  descripcion TEXT
);

-- Insertar roles básicos si no existen
INSERT IGNORE INTO roles (id_rol, nombre_rol, descripcion) VALUES
(1, 'admin', 'Administrador del sistema'),
(2, 'usuario', 'Usuario normal');

-- Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_recetas_usuario ON recetas(id_usuario);
CREATE INDEX IF NOT EXISTS idx_recetas_titulo ON recetas(titulo);
CREATE INDEX IF NOT EXISTS idx_ejercicios_grupo ON ejercicios(grupo_muscular);
CREATE INDEX IF NOT EXISTS idx_ejercicios_dificultad ON ejercicios(dificultad);