-- Script de inicialización de la base de datos
-- Se ejecuta automáticamente cuando se crea el contenedor de PostgreSQL

-- Crear extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Crear esquemas si es necesario
-- CREATE SCHEMA IF NOT EXISTS portfolio;

-- Aquí se pueden añadir tablas iniciales, datos de prueba, etc.
-- Las migraciones de Alembic se encargarán del resto

-- Ejemplo de datos iniciales (opcional)
-- INSERT INTO users (email, name, is_admin) VALUES 
-- ('admin@portfolio.com', 'Administrator', true);

-- Mensaje de confirmación
SELECT 'Database initialized successfully' as message;
